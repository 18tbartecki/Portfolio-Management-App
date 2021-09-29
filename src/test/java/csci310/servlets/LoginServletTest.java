package csci310.servlets;

import static java.time.temporal.ChronoUnit.MINUTES;
import static org.junit.Assert.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalTime;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.Test;
import org.mockito.Mockito;


import csci310.SQLConnect;


public class LoginServletTest extends Mockito {

	@Test 
	public void testDoGet() throws IOException, ServletException {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		HttpSession session = mock(HttpSession.class);
		
		SQLConnect.initConnection();
		when(request.getParameter("username")).thenReturn("testUser");
		when(request.getParameter("password")).thenReturn("testPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("testUser")).thenReturn(null);
		when(request.getSession().getAttribute("testUser")).thenReturn(0);
		
		
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		when(response.getWriter()).thenReturn(pw);
		
		LoginServlet login = new LoginServlet();
		login.doGet(request, response);
		
		pw.flush();
		assertTrue(sw.toString().contains("SamplePortfolioPage.jsp"));
		
		// Test failed login
		when(request.getParameter("username")).thenReturn("wrongUser");
		when(request.getParameter("password")).thenReturn("wrongPassword");
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("testUser")).thenReturn(null);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(0);
		when(request.getSession().getAttribute("testUser")).thenReturn(3);
		
		StringWriter sw2 = new StringWriter();
		PrintWriter pw2 = new PrintWriter(sw2);
		when(response.getWriter()).thenReturn(pw2);
		
		LoginServlet login2 = new LoginServlet();
		login2.doGet(request, response);
		
		pw2.flush();
		assertTrue(sw2.toString().contains("login.jsp"));
		
		// Correct credentials but account locked
		when(request.getParameter("username")).thenReturn("testUser");
		when(request.getParameter("password")).thenReturn("testPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("testUser")).thenReturn(null);
		when(request.getSession().getAttribute("testUser")).thenReturn(3);
		when(request.getSession().getAttribute("testUserfirst")).thenReturn(LocalTime.now());
		//when(request.getSession().getAttribute("testUser")).thenReturn(3);
		
		
		StringWriter sw3 = new StringWriter();
		PrintWriter pw3 = new PrintWriter(sw3);
		when(response.getWriter()).thenReturn(pw3);
		
		LoginServlet login3 = new LoginServlet();
		login3.doGet(request, response);
		
		pw3.flush();
		assertTrue(sw3.toString().contains("still locked"));
		
		
		// Correct after previous lockout
		when(request.getParameter("username")).thenReturn("testUser");
		when(request.getParameter("password")).thenReturn("testPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("testUser")).thenReturn(null);
		when(request.getSession().getAttribute("testUser")).thenReturn(3);
		when(request.getSession().getAttribute("testUserfirst")).thenReturn(LocalTime.parse("01:01:01.123"));
		System.out.println("time diff is: " + LocalTime.parse("01:01:01.123").until(LocalTime.now(), MINUTES));
		when(request.getSession().getAttribute("testUser")).thenReturn(0);
		
		StringWriter sw4 = new StringWriter();
		PrintWriter pw4 = new PrintWriter(sw4);
		when(response.getWriter()).thenReturn(pw4);
		
		LoginServlet login4 = new LoginServlet();
		login4.doGet(request, response);
		
		pw4.flush();
		assertTrue(sw4.toString().contains("SamplePortfolioPage.jsp"));
		
		
		// Locked out user
		when(request.getParameter("username")).thenReturn("wrongUser");
		when(request.getParameter("password")).thenReturn("wrongPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(2);
		
		when(request.getSession().getAttribute("wrongUserfirst")).thenReturn(LocalTime.parse("23:59:30.123"));
		when(request.getSession().getAttribute("wrongUsersecond")).thenReturn(LocalTime.parse("23:59:31.123"));
		
		StringWriter sw5 = new StringWriter();
		PrintWriter pw5 = new PrintWriter(sw5);
		when(response.getWriter()).thenReturn(pw5);
		
		LoginServlet login5 = new LoginServlet();
		login5.doGet(request, response);
		
		pw5.flush();
		assertTrue(sw5.toString().contains("lockout"));
		
		
//		// Not quite locked since not within time frame
//		when(request.getParameter("username")).thenReturn("wrongUser");
//		when(request.getParameter("password")).thenReturn("wrongPassword");
//		
//		when(request.getSession()).thenReturn(session);
//		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
//		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
//		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
//		when(request.getSession().getAttribute("wrongUser")).thenReturn(2);
//		
//		when(request.getSession().getAttribute("wrongUserfirst")).thenReturn(LocalTime.parse("01:59:30.123"));
//		when(request.getSession().getAttribute("wrongUsersecond")).thenReturn(LocalTime.parse("23:59:31.123"));
//		
//		StringWriter sw6 = new StringWriter();
//		PrintWriter pw6 = new PrintWriter(sw6);
//		when(response.getWriter()).thenReturn(pw6);
//		
//		LoginServlet login6 = new LoginServlet();
//		login6.doGet(request, response);
//		
//		pw6.flush();
//		assertTrue(sw6.toString().contains("login.jsp"));
		
		// Gives up after one failed attempt
		when(request.getParameter("username")).thenReturn("wrongUser");
		when(request.getParameter("password")).thenReturn("wrongPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(0);
		
		when(request.getSession().getAttribute("wrongUserfirst")).thenReturn(LocalTime.parse("01:59:30.123"));
		when(request.getSession().getAttribute("wrongUsersecond")).thenReturn(LocalTime.parse("23:59:31.123"));
		
		StringWriter sw7 = new StringWriter();
		PrintWriter pw7 = new PrintWriter(sw7);
		when(response.getWriter()).thenReturn(pw7);
		
		LoginServlet login7 = new LoginServlet();
		login7.doGet(request, response);
		
		pw7.flush();
		assertTrue(sw7.toString().contains("login.jsp"));
		
		// Gives up after two failed attempts
		when(request.getParameter("username")).thenReturn("wrongUser");
		when(request.getParameter("password")).thenReturn("wrongPassword");
		
		when(request.getSession()).thenReturn(session);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		when(request.getSession().getAttribute("wrongUser")).thenReturn(1);
		
		when(request.getSession().getAttribute("wrongUserfirst")).thenReturn(LocalTime.parse("01:59:30.123"));
		when(request.getSession().getAttribute("wrongUsersecond")).thenReturn(LocalTime.parse("23:59:31.123"));
		
		StringWriter sw8 = new StringWriter();
		PrintWriter pw8 = new PrintWriter(sw8);
		when(response.getWriter()).thenReturn(pw8);
		
		LoginServlet login8 = new LoginServlet();
		login8.doGet(request, response);
		
		pw8.flush();
		assertTrue(sw8.toString().contains("login.jsp"));
		
	}
}