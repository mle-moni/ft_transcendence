AppClasses.Views.NewGuild = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #createGuildForm": "submit"
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["guilds/form"];
		this.updateRender();
	}
	submit(e) {
		e.preventDefault();
		App.utils.formAjax("/api/guilds.json", "#createGuildForm")
		.done(res => {
			App.toast.success("Guild successfully created !", { duration: 2000, style: App.toastStyle });
			App.models.user.set("guild_id", res.id);
			App.models.user.set("guild_owner", true);
			App.models.user.set("guild_validated", true);
			location.hash = `#guilds/${res.id}`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	updateRender() {
		this.$el.html(this.template({
			guild: {},
			method: "POST",
			titleText: "Create your own guild",
			submitText: "Create guild",
			formID: "createGuildForm",
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
	}
	render() {
		this.updateRender();
		return (this);
	}
}
