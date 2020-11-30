class Room < ApplicationRecord
  
  validates   :name, uniqueness: true
  belongs_to  :owner, class_name: "User", required: true

  has_many :room_messages, dependent: :destroy

	has_many :room_link_members, dependent: :destroy
  has_many :members, :through => :room_link_members, :source => :user
  
  has_many :room_link_admins, dependent: :destroy
  has_many :admins, :through => :room_link_admins, :source => :user

  has_many :bans, class_name: "RoomBan", dependent: :destroy
  has_many :mutes, class_name: "RoomMute", dependent: :destroy

  def self.cleanFetch(room, current_user)
    newRoom = {
      id: room.id,
      name: room.name,
      privacy: room.privacy,
      password: room.password,
      owner_id: room.owner.id,
      members: room.members,
      admins: room.admins,
      bans: room.bans,
      mutes: room.mutes,
      created_at: room.created_at,
      updated_at: room.updated_at,
      room_messages: RoomMessage.none
    }
    # If user is admin or is member/admin/owner and is'nt ban, we respond with full message
    if current_user.admin || (room.members && room.members.include?(current_user)) || (room.admins && room.admins.include?(current_user))
      if !room.bans || (room.bans && !room.bans.include?(room.bans.find_by(user: current_user, room: room.id)))
        newRoom[:room_messages] = room.room_messages
      end 
    end
    return newRoom
  end

end