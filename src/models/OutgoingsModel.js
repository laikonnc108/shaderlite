'use strict';

module.exports = (bookshelf) => {
    /**@type {import('bookshelf').Model} */
    const OutgoingsModel = bookshelf.Model.extend({
        tableName: 'outgoings',
        supplier() {
            return this.belongsTo(SupplierModel,'supplier_id')
        },
        product() {
            return this.belongsTo(ProductModel,'product_id')
        },
        customer() {
            return this.belongsTo(CustomerModel,'customer_id')
        },
        customers_daily() {
            return this.belongsTo(CustomerDaily,'customer_id')
        }
    });
    let SupplierModel = bookshelf.Model.extend({ tableName: 'suppliers' })
    let ProductModel = bookshelf.Model.extend({ tableName: 'products' })
    let CustomerModel = bookshelf.Model.extend({ tableName: 'customers' })
    let CustomerDaily = bookshelf.Model.extend({ tableName: 'customers_daily' })

    // var HasTransModel = bookshelf.Model.extend({ tableName: 'customer_trans' })
    return OutgoingsModel;
};