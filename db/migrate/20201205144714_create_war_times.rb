class CreateWarTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :war_times do |t|
      t.datetime :start
      t.references :war, null: false, foreign_key: true

      t.timestamps
    end
    add_column :wars, :war_time_len, :integer, default: 5
    add_column :wars, :war_time_match, :boolean, default: false
  end
end
