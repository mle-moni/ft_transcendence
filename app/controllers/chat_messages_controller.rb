class ChatMessagesController < ApplicationController

    # GET /chat_messages
    # GET /chat_messages.json
    def index
        @chat_messages = DirectMessage.all
    end

    # GET /chat_messages/1
    # GET /chat_messages/1.json
    def show
    end

    # GET /chat_messages/new
    def new
        @chat_message = DirectMessage.new
    end

    # GET /chat_messages/1/edit
    def edit
    end

    # POST /chat_messages
    # POST /chat_messages.json
    def create
        filteredParams = params.require(:chat_message).permit(:message, :from_id, :dmchat_id)
        puts filteredParams
        #@chat = DirectChat.find(filteredParams["dmchat_id"])
        # Le "by" n'importe pas car c'est forcément un admin ou owner ou superAdmin qui l'a mute, et un tel mute vaut pour tout le monde
        # if RoomMute.where(room: @room, user: current_user).exists?
        # res_with_error("You're currently muted", :bad_request)
        # return false
        # end 
        user = User.find(filteredParams["from_id"])
        dc = DirectChat.find(filteredParams["dmchat_id"])

        @chat_message = DirectMessage.create(message: filteredParams["message"], from: user, dmchat: dc)
        respond_to do |format|
            if @chat_message.save
                # ActionCable.server.broadcast "room_channel", type: "chat_message", description: "create-message", user: current_user
                format.html { redirect_to @chat_message, notice: 'Room message was successfully created.' }
                format.json { head :no_content }
            else
                format.html { render :new }
                format.json { render json: @chat_message.errors, status: :unprocessable_entity }
            end
        end
    end

    # PATCH/PUT /chat_messages/1
    # PATCH/PUT /chat_messages/1.json
    def update
        respond_to do |format|
        if @chat_message.update(chat_message_params)

            format.html { redirect_to @chat_message, notice: 'Room message was successfully updated.' }
            format.json { render :show, status: :ok, location: @chat_message }
        else
            format.html { render :edit }
            format.json { render json: @chat_message.errors, status: :unprocessable_entity }
        end
        end
    end

    # DELETE /chat_messages/1
    # DELETE /chat_messages/1.json
    def destroy
        @chat_message.destroy
        respond_to do |format|
        format.html { redirect_to chat_messages_url, notice: 'Room message was successfully destroyed.' }
        format.json { head :no_content }
        end
    end

    private

        # Only allow a list of trusted parameters through.
        def chat_message_params
        params.require(:chat_message).permit(:user_id, :room_id)
        end

        def res_with_error(msg, error)
            respond_to do |format|
                format.html { redirect_to "/", alert: "#{msg}" }
                format.json { render json: {alert: "#{msg}"}, status: error }
            end
        end
        
    end

