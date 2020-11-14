AppClasses.Views.Room = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
        this.template = App.templates["room/index"];

		this.updateRender();
        
    }
    
	updateRender() {
		this.$el.html(this.template(this.model.attributes));
		return (this);
    }
    
	render() {
		return (this);
    }
    
}
