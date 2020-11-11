class CreateMatchmakings < ActiveRecord::Migration[6.0]
  def change
    create_table :matchmakings do |t|

      t.timestamps
    end
  end
end
