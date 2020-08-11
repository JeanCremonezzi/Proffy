import Knex from 'knex';

export async function up(Knex: Knex) {
    return Knex.schema.createTable('schedule', table => {
        table.increments('id').primary();

        table.integer('week_day').notNullable();
        table.integer('from').nullable();
        table.integer('to').nullable();

        table.integer('class_id').notNullable().references('id').inTable('classes').onDelete('CASCADE').onUpdate('CASCADE');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('schedule');
}