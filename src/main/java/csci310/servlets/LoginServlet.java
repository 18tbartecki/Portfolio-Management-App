package csci310.servlets;


import static java.time.temporal.ChronoUnit.MINUTES;
import static java.time.temporal.ChronoUnit.SECONDS;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalTime;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import csci310.SQLConnect;


@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		SQLConnect.initConnection();
		String next = "SamplePortfolioPage.jsp";
		
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		HttpSession session = request.getSession();
		
		if(session.getAttribute(username) == null) {
			session.setAttribute(username, 0);
		}
		
		// Account should be locked unless some time has passed
		if((int)session.getAttribute(username) == 3) {
			LocalTime first = (LocalTime) session.getAttribute(username+"first");
			LocalTime now = LocalTime.now();
			// User returned before end of lockout period
			if(first.until(now, MINUTES) < 1) {
				//System.out.println("still locked out");
				next = "still locked";
			}
			// User was locked out but is back
			else {
				session.setAttribute(username, 0);
				next = SQLConnect.login(username, password);
			}
		}
		// User has not been locked out yet
		else {
			next = SQLConnect.login(username, password);
		}
		

		
		if(next.equals("SamplePortfolioPage.jsp")) {
			session.setAttribute("loggedIn", "true");
		} 
		else if((int)session.getAttribute(username) < 3) {
			int attempts = (int) session.getAttribute(username) + 1;
			session.setAttribute(username, attempts);
			//System.out.println(username + " has " + attempts + " attempts");
			if(attempts == 1) {
				LocalTime now = LocalTime.now();
				String firstTime = username + "first";
				session.setAttribute(firstTime, now);
			}
			else if(attempts == 2) {
				LocalTime now = LocalTime.now();
				String secondTime = username + "second";
				session.setAttribute(secondTime, now);
			}
			else {
				LocalTime now = LocalTime.now();
				LocalTime first = (LocalTime) session.getAttribute(username+"first");
				LocalTime second = (LocalTime) session.getAttribute(username+"second");
				//System.out.println("there are: " + first.until(now, SECONDS) + " seconds inbetween 1 and 3");
				//System.out.println("there are: " + second.until(now, SECONDS) + " seconds inbetween 2 and 3");
				
				// Lock user out of account
				if(first.until(now, SECONDS) < 60) {
					//System.out.println("locking out");
					next = "lockout";
				}
				else {
					session.setAttribute(username+"first", second);
					session.setAttribute(username+"second", now);
					attempts--;
					session.setAttribute(username, attempts);
				}
				
			}
		}
		
		PrintWriter out = response.getWriter();
		
		out.write(next);
	}
}


