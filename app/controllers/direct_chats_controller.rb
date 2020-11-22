class DirectChatsController < ApplicationController
  before_action :set_direct_chat, only: [:show, :edit, :update, :destroy]

  # GET /direct_chats
  # GET /direct_chats.json
  def index
    @direct_chats = DirectChat.all
  end

  # GET /direct_chats/1
  # GET /direct_chats/1.json
  def show
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
    @direct_chat = DirectChat.new(direct_chat_params)

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
