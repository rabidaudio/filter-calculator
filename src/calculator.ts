import { compile, Complex, evaluate, isNaN, isPositive } from 'mathjs'
import { Hertz, Ohms, Farads, ohms, Unitless, unitless } from './units'
export type Discriminator = { r: Ohms; m: Unitless } | { c: Farads; m: Unitless }

export type Component = {
  name: string
  type: 'r' | 'c'
  value: Ohms | Farads
}

export type Components = Component[]

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
  solve(q: Unitless, cutoff: Hertz, components: Components)
  compute(f0: Hertz, q: Unitless, discriminator: Discriminator): Components
  transferFunction: (components: Components) => TransferFunction | null

  layoutURL: string
}

export function getCalculator(order: number, type: 'lowpass' | 'highpass' | 'bandpass'): Topology {
  switch (order) {
    case 2:
      switch (type) {
        case 'lowpass':
          return new SecondOrderLowPassSallenKey()
      }
  }
  throw new Error('unimplemented')
}

// https://upload.wikimedia.org/wikipedia/commons/3/3f/Sallen-Key_Lowpass_General.svg
// https://upload.wikimedia.org/wikipedia/commons/7/71/Sallen-Key_Highpass_General.svg
// https://upload.wikimedia.org/wikipedia/commons/e/ee/VCVS_Filter_Bandpass_General.svg

class SecondOrderLowPassSallenKey implements Topology {
  get layoutURL() {
    return 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Sallen-Key_Lowpass_General.svg'
  }

  solve(f0: Hertz, q: Unitless, components: Components) {
    if (!f0 || !q || isNaN(f0) || isNaN(q) || !isPositive(f0) || !isPositive(q)) {
      console.log('not solvable')
      return components
    }
    if (components.length === 0) {
      // pick some arbitrary but sensible defaults
      return this.compute(f0, q, { m: unitless(1), r: ohms('10 kohm') })
    }
    let discriminator: Discriminator
    // changed = changed || 'r1'
    const r1 = components.find((c) => c.name === 'r1').value
    const r2 = components.find((c) => c.name === 'r2').value
    const c1 = components.find((c) => c.name === 'c1').value
    const c2 = components.find((c) => c.name === 'c2').value

    const m: Unitless = unitless(evaluate('sqrt(r1/r2)', { r1, r2 }))
    const r: Ohms = evaluate('m*r2', { m, r2 })
    const n: Unitless = evaluate('sqrt(c1/c2)', { c1, c2 })
    const c: Farads = evaluate('n*c2', { n, c2 })
    discriminator = { r, m }
    // switch (changed) {
    //   case 'r1':
    //   case 'r2':
    //     discriminator = { r, m }
    //     break
    //   case 'c1':
    //   case 'c2':
    //     discriminator = { c, m }
    //     break
    // }
    return this.compute(f0, q, discriminator)
  }

  compute(f0: Hertz, q: Unitless, discriminator: Discriminator): Components {
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
    return [
      { name: 'r1', type: 'r', value: r1 },
      { name: 'r2', type: 'r', value: r2 },
      { name: 'c1', type: 'c', value: c1 },
      { name: 'c2', type: 'c', value: c2 },
    ]
  }

  transferFunction(components: Components): TransferFunction | null {
    if (components.length === 0) {
      return null
    }

    const values = components.reduce((v, c) => ({ ...v, [c.name]: c.value }), {})

    const w0 = evaluate('1/sqrt(r1*r2*c1*c2)', values).value
    const a = evaluate('((r1+r2)/(r1*r2))/c1/2', values).value
    const sFunc = compile('2*pi*i*f')
    const func = compile('(w0^2)/(s^2 + 2*a*s + w0^2)')
    return (f) => {
      const s = sFunc.evaluate({ f })
      return func.evaluate({ w0, a, s })
    }
  }
}
