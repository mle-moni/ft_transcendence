// this function is used to upload the data of a form
// exemple: formAjax("/your/url.json", "#my_form")

// You can assign callbacks to the request, see at the bottom of this page

App.utils.formAjax = function(targetUrl, formStrQuery) {

	const req = $.ajax({
		// Your server script to process the upload
		url: targetUrl,
		type: $(formStrQuery).attr("method") || "GET",

		// Form data
		data: new FormData($(formStrQuery)[0]),
	
		// Tell jQuery not to process data or worry about content-type
		// You *must* include these options!
		cache: false,
		contentType: false,
		processData: false,
	});
	return (req);
}

// You can assign callbacks to the request:

// let req = formAjax("/your/url.json", "#my_form", "POST");
// req.done(function(jsonObject) {
// 	console.log( "success" );
// })
// .fail(function(e) {
// 	console.log( "error" );
// })
// .always(function() {
// 	console.log( "complete" );
// });

App.utils.changeImg = (input, imgID) => {
	if (input.files && input.files[0]) {
		const reader = new FileReader();

		reader.onload = function (e) {
			const img = document.getElementById(imgID);
			if (!img) {
				console.error("no such element: #" + "projectImg");
			}
			img.src = e.target.result;
			img.style.display = "block";
		};
		reader.readAsDataURL(input.files[0]);
	}
}

App.utils.toastError = (e) => {
	let errorMsg = "Error"
	if (e && e.hasOwnProperty("responseJSON") && e.responseJSON.hasOwnProperty("alert")) {
		errorMsg += ` : ${e.responseJSON.alert}`
	}
	App.toast.alert(errorMsg, { duration: 2000, style: App.toastStyle });
}


App.utils.getHoursMinutes = () => {
	var date = new Date();
	return date.toLocaleTimeString(navigator.language, {
		hour: '2-digit',
		minute:'2-digit'
	});
}
