'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CustomerTransModel = bookshelf.Model.extend({
        tableName: 'customer_trans',
        outgoing() {
            return this.belongsTo(RelOutgoingModel,'outgoing_id')
        },
        product() {
            return this.belongsTo(RelProductModel,'product_id')
        }
    });

    let RelOutgoingModel = bookshelf.Model.extend({ tableName: 'outgoings' })
    let RelProductModel = bookshelf.Model.extend({ tableName: 'products' })
    
    return CustomerTransModel;
};