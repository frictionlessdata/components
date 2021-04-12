export interface IResource {
  path: string
  schema: ISchema
}

export interface ISchema {
  fields: IField[]
}

export interface IField {
  name: string
  type: string
}
