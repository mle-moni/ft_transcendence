class RoomMessagesController < ApplicationController
	before_action :connect_user
  before_action :set_room_message, only: [:show, :edit, :update, :destroy]
  before_action :reset_temporary_restrictions

  # GET /room_messages
  # GET /room_messages.json
  def index
    @room_messages = RoomMessage.all
    puts @room_message
  end

  # GET /room_messages/1
  # GET /room_messages/1.json
  def show
  end

  # GET /room_messages/new
  def new
    @room_message = RoomMessage.new
  end

  # GET /room_messages/1/edit
  def edit
  end

  # POST /room_messages
  # POST /room_messages.json
  def create
    filteredParams = params.require(:room_message).permit(:message, :user_id, :room_id)
    @room = Room.find(filteredParams["room_id"]) rescue nil
    return res_with_error("Room not found", :not_found) unless @room
    # Le "by" n'importe pas car c'est forcément un admin ou owner ou superAdmin qui l'a mute, et un tel mute vaut pour tout le monde
    if @room && RoomMute.where(room: @room, user: current_user).exists?
      res_with_error("You're currently muted", :bad_request)
      return false
    end

    if !filteredParams["message"] || filteredParams["message"].length == 0 || filteredParams["message"].blank?
      res_with_error("Empty Message", :bad_request)
      return (false)
    elsif filteredParams["message"] && filteredParams["message"].length > 500
      res_with_error("Message too long", :bad_request)
      return (false)
    end

    @room_message = RoomMessage.create(filteredParams)
    respond_to do |format|
      if @room_message.save
        ActionCable.server.broadcast "room_channel", type: "room_message", description: "create-message", user: current_user
        format.html { redirect_to @room_message, notice: 'Room message was successfully created.' }
        format.json { render :show, status: :created, location: @room_message }
      else
        format.html { render :new }
        format.json { render json: @room_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /room_messages/1
  # PATCH/PUT /room_messages/1.json
  def update
    respond_to do |format|
      if @room_message.update(room_message_params)

        format.html { redirect_to @room_message, notice: 'Room message was successfully updated.' }
        format.json { render :show, status: :ok, location: @room_message }
      else
        format.html { render :edit }
        format.json { render json: @room_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /room_messages/1
  # DELETE /room_messages/1.json
  def destroy
    @room_message.destroy
    respond_to do |format|
      format.html { redirect_to room_messages_url, notice: 'Room message was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room_message
      @room_message = RoomMessage.find(params[:id]) rescue nil
      return res_with_error("Room not found", :not_found) unless @room_message
    end

    # Only allow a list of trusted parameters through.
    def room_message_params
      params.require(:room_message).permit(:user_id, :room_id)
    end

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
