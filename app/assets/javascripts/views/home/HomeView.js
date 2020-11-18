AppClasses.Views.Home = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/index"];
		this.user = new AppClasses.Views.ConnectionInfos({
			model: this.model
		});
		this.listenTo(this.model, "change", this.updateRender);
		this.updateRender();
	}
	updateRender() {
		this.$el.html(this.template({
			user: this.model.toJSON()
		}));
		this.$el.find("#connectionInfos").html(this.user.render().el);
		return (this);
	}
	render() {
		this.model.update(this.model);
		return (this);
	}
}
