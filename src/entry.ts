// TODO: it's a hack for webpack
require('./styles/report.css')
require('./styles/workflow.css')
const { Report } = require('./components/Report')
const { Workflow } = require('./components/Workflow')
const { render } = require('./render')
export { Report, Workflow, render }
