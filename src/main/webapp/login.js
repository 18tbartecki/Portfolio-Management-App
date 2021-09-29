function checkLogin(event) {
	    event.preventDefault();
		let username = document.querySelector("#username").value;
		let password = document.querySelector("#password").value;
		let error = document.querySelector("#errorMessage");
		
		$.ajax({
			method: "GET",
			url: "LoginServlet",
			data: {
				username: username,
				password: password
			},
			success: function(result) {
				console.log(result);
				if (result == "login.jsp"){
					error.style.display = "block";
					error.innerHTML = "Incorrect Username and Password. Try again.";
				} 
				else if (result == "SamplePortfolioPage.jsp"){
					console.log("logged in");
					window.location.href = 'https://localhost:8443/SamplePortfolioPage.jsp';
				} 
				else if (result == "lockout") {
					error.style.display = "block";
					error.innerHTML = "You have entered the incorrect credentials 3 times in under 1 minute. Your account is temporarily locked.";
				} 
				else {
					error.style.display = "block";
					error.innerHTML = "The lockout period is not yet over.";
				}
			}
		})
	}