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

public class retrieveStocksServletTest extends Mockito {

	@Test
	public void testDoGet() throws IOException{
		SQLConnect.initConnection();
		SQLConnect.currentUserId = 3;
		
		HttpServletRequest request = mock(HttpServletRequest.class);
		HttpServletResponse response = mock(HttpServletResponse.class);
		
		StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(writer);
		
		retrieveStocksServlet servlet = new retrieveStocksServlet();
		servlet.doGet(request,response);
		

        writer.flush();
		assertTrue(stringWriter.toString().contains("portfolio"));
	}

}
