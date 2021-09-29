package csci310.servlets;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Test;
import org.mockito.Mockito;

import csci310.SQLConnect;

public class viewStocksServletTest extends Mockito{

	@Test
	public void testDoGet() throws IOException{
		
		SQLConnect.initConnection();
		SQLConnect.currentUserId = 3;
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		
		//Start date must be before end date
		when(request.getParameter("ticker")).thenReturn("AAPL");
		when(request.getParameter("quantity")).thenReturn("2");
		when(request.getParameter("dateSold")).thenReturn("2012-10-09");
		when(request.getParameter("datePurchased")).thenReturn("2011-10-09");
		
		StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
		
        viewStocksServlet servlet = new viewStocksServlet();
		servlet.doGet(request,response);
		
		System.out.println(stringWriter.toString());
        
        writer.flush();
		assertTrue(stringWriter.toString().contains("Added to Graph"));
		
		//Added stock to Graph
		when(request.getParameter("ticker")).thenReturn("GOOGL");
		when(request.getParameter("quantity")).thenReturn("2");
		when(request.getParameter("dateSold")).thenReturn("2012-10-09");
		when(request.getParameter("datePurchased")).thenReturn("2013-10-09");
		when(request.getParameter("formType")).thenReturn("add");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
        
        writer.flush();
		assertTrue(stringWriter.toString().contains("Added to Graph"));
		
		when(request.getParameter("ticker")).thenReturn("GOOGL");
		when(request.getParameter("quantity")).thenReturn("2");
		when(request.getParameter("dateSold")).thenReturn("2012-10-09");
		when(request.getParameter("datePurchased")).thenReturn("2012-10-09");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
        
        writer.flush();
		assertTrue(stringWriter.toString().contains("Added to Graph"));
		
		when(request.getParameter("formType")).thenReturn("add");
		when(request.getParameter("ticker")).thenReturn("GOOGL");
		when(request.getParameter("quantity")).thenReturn("2");
		when(request.getParameter("dateSold")).thenReturn("abc");
		when(request.getParameter("datePurchased")).thenReturn("abc");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
		
		writer.flush();
		assertTrue(stringWriter.toString().contains("Added to Graph"));
		
		
		//Quantity is less than 0
		when(request.getParameter("formType")).thenReturn("add");
		when(request.getParameter("ticker")).thenReturn("GOOGL");
		when(request.getParameter("quantity")).thenReturn("-1");
		when(request.getParameter("dateSold")).thenReturn("abc");
		when(request.getParameter("datePurchased")).thenReturn("abc");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
		
		writer.flush();
		assertTrue(stringWriter.toString().contains("Quantity must be greater than 0"));
		
		//Quantity is 0
		when(request.getParameter("formType")).thenReturn("add");
		when(request.getParameter("ticker")).thenReturn("GOOGL");
		when(request.getParameter("quantity")).thenReturn("0");
		when(request.getParameter("dateSold")).thenReturn("abc");
		when(request.getParameter("datePurchased")).thenReturn("abc");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
		
		writer.flush();
		assertTrue(stringWriter.toString().contains("Quantity must be greater than 0"));
		
		//Ticker is only a number
		when(request.getParameter("formType")).thenReturn("add");
		when(request.getParameter("ticker")).thenReturn("1");
		when(request.getParameter("quantity")).thenReturn("0");
		when(request.getParameter("dateSold")).thenReturn("abc");
		when(request.getParameter("datePurchased")).thenReturn("abc");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
		
		writer.flush();
		assertTrue(stringWriter.toString().contains("Invalid ticker symbol"));
	
		//Ticker has special characters
		when(request.getParameter("formType")).thenReturn("add");
		when(request.getParameter("ticker")).thenReturn("@a");
		when(request.getParameter("quantity")).thenReturn("0");
		when(request.getParameter("dateSold")).thenReturn("abc");
		when(request.getParameter("datePurchased")).thenReturn("abc");
		when(response.getWriter()).thenReturn(writer);
		servlet.doGet(request,response);
		
		writer.flush();
		assertTrue(stringWriter.toString().contains("Invalid ticker symbol"));
	}

}
