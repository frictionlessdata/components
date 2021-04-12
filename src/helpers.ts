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
