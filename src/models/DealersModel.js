'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const DealersModel = bookshelf.Model.extend({
        tableName: 'dealers',
        soft: ['deleted_at'],
        trans: function() {
            return this.hasMany(RelDealerTrans,'dealer_id')
        }
    });

    var RelDealerTrans = bookshelf.Model.extend({ tableName: 'dealer_trans' })
    
    return DealersModel;
};