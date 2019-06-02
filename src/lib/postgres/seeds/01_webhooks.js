exports.seed = function(knex, Promise) {
    return knex('webhooks').insert([
      {
        owner_id: "test",
        zeit_token: "test",
        webhook_token: "test",
        webhook_id: "test",
        guild_id: "test",
        channel_id: "test"
      }
    ]);
  };
  
  