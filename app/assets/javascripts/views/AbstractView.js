AppClasses.Views.AbstractView = class extends Backbone.View {
	constructor(opts) {
		super(opts);
	}

	destroy() {
		this.undelegateEvents();
		this.$el.removeData().unbind();
		this.remove();
		return (this);
	}

}
