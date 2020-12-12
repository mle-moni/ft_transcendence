AppClasses.Views.Home = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"click .firstTimeBtn": "sendFirstTime",
			"click .editSettings": "changeHash"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["home/index"];
		this.listenTo(this.model, "change", this.updateRender);
		this.updateRender();
	}
	changeHash() {
		location.hash = "#profile/edit";
	}
	sendFirstTime() {
		$.ajax({
			url:  '/profile/first_time.json',
			data: { "authenticity_token": $('meta[name="csrf-token"]').attr('content') },
			type: 'POST'
		})
		.done(res => {
			console.log("mhh?")
			this.model.set("first_time", false);
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	updateRender() {
		this.$el.html(this.template({
			user: this.model.toJSON()
		}));
		return (this);
	}
	render() {
		this.delegateEvents();
		return (this);
	}
}
