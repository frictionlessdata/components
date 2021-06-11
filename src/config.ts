import { IDict } from './common'

// General

export const IS_BROWSER = typeof window !== 'undefined'

// Schema

export const FIELD_TYPES_AND_FORMATS: IDict<string[]> = {
  string: ['default', 'email', 'uri', 'binary', 'uuid'],
  number: ['default'],
  integer: ['default'],
  boolean: ['default'],
  object: ['default'],
  array: ['default'],
  date: ['default', 'custom', 'any'],
  time: ['default', 'custom', 'any'],
  datetime: ['default', 'custom', 'any'],
  year: ['default'],
  yearmonth: ['default'],
  duration: ['default'],
  geopoint: ['default', 'array', 'object'],
  geojson: ['default', 'topojson'],
  any: ['default'],
}
