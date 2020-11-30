AppClasses.Views.NewGuildWar = class extends Backbone.View {
	constructor(opts) {
		opts.events = {}
		super(opts);
		this.guild_id = App.models.user.get("guild_id");
		this.tagName = "div";
		this.template = App.templates["guilds/newGuildWar"];
		this.guild = null;
		this.model.fetch().then(() => {
			this.guild = this.model.findWhere({id: this.guild_id});
			this.listenTo(this.guild, "change", this.updateRender);
			this.updateRender();
		});
	}
	updateRender() {
		const guildJSON = this.guild ? this.guild.toJSON() : null;
		const user = App.models.user;
		this.$el.html(this.template({
			guild: guildJSON,
			owner: user.isOwner(this.guild),
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
	render() {
		this.updateRender();
		this.model.fetch();
		this.delegateEvents();
		return (this);
	}
}
