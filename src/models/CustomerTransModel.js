'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CustomerTransModel = bookshelf.Model.extend({
        tableName: 'customer_trans'
    });
    
    return CustomerTransModel;
};