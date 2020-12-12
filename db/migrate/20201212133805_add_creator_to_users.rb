class AddCreatorToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :creator, :boolean, default: false
  end
end
