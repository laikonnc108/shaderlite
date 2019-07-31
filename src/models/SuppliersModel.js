'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const SuppliersModel = bookshelf.Model.extend({
        tableName: 'suppliers',
        soft: ['deleted_at']
    });
    
    return SuppliersModel;
};