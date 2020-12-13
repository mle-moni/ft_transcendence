AppClasses.Routers.GameRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("game", "index");
		this.route("game/:room_id", "show");
		this.route("game_ranked", "index_r");
		this.route("game_ranked/:room_id", "show_r");
	}
	index() {
		this.basicView("game", "Game");
	}
	show(room_id) {
		this.viewWithRenderParam("gamePlay", "GamePlay", room_id, { room_id })
	}

	index_r() {
		this.basicView("gameRanked", "GameRanked");
	}
	show_r(room_id) {
		this.viewWithRenderParam("gamePlayRanked", "GamePlayRanked", room_id, { room_id })
		console.log(room_id);
	}
}
