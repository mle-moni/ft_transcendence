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
	updateRender(changes) {
		console.log(changes.changed)
		if (changes && App.utils.onlyThoseAttrsChanged(changes.changed, ["last_seen"])) {
			return (this);
		}
		const user = this.model.findWhere({id: this.user_id});
		const userJSON = user ? user.toJSON() : null;
		const guild = userJSON ? this.guilds.findWhere({id: userJSON.guild_id}) : null;
		const guildJSON = guild ? guild.toJSON() : null;
		this.$el.html(this.template({
			user: userJSON,
			guild: guildJSON,
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
