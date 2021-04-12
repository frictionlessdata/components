// Legacy
// TODO: remove this

import { render } from './render'
import { Report } from './components/Report'
export default { render, Report }
export { render, Report }

// Styles

require('./styles/base.css')

// Modules

export * from './components/Report'
export * from './components/ReportDemo'
export * from './components/ReportError'
export * from './components/ReportTable'
export * from './components/ReportTask'
export * from './render'
