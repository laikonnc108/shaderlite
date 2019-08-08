'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CustomerTransModel = bookshelf.Model.extend({
        tableName: 'customer_trans',
        outgoing() {
            return this.belongsTo(RelOutgoingModel,'outgoing_id')
        }
    });

    let RelOutgoingModel = bookshelf.Model.extend({ tableName: 'outgoings' })
    
    return CustomerTransModel;
};