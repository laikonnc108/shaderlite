'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const DealerTransModel = bookshelf.Model.extend({
        tableName: 'dealer_trans',
    });

    return DealerTransModel;
};