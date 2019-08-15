'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const SupplierTransModel = bookshelf.Model.extend({
        tableName: 'supplier_trans',
    });

    return SupplierTransModel;
};