import { MathType, unit } from 'mathjs'
import type { Unit } from 'mathjs'

export type Ohms = Unit
export type Farads = Unit
export type Hertz = Unit
export type Unitless = Unit

function converter<T extends Unit>(units: string): (value: any) => T {
  return (value) => {
    try {
      return unit(value, units) as T
    } catch {
      const v = unit(value) as T
      v.to(units) // ensure convertible, will raise error if not
      return v
    }
  }
}

export const ohms: (value: string | MathType) => Ohms = converter('ohms')
export const farads: (value: string | MathType) => Farads = converter('F')
export const hertz: (value: string | MathType) => Hertz = converter('Hz')
export const unitless: (value: string | MathType) => Unitless = unit
