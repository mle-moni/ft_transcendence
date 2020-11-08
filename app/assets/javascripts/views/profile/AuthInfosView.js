AppClasses.Views.AuthInfos = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #edit_pwd": "submit",
			"submit #enable2fa": "enable",
			"submit #disable2fa": "disable"
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["profile/auth"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);

	}
	enable(e) {
		e.preventDefault();
		App.utils.formAjax("/profile/enable_otp.json", "#enable2fa")
		.done((jsonObject) => {
			App.data.links.authenticator = jsonObject.msg;
			App.toast.success("2fa enabled !", { duration: 2000, style: App.toastStyle });
			this.model.set("two_factor", true);
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
	disable(e) {
		e.preventDefault();
		App.utils.formAjax("/profile/disable_otp.json", "#disable2fa")
		.done((jsonObject) => {
			App.toast.success("2fa disabled !", { duration: 2000, style: App.toastStyle });
			this.model.set("two_factor", false);
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
	submit(e) {
		e.preventDefault();
		if ($("#password1")[0].value.length < 6) {
			App.toast.alert("Password too short", { duration: 2000, style: App.toastStyle })
			return (false);
		}
		if ($("#password1")[0].value != $("#password2")[0].value) {
			App.toast.alert("Passwords do not match !", { duration: 2000, style: App.toastStyle })
			return (false);
		}
		App.utils.formAjax("/profile/password.json", "#edit_pwd")
		.done((jsonObject) => {
			App.toast.success("Password updated !", { duration: 2000, style: App.toastStyle });
			this.model.set(jsonObject);
			window.location.hash = "#profile/edit";
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
			token: $('meta[name="csrf-token"]').attr('content'),
			links: App.data.links
		}));
		this.delegateEvents();
		return (this);
	}
	render() {
		return (this);
	}
}
