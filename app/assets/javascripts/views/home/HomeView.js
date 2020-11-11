AppClasses.Views.Home = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/index"];
		this.user = new AppClasses.Views.ConnectionInfos({
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
