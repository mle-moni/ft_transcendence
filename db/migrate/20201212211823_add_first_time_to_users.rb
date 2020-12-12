class AddFirstTimeToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :first_time, :boolean, default: true
  end
end
