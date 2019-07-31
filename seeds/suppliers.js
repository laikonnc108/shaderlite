
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('suppliers').del()
    .then(function () {
      // Inserts seed entries
      return knex('suppliers').insert([
        {id: 1, name: 'الزهري'},
        {id: 2, name: 'عبدالرحمن '},
        {id: 3, name: 'فواز'}
      ]);
    });
};
