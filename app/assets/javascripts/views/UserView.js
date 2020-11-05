AppClasses.Views.ConnectionInfosView = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["connectionInfos"];
		this.listenTo(this.model, "change", this.render);
	}
	render() {
		this.$el.html(this.template(this.model.attributes));
		return (this);
	}
}