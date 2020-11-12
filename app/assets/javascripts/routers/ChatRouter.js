AppClasses.Routers.ChatRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		this.route("chat", "index");
    }
    
	index() {
		this.basicView("chat", "Chat", {model: this.models.user});
    }
    
}
