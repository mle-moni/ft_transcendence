AppClasses.Routers.DirectMessagesRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
        this.route("messages", "index");
        this.route("messages/:id", "conversation");
		this.collections.DirectMessagesRoom = new AppClasses.Collections.DirectMessagesRoom();
    }
    
	index() {
		const user = this.models.user;
		this.viewWithRenderParam("messages", "DirectMessages", user, {
			model: this.collections.DirectMessagesRoom,
			user: user
		});
    }

    conversation(chatID) {
		const user = this.models.user;
		const cID = parseInt(chatID);
		this.viewWithRenderParam("conversation", "Conversations", cID, {
            model: this.collections.DirectMessagesRoom,
			user: user,
			chatID: cID
		});
    }
    
}