AppClasses.Routers.FriendsRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("friends", "index");
	}
	index() {
		this.basicView("friends", "Friends", {model: this.models.user});
	}
}
