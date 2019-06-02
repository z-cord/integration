exports.up = function(knex, Promise) {
    return knex.schema.createTable("webhooks", function(tbl) {
        tbl.increments();
        tbl.string("owner_id").unique();
        tbl.string("zeit_token").notNullable();
        tbl.string("webhook_token").notNullable();
        tbl.string("webhook_id").notNullable();
        tbl.string("guild_id ").notNullable();
        tbl.string("channel_id").notNullable();
    });
};
  
exports.down = function(knex, Promise) {
return Promise.all([knex.schema.dropTableIfExists("webhooks")]);
};
  