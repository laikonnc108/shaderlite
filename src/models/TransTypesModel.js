'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const TransTypesModel = bookshelf.Model.extend({tableName: 'trans_types'});
    
    return TransTypesModel;
};