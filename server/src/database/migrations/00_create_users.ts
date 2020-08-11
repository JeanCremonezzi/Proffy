import Knex from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name').nullable();
        table.string('avatar').nullable();
        table.string('whatsapp').nullable();
        table.string('bio').nullable();
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('users');
}