  /**
   * @typedef {import('knex')} knex
   */

/**@param {knex} knex */
exports.up = function(knex) {
    return knex.schema.createTable('customers', function(table){
        table.increments();
        table.string('name').notNullable()
        table.float('debt')
        table.string('phone')
        table.string('address')
        table.string('notes')
        table.boolean('is_self')
        table.timestamp('deleted_at')
    })
};
/**@param {knex} knex */
exports.down = function(knex) {
    return knex.schema.dropTable('customers')
};
