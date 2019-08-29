'use strict';

module.exports = (bookshelf) => {
    /**@type {import('bookshelf').Model} */
    const IncomingsModel = bookshelf.Model.extend({
        tableName: 'incomings',
        supplier() {
            return this.belongsTo(SupplierModel,'supplier_id')
        },
        product() {
            return this.belongsTo(ProductModel,'product_id')
        },
        cashflows() {
            return this.hasMany(RelCashflow,'incoming_id')
        }
    })

    let SupplierModel = bookshelf.Model.extend({ tableName: 'suppliers' })
    let ProductModel = bookshelf.Model.extend({ tableName: 'products' })
    let RelCashflow = bookshelf.Model.extend({ tableName: 'cashflow' })

    // var HasTransModel = bookshelf.Model.extend({ tableName: 'customer_trans' })
    return IncomingsModel;
};