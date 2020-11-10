AppClasses.Views.ShowGuild = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.guild_id = opts.guild_id;
		this.tagName = "div";
		this.template = App.templates["guilds/show"];
		this.listenTo(this.model, "change", this.updateRender);
		this.model.fetch().done(() => {
			this.updateRender();
		});
		this.guild = null;
	}
	updateRender() {
		this.guild = this.model.findWhere({id: this.guild_id});
		const guildJSON = this.guild ? this.guild.toJSON() : null;
		this.$el.html(this.template({
			guild: guildJSON,
			edit: this.guild_id == App.models.user.get("guild_id")
		}));
		return (this);
	}
	render(guild_id) {
		if (this.guild_id != guild_id) {
			this.guild_id = guild_id;
			this.updateRender();
		}
		this.model.fetch();
		return (this);
	}
}
