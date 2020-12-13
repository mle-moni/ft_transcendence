class DirectChatsController < ApplicationController
  before_action :set_direct_chat, only: [:show, :edit, :update, :destroy]
  before_action :reset_temporary_restrictions


  # GET /direct_chats
  # GET /direct_chats.json
  def index
    @direct_chats = DirectChat.where(user1_id: current_user.id).or(DirectChat.where(user2_id: current_user.id))
  end

  # GET /direct_chats/1
  # GET /direct_chats/1.json
  def show
    puts params
  end

  # GET /direct_chats/new
  def new
    @direct_chat = DirectChat.new
  end

  # GET /direct_chats/1/edit
  def edit
  end

  # POST /direct_chats/createDuelRequest
  # POST /direct_chats/createDuelRequest.json
  def createDuelRequest
    filteredParams = params.require(:duel_request).permit(:from_id, :direct_chat_id, :is_ranked)

    user = User.find(filteredParams["from_id"]) rescue nil
    dc = DirectChat.find(filteredParams["direct_chat_id"]) rescue nil

    if !user || !dc
      res_with_error("Unknown DirectChat or User", :bad_request)
      return (false)
    end

    @duel_request = DirectMessage.create(message: "", from: user, direct_chat: dc, is_duel_request: true, is_ranked: filteredParams["is_ranked"])

    respond_to do |format|
      if @duel_request.save
          ActionCable.server.broadcast "chat_channel", type: "duel_request", description: "create-request", user: current_user
          format.html { redirect_to @chat_message, notice: 'Duel request was successfully created.' }
          format.json { head :no_content }
      else
          format.html { render :new }
          format.json { render json: @chat_message.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /direct_chats/acceptDuelRequest
  # POST /direct_chats/acceptDuelRequest.json
  def acceptDuelRequest
    filteredParams = params.require(:duel_request).permit(:chat_id, :duel_id, :first_user_id, :second_user_id, :is_ranked)

    duel = DirectChat.find(filteredParams["chat_id"]).direct_messages.find(filteredParams["duel_id"]) rescue nil
    if !duel || duel.is_duel_request == false
      return res_with_error("Unknown duel request", :bad_request)
    end 
    user1 = User.find(filteredParams["first_user_id"]) rescue nil
    user2 = User.find(filteredParams["second_user_id"]) rescue nil
    if !user1 || !user2
      return res_with_error("Unknown User(s)", :bad_request)
    end
    if duel.is_ranked && filteredParams["is_ranked"] == "false" || !duel.is_ranked && filteredParams["is_ranked"] == "true"
      return res_with_error("Wrong game type", :bad_request)
    end
    Game.start(user1.email, user2.email, if filteredParams["is_ranked"] == "true" then "duel_ranked" else "duel_unranked" end)
  end


  # POST /direct_chats
  # POST /direct_chats.json
  def create
    filteredParams = params.require(:dmRoom).permit(:first_user_id, :second_user_id)
    first_user = User.find(filteredParams["first_user_id"]) rescue nil
    second_user = User.find(filteredParams["second_user_id"]) rescue nil
    if !first_user || !second_user
      res_with_error("Unknown User", :bad_request)
      return (false)
    end 
    @direct_chat = DirectChat.new(user1_id: filteredParams["first_user_id"], user2_id: filteredParams["second_user_id"])
    respond_to do |format|
      if @direct_chat.save
        ActionCable.server.broadcast "chat_channel", type: "room", description: "create-room", user: current_user
        format.html { redirect_to @direct_chat, notice: 'Direct chat was successfully created.' }
        format.json { render :show, status: :created, location: @direct_chat }
      else
        format.html { render :new }
        format.json { render json: @direct_chat.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /direct_chats/1
  # PATCH/PUT /direct_chats/1.json
  def update
    respond_to do |format|
      if @direct_chat.update(direct_chat_params)
        format.html { redirect_to @direct_chat, notice: 'Direct chat was successfully updated.' }
        format.json { render :show, status: :ok, location: @direct_chat }
      else
        format.html { render :edit }
        format.json { render json: @direct_chat.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /direct_chats/1
  # DELETE /direct_chats/1.json
  def destroy
    @direct_chat.destroy
    respond_to do |format|
      format.html { redirect_to direct_chats_url, notice: 'Direct chat was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_direct_chat
      @direct_chat = DirectChat.find(params[:id]) rescue nil
      return res_with_error("Chat not found", :not_found) unless @direct_chat
    end

    # Only allow a list of trusted parameters through.
    def direct_chat_params
      params.fetch(:direct_chat, {})
    end

    def reset_temporary_restrictions
      if RoomMute.where('"endTime" < ?', DateTime.now).exists?
        RoomMute.where('"endTime" < ?', DateTime.now).destroy_all
        ActionCable.server.broadcast "chat_channel", type: "rooms", description: "A user has reach the end of its muted period"
      end
      if RoomBan.where('"endTime" < ?', DateTime.now).exists?
        RoomBan.where('"endTime" < ?', DateTime.now).destroy_all
        ActionCable.server.broadcast "chat_channel", type: "rooms", description: "A user has reach the end of its ban period"
      end 
    end
  
end
