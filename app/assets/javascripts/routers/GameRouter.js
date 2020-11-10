AppClasses.Routers.GameRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("game", "index");
		this.collections.guilds = new AppClasses.Collections.Guild();
	}
	index() {
		this.basicView("game", "Game");
		this.views.game.initGame();
	}
}
