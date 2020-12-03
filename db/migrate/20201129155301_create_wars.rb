class CreateWars < ActiveRecord::Migration[6.0]
  def change
    create_table :wars do |t|
      t.datetime :start
      t.datetime :end
      t.integer :prize, default: 0
      t.boolean :mods, default: false
      t.integer :time_to_answer, default: 5 # minutes
      t.boolean :ladder, default: false
      t.boolean :tournament, default: false
      t.boolean :duel, default: false
      t.bigint :winner, default: 0
      t.bigint :validated, default: 0
      t.references :guild1, null: false
      t.references :guild2, null: false

      t.timestamps
    end
    add_foreign_key :wars, :guilds, column: :guild1_id
    add_foreign_key :wars, :guilds, column: :guild2_id
  end
end
