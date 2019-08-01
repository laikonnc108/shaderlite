'use strict';


module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const CustomersModel = bookshelf.Model.extend({
        tableName: 'customers',
        soft: ['deleted_at'],
        trans: function() {
            return this.hasMany(HasTransModel,'customer_id')
        }
    });

    var HasTransModel = bookshelf.Model.extend({ tableName: 'customer_trans' })
    
    return CustomersModel;
};