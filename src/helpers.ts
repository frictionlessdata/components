import { IDict } from './common'

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
