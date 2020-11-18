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
		this.$el.html(this.template({
			users: this.model.toJSON()
		}));
		return (this);
	}
	render() {
		this.model.myFetch();
		return (this);
	}
}
