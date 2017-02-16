//@flow
import { schema } from 'normalizr'

export const project = new schema.Entity('projects')
export const ddocument = new schema.Entity('ddocuments')
export const carrier = new schema.Entity('carriers')
export const product = new schema.Entity('products')
export const source = new schema.Entity('sources')
export const klass = new schema.Entity('classes')
export const value = new schema.Entity('values')
export const product_type = new schema.Entity('product_types')
export const dynamic_attribute = new schema.Entity('dynamic_attributes')

klass.define({
  values: new schema.Array(value)
})

product.define({
  carrier,
  classes: new schema.Array(klass)
})

ddocument.define({
  carrier,
  products: new schema.Array(product),
  sources: new schema.Array(source),
})

project.define({
  documents: new schema.Array(ddocument)
})

product_type.define({
  dynamic_attributes: new schema.Array(dynamic_attribute)
})
