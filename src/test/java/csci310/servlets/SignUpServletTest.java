package csci310.servlets;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Test;
import org.mockito.Mockito;


import csci310.SQLConnect;


public class SignUpServletTest extends Mockito {

	@Test 
	public void testDoGet() throws IOException, ServletException {
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		SQLConnect.initConnection();
		when(request.getParameter("username")).thenReturn("testUser4007");
		when(request.getParameter("password")).thenReturn("testPassword60");
		when(request.getParameter("confirmPassword")).thenReturn("testPassword60");
		
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		when(response.getWriter()).thenReturn(pw);
		
		SignUpServlet signUp = new SignUpServlet();
		signUp.doGet(request, response);
		
		pw.flush();
		assertTrue(sw.toString().contains("Success"));
		
		
		// Test Repeat Username
		when(request.getParameter("username")).thenReturn("testUser");
		when(request.getParameter("password")).thenReturn("testPassword");
		when(request.getParameter("confirmPassword")).thenReturn("testPassword");
		
		StringWriter sw2 = new StringWriter();
		PrintWriter pw2 = new PrintWriter(sw2);
		when(response.getWriter()).thenReturn(pw2);
		
		SignUpServlet signUp2 = new SignUpServlet();
		signUp2.doGet(request, response);
		
		pw2.flush();
		assertTrue(sw2.toString().contains("That username already exists, try again."));
		
		
		
	}

}