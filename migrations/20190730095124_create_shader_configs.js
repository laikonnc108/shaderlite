  /**
   * @typedef {import('knex')} knex
   */

/**@param {knex} knex */
exports.up = function(knex) {
    return knex.schema.createTable('shader_configs', function(table){
        table.increments();
        table.string('config_name').notNullable()
        table.text('config_value')
        table.string('config_verify')
        table.string('shader_name')
        table.string('category')
        table.string('sub_category')
        table.timestamp('deleted_at')
    })
};
/**@param {knex} knex */
exports.down = function(knex) {
    return knex.schema.dropTable('shader_configs')
};
