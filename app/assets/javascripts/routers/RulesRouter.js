AppClasses.Routers.RulesRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		this.route("rules", "index");
    }
    
	index() {
		this.basicView("rules", "Rules", {});
    }
}
