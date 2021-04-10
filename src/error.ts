export interface IError {
  code: string
  message: string
}

export interface ICellError extends IError {
  rowNumber: number
  columnNumber: number
}
