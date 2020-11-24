AppClasses.Routers.DirectMessagesRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
        this.route("messages", "index");
        this.route("messages/:id", "conversation");

		this.collections.directMessages = new AppClasses.Collections.DirectMessages();

    }
    
	index() {
		const user = this.models.user;
		this.viewWithRenderParam("messages", "DirectMessages", user, {
			model: this.collections.directMessages,
			user
		});
    }

    conversation(room_id) {
		const r_id = parseInt(room_id);
		const user = this.models.user;
		this.viewWithRenderParam("messages", "Conversations", user, {
            model: this.collections.directMessages,
            chatID: r_id,
			user: user
		});
    }
    
}