AppClasses.Views.Rules = class extends Backbone.View {
	constructor(opts) {
		opts.events = {}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["rules/index"];
    }
    
	render() {
        this.$el.html(this.template({
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
    }
    
}