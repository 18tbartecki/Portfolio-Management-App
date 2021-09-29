<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Log Out</title>
</head>
<body>
	<%
		
		session.invalidate();	
		String redirectURL = "https://localhost:8443/login.jsp";
	    response.sendRedirect(redirectURL);
			
	%>
</body>
</html>