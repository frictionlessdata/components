import { render } from './render'
import { Report } from './components/Report'
import spec from './spec.json'
require('./styles/base.css')

// TODO: consider droping this duplication for v3
export default { render, Report, spec }
export { render, Report, spec }
