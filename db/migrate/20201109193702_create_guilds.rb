class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds do |t|
      t.string :name
      t.string :anagram
      t.integer :points, default: 0

      t.timestamps
    end
  end
end
