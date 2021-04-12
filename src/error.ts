export interface IError {
  code: string
  message: string
  rowNumber: number
  columnNumber: number
  cells: string[]
}

export interface ICellError extends IError {}
