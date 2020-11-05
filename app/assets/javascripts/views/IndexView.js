AppClasses.Views.Index = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["index"];
		this.user = new AppClasses.Views.ConnectionInfosView({
			model: App.models.user
		});
	}
	render() {
		this.$el.html(this.template({}));
		this.$el.find("#connectionInfos").html(this.user.render().el);
		return (this);
	}
}