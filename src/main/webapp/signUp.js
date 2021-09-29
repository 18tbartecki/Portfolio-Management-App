function checkSignUp(event) {
	    event.preventDefault();
		let username = document.querySelector("#username").value;
		let password = document.querySelector("#password").value;
		let confirm = document.querySelector("#confirmpassword").value;
		let error = document.querySelector("#errorMessage");
		if((!username) || (!password) || (!confirm)) {
			error.style.display = "block";
			error.innerHTML = "Please complete all fields.";
			return false;
		}
		if(password != confirm) {
			error.style.display = "block";
			error.innerHTML = "Passwords do not match.";
			return false;
		} 
		
		$.ajax({
			method: "GET",
			url: "SignUpServlet",
			data: {
				username: username,
				password: password,
				confirmPassword: confirm
			},
			success: function(result) {
				if (result == "That username already exists, try again."){
					error.style.display = "block";
					error.innerHTML = result;
				} 
				else {
					window.location.href = 'https://localhost:8443/login.jsp';
				}
			}
		})
	}
