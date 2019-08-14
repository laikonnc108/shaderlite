'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CashflowModel = bookshelf.Model.extend({
        tableName: 'cashflow',
        outgoing: function() {
            return this.belongsTo(RelOutgoing,'outgoing_id')
        },
        customer: function() {
            return this.belongsTo(RelCustomer,'customer_id')
        },
        supplier: function() {
            return this.belongsTo(RelSupplier,'supplier_id')
        },
    });
    
    let RelOutgoing = bookshelf.Model.extend({tableName: 'outgoings'});
    let RelCustomer = bookshelf.Model.extend({tableName: 'customers'});
    let RelSupplier = bookshelf.Model.extend({tableName: 'suppliers'});

    return CashflowModel;
};