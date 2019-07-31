
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'momen',user_type:'developer',password:'momen'},
        {id: 2, username: 'admin',user_type:'admin',password:'admin'},
        {id: 3, username: 'user',user_type:'editor',password:'user'}
      ]);
    });
};
