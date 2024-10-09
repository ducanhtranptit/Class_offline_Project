let toggle_box_google = document.querySelector(".toggle_box_google");
let checkbox_google = document.getElementById("checkbox_google");

toggle_box_google.onclick = function (e) {
	if (checkbox_google.checked) {
		const status = confirm("Bạn có chắc muốn tắt liên kết?");
		if (status) {
			window.location.href = "/connect/google/destroy";
		}
	} else {
		e.preventDefault();
		window.location.href = "/connect/google/redirect";
	}
};
