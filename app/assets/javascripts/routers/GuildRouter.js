AppClasses.Routers.GuildsRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		// routes
		this.route("guilds", "index");
		this.route("guilds/:guild_id", "showGuild");
		this.route("guilds/:guild_id/war", "war");
		this.route("guilds/mine", "mine");
		this.route("guilds/new", "newGuild");
		this.route("guilds/edit", "edit");
		this.collections.guilds = new AppClasses.Collections.Guild();
	}
	index() {
		App.guildPopstate.redirect = true;
		App.guildPopstate.from = location.hash;
		this.basicView("guilds", "Guilds", {model: this.collections.guilds});
	}
	mine() {
		const guild_id = this.models.user.get("guild_id");
		if (guild_id === null) {
			if (App.guildPopstate.redirect) {	
				App.guildPopstate.redirect = false;
				location.hash = "#guilds/new";
			} else {
				App.guildPopstate.redirect = true;
				location.hash = App.guildPopstate.from;
			}
			return ;
		}
		this.viewWithRenderParam("showGuild", "ShowGuild", guild_id, {
			model: this.collections.guilds,
			guild_id
		});
	}
	showGuild(guild_id) {
		const g_id = parseInt(guild_id);
		this.viewWithRenderParam("showGuild", "ShowGuild", g_id, {
			model: this.collections.guilds,
			guild_id: g_id
		});
	}
	newGuild() {
		this.specialViewWithRenderParam("newGuild", "NewGuild", null, {model: this.collections.guilds});
	}
	edit() {
		const guild_id = this.models.user.get("guild_id");
		if (guild_id === null) {
			location.hash = "#guilds/new";
		}
		this.viewWithRenderParam("editGuild", "EditGuild", guild_id, {
			model: this.collections.guilds,
			guild_id
		});
	}
	war() {
		this.specialViewWithRenderParam("war", "War", null, {model: this.collections.guilds});
	}
}
