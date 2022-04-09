import { compile, Complex, evaluate, isNaN, isPositive } from 'mathjs'
import { Hertz, Ohms, Farads, ohms, Unitless, unitless } from './units'
export type Discriminator = { r: Ohms; m: Unitless } | { c: Farads; m: Unitless }

export type Params = {}

export type ComponentValues = {
  r1: Ohms
  r2: Ohms
  c1: Farads
  c2: Farads
}

// vo/vi = z3*z4/(z1*z2 + z3*(z1+z2) + z3*z4)

// LowPass
// z1=r1 z2=r2 z3=1/sc1 z4=1/sc2
// 2*pi*f0 = 1/sqrt(r1*r2*c1*c2)
// q = sqrt(r1*r2*c1*c2) / (c2 * (r1+r2))
// H(s) = wo^2 / (s^2 + w0/Q s + wo^2)

// HP
// q = sqrt(r1*r2*c1*c2) / (r1 * (c1+c2))
// H(s) = s^2 / (s^2 + w0/Q s + wo^2)

// BP
// 2*pi*f0 = sqrt(1/(r1*r2*c1*c2) * (rf+r1)/rf)
// G = 1 + rb/ra

export type TransferFunction = (f: Hertz) => Complex

export interface Topology {
  solve(q: Unitless, cutoff: Hertz, values: ComponentValues | null, changed: string)
  compute(f0: Hertz, q: Unitless, discriminator: Discriminator): ComponentValues
  transferFunction: (values: ComponentValues) => TransferFunction
}

export class SecondOrderLowPassSallenKey implements Topology {
  solve(f0: Hertz, q: Unitless, values: ComponentValues | null, changed: string | null) {
    if (isNaN(f0) || isNaN(q) || !isPositive(f0) || !isPositive(q)) {
      console.log('not solvable')
      return values
    }

    if (Object.entries(values).length === 0) {
      // pick some arbitrary but sensible defaults
      return this.compute(f0, q, { m: unitless(1), r: ohms('10 kohm') })
    }
    // return { r1: ohms('100'), r2: ohms('3'), c1: farads('5'), c2: farads('6') }
    let discriminator: Discriminator
    changed = changed || 'r1'
    const { r1, r2, c1, c2 } = values
    const m: Unitless = unitless(evaluate('sqrt(r1/r2)', { r1, r2 }))
    const r: Ohms = evaluate('m*r2', { m, r2 })
    const n: Unitless = evaluate('sqrt(c1/c2)', { c1, c2 })
    const c: Farads = evaluate('n*c2', { n, c2 })
    switch (changed) {
      case 'r1':
      case 'r2':
        discriminator = { r, m }
        break
      case 'c1':
      case 'c2':
        discriminator = { c, m }
        break
    }
    return this.compute(f0, q, discriminator)
  }

  compute(f0: Hertz, q: Unitless, discriminator: Discriminator): ComponentValues {
    const rc = evaluate('1/(2*pi*f0)', { f0 })
    let r1, r2, r: Ohms
    let c1, c2, c: Farads
    let m: Unitless = discriminator.m
    let n: Unitless
    if ('r' in discriminator) {
      r = discriminator.r
      c = evaluate('rc / r', { rc, r })
    } else if ('c' in discriminator) {
      c = discriminator.c
      r = evaluate('rc / c', { rc, c })
    } else {
      throw new Error('invalid inputs')
    }
    // q = m*n/(m^2 + 1)
    // n = (q * (m * m + 1)) / m
    // TODO: we can calculate the other way too, complex solution will result in
    // negative component values for one solution
    n = unitless(evaluate('(q * (m^2 + 1)) / m', { q, m }))
    r1 = evaluate('r * m', { r, c, m, n })
    r2 = evaluate('r / m', { r, c, m, n })
    c1 = evaluate('c * n', { r, c, m, n })
    c2 = evaluate('c / n', { r, c, m, n })
    return { r1, r2, c1, c2 }
  }

  transferFunction(values: ComponentValues): TransferFunction {
    const w0 = evaluate('1/sqrt(r1*r2*c1*c2)', values)
    const a = evaluate('((r1+r2)/(r1*r2))/c1/2', values)
    const sFunc = compile('2*pi*i*f')
    const func = compile('(w0^2)/(s^2 + 2*a*s + w0^2)')
    return (f) => {
      const s = sFunc.evaluate({ f })
      return func.evaluate({ w0, a, s })
    }
  }
}
