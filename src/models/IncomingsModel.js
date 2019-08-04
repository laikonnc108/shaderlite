'use strict';

module.exports = (bookshelf) => {
    /**@type {import('bookshelf').Model} */
    const IncomingsModel = bookshelf.Model.extend({
        tableName: 'incomings',
    });

    // var HasTransModel = bookshelf.Model.extend({ tableName: 'customer_trans' })
    return IncomingsModel;
};