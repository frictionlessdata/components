export interface IError {
  code: string
  name: string
  message: string
  description: string
  rowNumber: number
  columnNumber: number
  cells: string[]
}

export interface ICellError extends IError {}
