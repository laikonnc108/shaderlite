'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const ReceiptsModel = bookshelf.Model.extend({tableName: 'receipts'});
    
    return ReceiptsModel;
};