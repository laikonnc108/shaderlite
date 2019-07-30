  /**
   * @typedef {import('knex')} knex
   */

/**@param {knex} knex */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table){
        table.increments();
        table.string('name')
        table.string('username').notNullable()
        table.string('password').notNullable()
        table.string('user_type')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at')
    })
};
/**@param {knex} knex */
exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
