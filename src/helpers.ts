import { IReportTask, IReportError } from './common'

// General

export function getTaskReportErrors(task: IReportTask) {
  const groups: { [code: string]: IReportError } = {}
  for (const error of task.errors) {
    // Get group
    let group = groups[error.code]

    // Create group
    if (!group) {
      group = {
        code: error.code,
        rows: {},
        count: 0,
        headers: task.headers,
        messages: [],
      }
    }

    // Get row
    let row = group.rows[error['row-number'] || 0]

    // Create row
    if (!row) {
      let values = error.row || []
      if (!error['row-number']) {
        values = task.headers || []
      }
      row = {
        values,
        badcols: new Set(),
      }
    }

    // Ensure missing value
    if (error.code === 'missing-value') {
      row.values[error['column-number']! - 1] = ''
    }

    // Add row badcols
    if (error['column-number']) {
      row.badcols.add(error['column-number'])
    } else if (row.values) {
      row.badcols = new Set(row.values.map((_value, index) => index + 1))
    }

    // Save group
    group.count += 1
    group.messages.push(error.message)
    group.rows[error['row-number'] || 0] = row
    groups[error.code] = group
  }
  return groups
}

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
