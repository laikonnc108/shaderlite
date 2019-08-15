'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const SuppliersModel = bookshelf.Model.extend({
        tableName: 'suppliers',
        soft: ['deleted_at'],
        trans: function() {
            return this.hasMany(RelSupplierTrans,'supplier_id')
        }
    });

    var RelSupplierTrans = bookshelf.Model.extend({ tableName: 'supplier_trans' })
    
    return SuppliersModel;
};