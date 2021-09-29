function logoutUser(event) {
	event.preventDefault();
	sessionStorage.clear();
	console.log("in logout");
	window.location.href = "https://localhost:8443/logout.jsp";
}