'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const SuppliersModel = bookshelf.Model.extend({
        tableName: 'products',
        soft: ['deleted_at']
    });
    
    return SuppliersModel;
};