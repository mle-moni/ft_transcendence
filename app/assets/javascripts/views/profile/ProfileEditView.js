AppClasses.Views.ProfileEdit = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #edit_user": "submit"
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile/edit"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);

	}
	submit(e) {
		e.preventDefault();
		App.utils.formAjax("/profile/edit.json", "#edit_user")
		.done((jsonObject) => {
			App.toast.success("success", { duration: 2000, style: App.toastStyle });
			this.model.set(jsonObject);
			window.location.hash = "#profile";
		})
		.fail((e) => {
			let errorMsg = "error"
			if (e && e.hasOwnProperty("responseJSON") && e.responseJSON.hasOwnProperty("alert")) {
				errorMsg += `: ${e.responseJSON.alert}`
			}
			App.toast.alert(errorMsg, { duration: 2000, style: App.toastStyle });
		});
		return (false);
	}
	updateRender() {
		this.$el.html(this.template({
			user: this.model.attributes,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
	render() {
		this.delegateEvents();
		return (this);
	}
}
