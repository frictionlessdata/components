import fetch from 'node-fetch'
import spec from '../src/'

// Tests

it('should be up-to-date', async () => {
  const url =
    'https://raw.githubusercontent.com/frictionlessdata/data-quality-spec/master/spec.json'
  const res = await fetch(url)
  const data = await res.json()
  expect(spec).toEqual(data)
})
