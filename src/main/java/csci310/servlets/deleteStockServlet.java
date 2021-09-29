package csci310.servlets;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import csci310.SQLConnect;

public class deleteStockServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {	
		SQLConnect.initConnection();
		
		//Retrieve from frontend
		String ticker = request.getParameter("ticker");
		String quantity = request.getParameter("quantity");
		String dateSold = request.getParameter("dateSold");
		String datePurchased = request.getParameter("datePurchased");
		int quantityInt = Integer.parseInt(quantity);
		String message = "Deleted Successfully";
		
		//delete from database
		SQLConnect.deleteStock(ticker,quantityInt,dateSold,datePurchased);
		
		String json = new Gson().toJson(message);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
	}
}
