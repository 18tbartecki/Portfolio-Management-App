package csci310.servlets;


import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import csci310.SQLConnect;


@WebServlet("/SignUpServlet")
public class SignUpServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		SQLConnect.initConnection();
		String message = "";
		String next = "";

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String confirmPassword = request.getParameter("confirmPassword");

		System.out.println("username: " + username + " password: " + password + " confirm: " + confirmPassword);

		message = SQLConnect.addUser(username, password);
		System.out.println(message);
		PrintWriter out = response.getWriter();

		if(message.equals("That username already exists, try again.")) {
			next = "signUp.jsp";
		}
		else {
			next = "login.jsp";
		}
		out.write(message);

	}
}