package csci310.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


import csci310.SQLConnect;

public class retrieveStocksServlet extends HttpServlet {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {		
		
		SQLConnect.initConnection();
		Portfolio stockPortfolio = new Portfolio();
		stockPortfolio.portfolio = SQLConnect.retrieveStock();
		System.out.println(stockPortfolio.portfolio);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		String json = new Gson().toJson(stockPortfolio);
		response.getWriter().write(json);
		
	}

}

class Portfolio{
	public ArrayList<Map<String,String>> portfolio = new ArrayList<Map<String,String>>();
}
