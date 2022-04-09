import { unit } from 'mathjs'
import type { Unit } from 'mathjs'

export type Ohms = Unit
export type Farads = Unit
export type Hertz = Unit
export type Unitless = Unit

function converter<T extends Unit>(units: string): (value: string) => T {
  return (value) => {
    try {
      return unit(value as any, units) as T
    } catch {
      const v = unit(value) as T
      v.to(units) // ensure convertible, will raise error if not
      return v
    }
  }
}

export const ohms: (value: string | number) => Ohms = converter('ohms')
export const farads: (value: string | number) => Farads = converter('F')
export const hertz: (value: string | number) => Hertz = converter('Hz')
export const unitless: (value: string | number) => Unitless = unit
