AppClasses.Views.Home = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/index"];
		this.updateRender();
	}
	updateRender(changes) {
		this.$el.html(this.template({}));
		return (this);
	}
	render() {
		return (this);
	}
}
