AppClasses.Routers.GameRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("game", "index");
		this.route("game/:room_id", "show");
	}
	index() {
		this.basicView("game", "Game");
	}
	show(room_id) {
		this.viewWithRenderParam("gamePlay", "GamePlay", room_id, { room_id })
		console.log(room_id);
	}
}
