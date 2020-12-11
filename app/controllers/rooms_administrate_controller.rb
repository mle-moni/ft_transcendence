class RoomsAdministrateController < ApplicationController
  before_action :connect_user
  before_action :reset_temporary_restrictions

  def mute

    filteredParams = params.require(:room).permit(:room_id, :targetMemberID, :endTime)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    userTargeted = User.find(filteredParams["targetMemberID"]) rescue nil
    endDateTimeFormat = DateTime.parse(filteredParams["endTime"])
   
    if @room == nil || userTargeted == nil
      res_with_error("Room or Targeted User invalid", :bad_request)
      return false
    end
    endDateTimeFormat = endDateTimeFormat - 1.hours
    if endDateTimeFormat.past?
      res_with_error("You can't mute in the past", :bad_request)
      return false
    end
   
    rm = RoomMute.new(user: userTargeted, room: @room, by: current_user, endTime: endDateTimeFormat)
    @room.mutes << rm
    respond_to do |format|
      if @room.save && rm.save
        ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has been muted", user: current_user
        format.json { head :no_content }
      else
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end 

  def unmute
    filteredParams = params.require(:room).permit(:room_id, :targetMemberID)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    userTargeted = User.find(filteredParams["targetMemberID"]) rescue nil
    if @room == nil || userTargeted == nil
      res_with_error("Room or Targeted User invalid", :bad_request)
      return false
    end
    # It doesn't matter who has muted him, so no need to specify "by" user in that query
    RoomMute.where(user: userTargeted, room: @room).destroy_all
    ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has been un-muted", user: current_user
    respond_to do |format|
      format.json { head :no_content }
    end
  end


  def ban

    filteredParams = params.require(:room).permit(:room_id, :targetMemberID, :endTime)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    userTargeted = User.find(filteredParams["targetMemberID"]) rescue nil
    endDateTimeFormat = DateTime.parse(filteredParams["endTime"])
    if @room == nil || userTargeted == nil
      res_with_error("Room or Targeted User invalid", :bad_request)
      return false
    end
    endDateTimeFormat = endDateTimeFormat - 1.hours
    if endDateTimeFormat.past?
      res_with_error("You can't ban in the past", :bad_request)
      return false
    end
    rm = RoomBan.new(user: userTargeted, room: @room, by: current_user, endTime: endDateTimeFormat)
    @room.bans << rm
    respond_to do |format|
      if @room.save && rm.save
        ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has been banned", user: current_user
        format.json { head :no_content }
      else
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end

  end

  def unban
    filteredParams = params.require(:room).permit(:room_id, :targetMemberID)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    userTargeted = User.find(filteredParams["targetMemberID"]) rescue nil
    if @room == nil || userTargeted == nil
      res_with_error("Room or Targeted User invalid", :bad_request)
      return false
    end
    # It doesn't matter who has muted him, so no need to specify "by" user in that query
    RoomBan.where(user: userTargeted, room: @room).destroy_all
    ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has been un-banned", user: current_user
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  def kick
    filteredParams = params.require(:room).permit(:room_id, :targetMemberID)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    userTargeted = User.find(filteredParams["targetMemberID"]) rescue nil
    if @room == nil || userTargeted == nil
      res_with_error("Room or Targeted User invalid", :bad_request)
      return false
    end
    RoomLinkMember.where(user: userTargeted, room: @room).destroy_all
    RoomLinkAdmin.where(user: userTargeted, room: @room).destroy_all
    RoomMute.where(room: @room, user: userTargeted).destroy_all
    RoomBan.where(room: @room, user: userTargeted).destroy_all
    RoomMessage.where(room: @room, user: userTargeted).destroy_all
    respond_to do |format|
      ActionCable.server.broadcast "room_channel", type: "rooms", description: "Kick", user: current_user
      format.html { redirect_to rooms_url, notice: 'User kicked'}
      format.json { head :no_content }
    end
  end 

  private

    def res_with_info(msg)
      respond_to do |format|
        format.html { redirect_to "/", notice: "#{msg}" }
        format.json { render json: {msg: "#{msg}"}} #status: :ok
      end
    end

    def reset_temporary_restrictions
      if RoomMute.where('"endTime" < ?', DateTime.now).exists?
          RoomMute.where('"endTime" < ?', DateTime.now).destroy_all
          ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has reached the end of its muted period"
      end
      if RoomBan.where('"endTime" < ?', DateTime.now).exists?
          RoomBan.where('"endTime" < ?', DateTime.now).destroy_all
          ActionCable.server.broadcast "room_channel", type: "rooms", description: "A user has reached the end of its ban period"
      end 
  end

end
