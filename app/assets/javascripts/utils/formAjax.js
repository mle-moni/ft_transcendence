// this function is used to upload the data of a form
// exemple: formAjax("/your/url.json", "#my_form", "POST")

// You can assign callbacks to the request, see at the bottom of this page

App.utils.formAjax = function(targetUrl, formStrQuery, reqType, progressStrQuery = null) {
	const req = $.ajax({
		// Your server script to process the upload
		url: targetUrl,
		type: reqType,
	
		// Form data
		data: new FormData($(formStrQuery)[0]),
	
		// Tell jQuery not to process data or worry about content-type
		// You *must* include these options!
		cache: false,
		contentType: false,
		processData: false,
	
		// Custom XMLHttpRequest
		xhr: function () {
			var myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload && progressStrQuery) {
				// For handling the progress of the upload
				myXhr.upload.addEventListener('progress', function (e) {
					if (e.lengthComputable) {
						$(progressStrQuery).attr({
							value: e.loaded,
							max: e.total,
						});
					}
				}, false);
			}
			return myXhr;
		}
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
