<%@ page import="csci310.*" %>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<title>Sign In</title>
		<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
		<link rel="stylesheet" href="login.css" type="text/css">
	</head>
	<body>
		<!-- Header -->
		<nav style="background: #787878;"class="navbar navbar-expand navbar-light topbar mb-4 static-top shadow">
			<a class="navbar-brand" href="login.jsp">
				<h5 style="color: white;">USC CS310 Stock Portfolio Management</h5>
			</a>
		</nav>
		
		<div class="container-fluid">
			<div class="row">
				<div class="col-12">
					<h1 class="text-center">Sign In</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-1 col-md-3"> </div>
				<div class="col-10 col-md-6" id="login">
					<form id="login" onsubmit="checkLogin(event)">
						<div class="form-group">
							<label for="username">Username</label>
							<input type="text" class="form-control" id="username" placeholder="Username" name="username">
						</div>
						<div class="form-group">
							<label for="password">Password </label>
							<input type="password" class="form-control" id="password" placeholder="Password" name="password">
						</div>
						<div class="form-group">
							<button type="submit" class="btn btn-danger btn-block">Sign In</button>
						</div>
						<div class="form-group text-danger text-center" id="errorMessage"></div>
					</form>
				</div>
			</div>
			<div class="row">
				<div class="col-12 text-center">
					<a href="signUp.jsp">Sign Up for an Account</a>
				</div>
			</div>
		</div>
		
	    <script src="login.js"></script>
	</body>
</html>
