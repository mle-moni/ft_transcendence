class RoomMessagesController < ApplicationController
  before_action :set_room_message, only: [:show, :edit, :update, :destroy]

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
    @room = Room.find(filteredParams["room_id"])
    @room_message = RoomMessage.create(filteredParams)
    respond_to do |format|
      if @room_message.save
        
        # TEST
        puts "------------------"
        puts @room.id
        puts "room_channel_#{@room.id}"
        puts @room_message.message
        puts current_user
        puts "------------------"

        #RoomChannel.broadcast_to "room_channel_#{@room.id}", content: @room_message.message, user: current_user
        ActionCable.server.broadcast "room_channel_#{@room.id}", content: @room_message.message, user: current_user

        # TEST
        # ActionCable.server.broadcast "room_channel", content: @room_message.message

        # ACTION CABLE STEP
        # output = {"type": "message", "content": @room_message.as_json}
        # RoomChannel.broadcast_to @room,  output

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
      @room_message = RoomMessage.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def room_message_params
      params.require(:room_message).permit(:user_id, :room_id)
    end
end
