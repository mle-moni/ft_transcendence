AppClasses.Views.ConnectionInfos = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/connectionInfos"];
		this.listenTo(this.model, "change", this.updateRender);
		this.updateRender();
	}
	updateRender() {
		this.$el.html(this.template({
			user: this.model.attributes,
			logoutLink: App.data.links.signout
		}));
		return (this);
	}
	render() {
		return (this);
	}
}
