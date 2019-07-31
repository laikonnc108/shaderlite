
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('customers').del()
    .then(function () {
      // Inserts seed entries
      return knex('customers').insert([
        { name: 'عابد احمد صادق'},
        { name: 'ابو فوزي'},
        { name: 'كارم الدميري'}
      ]);
    });
};
