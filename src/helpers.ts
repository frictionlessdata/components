import { IDict } from './common'
import * as config from './config'

// General

export function removeBaseUrl(text: string) {
  return text.replace(/https:\/\/raw\.githubusercontent\.com\/\S*?\/\S*?\/\S*?\//g, '')
}

export function splitFilePath(path: string) {
  const parts = path.split('/')
  return {
    name: parts.pop(),
    base: parts.join('/'),
    sep: parts.length ? '/' : '',
  }
}

// Schema

export function exportSchema(columns: IDict[], metadata: IDict) {
  return { fields: columns.map((column) => column.field), ...metadata }
}

export function getFieldTypes() {
  return Object.keys(config.FIELD_TYPES_AND_FORMATS)
}

export function getFieldFormats(type: string) {
  return config.FIELD_TYPES_AND_FORMATS[type] || []
}
