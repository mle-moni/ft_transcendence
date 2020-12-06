AppClasses.Routers.AdminRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("admin", "index");
	}
	index() {
		if (this.models.user) {
			const isAdmin = this.models.user.attributes.admin;
			if (!isAdmin) {
				App.toast.alert("Unauthorized", { duration: 2000, style: App.toastStyle });
				location.hash = "#";
				return ;
			}
		}
		this.basicView("admin", "Admin", {model: this.models.user});
	}
}
