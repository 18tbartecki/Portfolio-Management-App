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

public class deleteStockServletTest extends Mockito {

	@Test
	public void testDoGet() throws IOException{
		SQLConnect.initConnection();
		SQLConnect.currentUserId = 3;
		
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		
		//Sold date must be before purchased date
		SQLConnect.addStocks("AAPL", 2, "2020-10-07", "2020-10-09");
		when(request.getParameter("ticker")).thenReturn("AAPL");
		when(request.getParameter("quantity")).thenReturn("2");
		when(request.getParameter("dateSold")).thenReturn("2020-10-07");
		when(request.getParameter("datePurchased")).thenReturn("2020-10-09");
		StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
				
		
		deleteStockServlet servlet = new deleteStockServlet();
		servlet.doGet(request,response);
		

        writer.flush();
		assertTrue(stringWriter.toString().contains("Deleted Successfully"));
	}

}
