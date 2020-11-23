class CreateBlocks < ActiveRecord::Migration[6.0]
  def change
    create_table :blocks do |t|
      t.references :user
      t.references :toward, references: :users, foreign_key: { to_table: :users}
      t.timestamps
    end
  end
end
