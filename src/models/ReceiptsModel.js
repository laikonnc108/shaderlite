'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const ReceiptsModel = bookshelf.Model.extend({
        tableName: 'receipts',
        supplier() {
            return this.belongsTo(RelSupplier,'supplier_id')
        },
    });
    let RelSupplier = bookshelf.Model.extend({ tableName: 'suppliers' })

    return ReceiptsModel;
};