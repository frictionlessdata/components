import { render } from './render'
import { Report } from './components/Report'
import { Form } from './components/Form'
import spec from './spec.json'
require('./styles/base.css')

// TODO: consider droping this duplication for v3
export default { render, Report, Form, spec }
export { render, Report, Form, spec }
