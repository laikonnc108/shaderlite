'use strict';

module.exports = (bookshelf) => {
    
    /**@type {import('bookshelf').Model} */
    const ShaderConfigsModel = bookshelf.Model.extend({
        tableName: 'shader_configs',
    }, 
    /*
    {
        findAll: function(filter) {
            return this.forge().where(filter).fetchAll()
        },
    }
    */
   );
    
    /**@type {import('bookshelf').Collection} */
    /*
    const ShaderConfigsCollection = bookshelf.Collection.extend({
        model: ShaderConfigsModel
    });
    */

    return ShaderConfigsModel;
};