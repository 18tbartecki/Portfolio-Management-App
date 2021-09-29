package csci310.servlets;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


import csci310.SQLConnect;

public class viewStocksServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {	
		
		SQLConnect.initConnection();
		
		
		String ticker = request.getParameter("ticker");
		String quantity = request.getParameter("quantity");
		String dateSold = request.getParameter("dateSold");
		String datePurchased = request.getParameter("datePurchased");
		String message = "Added to Graph";
		
		//remove leading and trailing space
		ticker = ticker.trim();
		
	   System.out.println(ticker+" "+ " "+quantity+ " "+dateSold + " "+datePurchased);
	   Pattern pattern = Pattern.compile("[a-zA-Z0-9]*");
	   Matcher matcher = pattern.matcher(ticker);
		  
	   SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd");
       Date datePurchasedFormat = new Date();
       Date dateSoldFormat = new Date();
	    try {
			datePurchasedFormat = sdformat.parse(datePurchased);
			dateSoldFormat = sdformat.parse(dateSold);
		} catch (ParseException e) {
			e.printStackTrace();
		}
	  
	  int quantityInt = Integer.parseInt(quantity);
	  if(ticker.matches(".*\\d.*") ||  !(matcher.matches()) ){
		    message = "Invalid ticker symbol";
	  } 
	  else if(quantityInt<0 || quantityInt ==0) {
		  message = "Quantity must be greater than 0";
	  }
	  else if(dateSoldFormat.compareTo(datePurchasedFormat) < 0) {
         System.out.println("dates invalid");
         message = "Start date must be before end date";
         
      }
	  else{
	         System.out.println("Start date is before end date");
	         
	  } 
	
		String json = new Gson().toJson(message);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}
}