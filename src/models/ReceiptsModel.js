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
        },
        cashflow() {
            return this.belongsTo(RelCashflow,'cashflow_id')
        }
    });
    let RelSupplier = bookshelf.Model.extend({ tableName: 'suppliers' })
    let RelCashflow = bookshelf.Model.extend({ tableName: 'cashflow' })
    let RelReceiptDetails = bookshelf.Model.extend({ tableName: 'receipt_details' })
    
    let detailsColl = bookshelf.Collection.extend({
        model: RelReceiptDetails
    })
    
    return {model: ReceiptsModel, detailsColl: detailsColl}
};