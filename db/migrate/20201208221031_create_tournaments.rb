class CreateTournaments < ActiveRecord::Migration[6.0]
  def change
    create_table :tournaments do |t|
      t.datetime :start
      t.string :winner, default: ""

      t.timestamps
    end
    add_column :users, :eliminated, :boolean, default: false
    add_reference :users, :tournament, foreign_key: true
  end
end
