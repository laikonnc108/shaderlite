'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CustomersModel = bookshelf.Model.extend({
        tableName: 'customers',
        soft: ['deleted_at']
    });
    
    return CustomersModel;
};