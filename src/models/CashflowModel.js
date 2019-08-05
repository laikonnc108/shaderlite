'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CashflowModel = bookshelf.Model.extend({tableName: 'cashflow'});
    
    return CashflowModel;
};