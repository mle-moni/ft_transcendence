AppClasses.Routers.TournamentRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("tournaments", "index");
		this.route("tournaments/:tournament_id", "show");
		this.route("tournaments/create", "create");

		this.collections.tournaments = new AppClasses.Collections.Tournament();

	}
	index() {
		this.basicView("tournamentList", "TournamentList", {
			model: this.models.user,
			allUsers: this.collections.allUsers,
			tournaments: this.collections.tournaments
		});
	}
	create() {
		this.basicView("tournamentCreate", "TournamentCreate", {model: this.models.user});
	}
	show(tournament_id) {
		// TODO create show view and render it
		this.mainDiv.html("<h3>Soon here: show tournament view</h3>");
	}
}