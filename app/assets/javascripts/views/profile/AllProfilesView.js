AppClasses.Views.AllProfiles = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile/profilesList"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.myFetch();
	}
	updateRender() {
		const users = this.model.toJSON().sort((a, b) => {
			return (b.elo - a.elo);
		});
		for (let i = 0; i < users.length; i++) {
			users[i].rank = i + 1;
		}
		this.$el.html(this.template({
			users
		}));
		return (this);
	}
	render() {
		this.model.myFetch();
		return (this);
	}
}
