class AddDualRequestMessagetoRoom < ActiveRecord::Migration[6.0]
  def change
    add_column :room_messages, :is_dual_request, :boolean, default: false
    add_column :room_messages, :is_ranked, :boolean, default: false
  end
end
