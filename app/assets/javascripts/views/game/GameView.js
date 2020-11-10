AppClasses.Views.Game = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
		this.template = App.templates["game/game"];
		this.canvasID = "gameCanvas";
		this.canvas = null;
		this.ctx = null;
	}
	updateRender() {
		this.$el.html(this.template({
			canvasID: this.canvasID
		}));
		return (this);
	}
	initGame() {
		this.canvas = $(`#${this.canvasID}`)[0];
		this.ctx = this.canvas.getContext("2d");

		this.ctx.fillRect(100, 100, 100, 100)
	}
	render() {
		this.updateRender(); // generates HTML
		// the game has to be started in the router
		return (this);
	}
}
