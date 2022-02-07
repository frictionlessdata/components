// TODO: improve type system

export interface IError {
  code: string
  name: string
  tags: string[]
  message: string
  description: string
  rowPosition?: number
  fieldPosition?: number
  labels?: string[]
  cells?: string[]
}

export type IHeaderError = IError

export type IRowError = IError
