AppClasses.Views.ShowUser = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.user_id = opts.user_id;
		this.tagName = "div";
		this.guilds = App.collections.guilds;
		this.template = App.templates["profile/showProfile"];
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.listenTo(this.guilds, "change reset add remove", this.updateRender);
		this.model.myFetch();
		this.guilds.fetch();
		this.updateRender();
	}
	updateRender() {
		const user = this.model.findWhere({id: this.user_id});
		const userJSON = user ? user.toJSON() : null;
		let guild = null;
		let guildJSON = null;
		let matches = [];
		if (userJSON) {
			if (userJSON.guild_validated) {
				guild = this.guilds.findWhere({id: userJSON.guild_id});
			}
			if (guild) {
				guildJSON = guild.toJSON();
			}
			matches = userJSON.matches.map(match => {
				match.date = new Date(match.created_at);
				match.rawDate = match.date.valueOf();
				match.dateStr = match.date.toLocaleTimeString();
				match.won = match.winner_id == userJSON.id;
				match.enemy = this.model.findWhere({id: match.won ? match.loser_id : match.winner_id});
				if (match.enemy) {
					match.enemy = match.enemy.toJSON();
				}
				match.you = userJSON.nickname;
				return (match);
			});
			matches = matches.sort((a, b) => {
				return (b.rawDate - a.rawDate);
			});
		}
		this.$el.html(this.template({
			user: userJSON,
			guild: guildJSON,
			matches,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
	render(user_id) {
		if (this.user_id != user_id) {
			this.user_id = user_id;
			this.updateRender();
		}
		this.guilds.fetch();
		this.model.myFetch();
		return (this);
	}
}
