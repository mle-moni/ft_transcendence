AppClasses.Routers.DirectMessagesRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
        this.route("messages", "index");
        this.route("messages/:id", "conversation");

		this.collections.DirectMessagesRoom = new AppClasses.Collections.DirectMessagesRoom();
		this.collections.DirectMessages = new AppClasses.Collections.DirectMessages();
    }
    
	index() {
		const user = this.models.user;
		this.viewWithRenderParam("messages", "DirectMessages", user, {
			model: this.collections.DirectMessagesRoom,
			messages: this.collections.DirectMessages,
			user: user
		});
    }

    conversation(room_id) {
		const r_id = parseInt(room_id);
		const user = this.models.user;
		console.log("---------------- CONVERSATION ------------------")
		console.log(r_id);
		this.viewWithRenderParam("conversation", "Conversations", user, {
            model: this.collections.DirectMessagesRoom,
			chatID: r_id,
			messages: this.collections.DirectMessages,
			user: user
		});
    }
    
}