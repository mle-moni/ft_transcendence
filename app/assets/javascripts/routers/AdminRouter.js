AppClasses.Routers.AdminRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("admin", "index");
	}
	index() {
		this.basicView("admin", "Admin", {model: this.models.user});
	}
}
