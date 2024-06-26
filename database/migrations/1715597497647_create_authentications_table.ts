import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'authentications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('token').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // index
      table.index(['user_id'], 'authentications_user_id_index')
      table.index(['token'], 'authentications_token_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
