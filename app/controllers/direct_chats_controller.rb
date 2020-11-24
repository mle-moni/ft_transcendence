class DirectChatsController < ApplicationController
  before_action :set_direct_chat, only: [:show, :edit, :update, :destroy]

  # GET /direct_chats
  # GET /direct_chats.json
  def index
    puts "GET CALLED"
    @direct_chats = DirectChat.all
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

  # POST /direct_chats
  # POST /direct_chats.json
  def create
    puts "FONCTION CREATE"
    puts params
    filteredParams = params.require(:dmRoom).permit(:first_user_id, :second_user_id)
    puts"----- user id 1 -------"
    puts filteredParams["first_user_id"]
    puts"----- user id 2 -------"
    puts filteredParams["second_user_id"]


    first_user = User.find(filteredParams["first_user_id"])
    second_user = User.find(filteredParams["second_user_id"])
    puts"-----"
    puts first_user.inspect
    puts"-----"
    puts second_user.inspect
    puts"-----"
    puts "AVANT NEW"
    @direct_chat = DirectChat.new(user1_id: filteredParams["first_user_id"], user2_id: filteredParams["second_user_id"])

    respond_to do |format|
      if @direct_chat.save
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
      @direct_chat = DirectChat.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def direct_chat_params
      params.fetch(:direct_chat, {})
    end
end

def res_with_error(msg, error)
  respond_to do |format|
    format.html { redirect_to "/", alert: "#{msg}" }
    format.json { render json: {alert: "#{msg}"}, status: error }
  end
end