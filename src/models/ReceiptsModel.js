'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const ReceiptsModel = bookshelf.Model.extend({
        tableName: 'receipts',
        supplier() {
            return this.belongsTo(RelSupplier,'supplier_id')
        },
        details() {
            return this.hasMany(RelReceiptDetails,'receipt_id')
        }
    });
    let RelSupplier = bookshelf.Model.extend({ tableName: 'suppliers' })
    let RelReceiptDetails = bookshelf.Model.extend({ tableName: 'receipt_details' })

    return ReceiptsModel;
};