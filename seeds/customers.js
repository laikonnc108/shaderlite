
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('customers').del()
    .then(function () {
      // Inserts seed entries
      return knex('customers').insert([
        { name: 'عبدالقادر بو علم', debt: 115.5},
        { name: 'rowValue2'},
        { name: 'rowValue3'}
      ]);
    });
};
