AppClasses.Views.Index = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["index"];
		this.user = new AppClasses.Views.ConnectionInfosView({
			model: App.models.user
		});
		this.updateRender();
	}
	updateRender() {
		// change it if it has to re render, for now it's static
		this.$el.html(this.template({}));
		this.$el.find("#connectionInfos").html(this.user.render().el);
		return (this);
	}
	render() {
		return (this);
	}
}
