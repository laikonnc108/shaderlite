'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const UsersModel = bookshelf.Model.extend({
        tableName: 'users',
        soft: ['deleted_at']
    });
    
    return UsersModel;
};