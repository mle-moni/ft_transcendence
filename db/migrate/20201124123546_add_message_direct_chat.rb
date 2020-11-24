class AddMessageDirectChat < ActiveRecord::Migration[6.0]
  def change
    change_table :direct_messages do |t|
      t.text :message
    end
  end
end
