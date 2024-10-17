import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Example create questio title')

  expect(slug.value).toEqual('example-create-questio-title')
})
