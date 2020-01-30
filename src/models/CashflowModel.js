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
        dealer: function() {
            return this.belongsTo(RelDealer,'dealer_id')
        },
    });
    
    let RelOutgoing = bookshelf.Model.extend({tableName: 'outgoings'});
    let RelCustomer = bookshelf.Model.extend({tableName: 'customers'});
    let RelSupplier = bookshelf.Model.extend({tableName: 'suppliers'});
    let RelDealer = bookshelf.Model.extend({tableName: 'dealers'});

    return CashflowModel;
};