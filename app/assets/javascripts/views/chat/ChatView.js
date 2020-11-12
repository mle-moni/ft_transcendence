AppClasses.Views.Chat = class extends Backbone.View {
	constructor(opts) {
		super(opts);
		this.tagName = "div";
        this.template = App.templates["chat/chat"];

		this.updateRender();
        this.listenTo(this.model, "change", this.updateRender);
        
        console.log("Chat View Constructor");
        
    }
    
	updateRender() {
		this.$el.html(this.template(this.model.attributes));
		return (this);
    }
    
	render() {
		return (this);
    }
    
}
