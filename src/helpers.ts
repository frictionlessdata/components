import { omit, forOwn } from 'lodash'
import { Readable } from 'stream'
import { v4 as uuid4 } from 'uuid'
import { Table } from 'tableschema'
import { IDict } from './common'
import * as config from './config'
// Schema

export async function importSchema(source?: string | File, schema?: IDict | File) {
  // Get table/rows/schema
  const tableSource = await prepareTableSource(source)
  const tableOptions = await prepareTableOptions(schema)
  const table = (await Table.load(tableSource, tableOptions)) as any
  const rows = await table.read({ limit: 5, cast: false })
  if (rows.length) await table.infer()

  // Compose columns
  const columns: IDict[] = []
  if (table.schema && table.schema.descriptor.fields) {
    for (const [index, field] of table.schema.descriptor.fields.entries()) {
      const values = rows
        .map((row: any) => row[index])
        .filter((value: any) => value !== undefined)
      const primaryKey = table.schema.descriptor.primaryKey
        ? field.name.indexOf(table.schema.descriptor.primaryKey) === -1
        : false
      columns.push(createColumn(index, field, primaryKey, values))
    }
  }

  // Compose metadata
  let metadata = {}
  if (table.schema) {
    metadata = omit(table.schema.descriptor, 'fields')
    metadata = omit(table.schema.descriptor, 'primaryKey')
  }

  return { columns, metadata }
}

export function exportSchema(columns: IDict[], metadata: IDict) {
  let obj = {}
  const primaryKey: string[] = []
  metadata = omit(metadata, 'fields')
  if (columns.some((column) => column.field.primaryKey)) {
    columns.forEach((column) => {
      if (column.field.primaryKey) {
        primaryKey.push(column.field.name)
      }
    })
    obj = {
      fields: columns.map((column) => {
        const fieldObj = {
          description: column.field.description,
          format: column.field.format,
          name: column.field.name,
          title: column.field.title,
          type: column.field.type,
          constraints: column.field.constraints,
        }
        return fieldObj
      }),
      primaryKey: primaryKey,
      ...metadata,
    }
  } else {
    obj = {
      fields: columns.map((column) => {
        const fieldObj = {
          description: column.field.description,
          format: column.field.format,
          name: column.field.name,
          title: column.field.title,
          type: column.field.type,
          constraints: column.field.constraints,
        }
        return fieldObj
      }),
      ...metadata,
    }
  }

  return obj
}

export function getFieldTypes() {
  return Object.keys(config.FIELD_TYPES_AND_FORMATS)
}

export function getFieldFormats(type: string) {
  return config.FIELD_TYPES_AND_FORMATS[type] || []
}

export function createColumns(
  _fields: IDict[] = [],
  primaryKeys: string[] = [],
  values: any[] = []
) {
  const columns: IDict<any>[] = []
  _fields.forEach((field, index) => {
    const name = field.name || `field ${index + 1}`
    const primaryKey = primaryKeys.includes(name)
    columns.push(createColumn(index, field, primaryKey, values))
  })
  return columns
}

export function createColumn(
  index: number,
  field: IDict = {},
  primaryKey = false,
  values: any[] = []
) {
  const formats = getFieldFormats(field.type)
  const name = field.name || `field ${index + 1}`
  const title = field.title || 'Title'
  const description = field.description || 'Description'
  const type = formats.length ? field.type : 'string'
  const format = formats.includes(field.format) ? field.format : 'default'
  let constraintsAvailable = ['Select', 'required', 'unique']
  const constraintList: string[] = []
  if (field.constraints && Object.keys(field.constraints).length) {
    forOwn(field.constraints, function (key, value) {
      console.log(key)
      constraintsAvailable = constraintsAvailable.filter((constr: any) => {
        if (constr !== value) {
          return constr
        } else {
          constraintList.push(value)
          return null
        }
      })
    })
  }
  return {
    id: uuid4(),
    field: {
      ...field,
      name,
      title,
      description,
      type,
      format,
      constraintsAvailable,
      constraintList,
      primaryKey,
    },
    values,
  }
}

export async function prepareTableSource(source?: string | File) {
  // Source not provided
  if (!source) {
    return []
  }

  // Source uploaded
  if (source instanceof File) {
    if (!source.name.endsWith('csv')) return []
    const text = await readFile(source)
    return () => {
      const stream = new Readable()
      stream.push(text)
      stream.push(null)
      return stream
    }
  }

  // Source url
  if (!source.endsWith('csv')) return []
  return source
}

export async function prepareTableOptions(schema?: IDict | File) {
  // Schema not provided
  if (!schema) {
    return {}
  }

  // Schema uploaded
  if (schema instanceof File) {
    const text = await readFile(schema)
    return { schema: JSON.parse(text) }
  }

  // Schema url
  return { schema }
}

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.readAsText(file.slice(0, 65536))
    reader.onload = () => {
      const result = reader.result
      if (!result) return reject(new Error('Cannot read file'))
      if (result instanceof ArrayBuffer) return reject(new Error('Cannot read file'))
      resolve(result)
    }
    reader.onerror = () => reject(reader.error)
  })
}
