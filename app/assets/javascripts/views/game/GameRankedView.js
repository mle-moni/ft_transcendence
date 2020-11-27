AppClasses.Views.GameRanked = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["game/game_ranked"];
	}
	updateRender() {
		this.$el.html(this.template({ }));
		return (this);
	}
	render() {
		this.updateRender(); // generates HTML
		return (this);
	}
}
