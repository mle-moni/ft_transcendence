class CreateMatches < ActiveRecord::Migration[6.0]
  def change
    create_table :matches do |t|
      t.integer :winner_score
      t.integer :loser_score
      t.references :winner, null: false
      t.references :loser, null: false

      t.timestamps
    end
    add_foreign_key :matches, :users, column: :winner_id
    add_foreign_key :matches, :users, column: :loser_id
  end
end
