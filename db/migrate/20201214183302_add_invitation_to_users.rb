class AddInvitationToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :g_invitation, :bigint, default: 0
  end
end
