package csci310.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


import csci310.SQLConnect;

public class addStockServlet extends HttpServlet{
	
	@Override 
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		SQLConnect.initConnection();
		
		
		String ticker = request.getParameter("ticker");
		String quantity = request.getParameter("quantity");
		String dateSold = request.getParameter("dateSold");
		String datePurchased = request.getParameter("datePurchased");
		String message = "Added Successfully";
		String formType = request.getParameter("formType");
		long daysBetweenSoldAndToday = 0;
		
			//remove leading and trailing space
			ticker = ticker.trim();
		
		  System.out.println(ticker+" "+ " "+quantity+ " "+dateSold + " "+datePurchased);
		  Pattern pattern = Pattern.compile("[a-zA-Z0-9]*");
		  Matcher matcher = pattern.matcher(ticker);
		  
		   SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd");
	       Date datePurchasedFormat = new Date();
	       Date dateSoldFormat = new Date();
	       DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");  
	       LocalDateTime now = LocalDateTime.now();
	       LocalDate dateBefore = LocalDate.parse(dtf.format(now));;
	       LocalDate dateAfter =LocalDate.parse(dtf.format(now));
	       LocalDate dateSoldTodayCompa = LocalDate.parse(dtf.format(now));;
		    try {
				datePurchasedFormat = sdformat.parse(datePurchased);
				if(!dateSold.equals("Not Specified")) {
					dateSoldFormat = sdformat.parse(dateSold);
					
					dateSoldTodayCompa = LocalDate.parse(dateSold);
					daysBetweenSoldAndToday = ChronoUnit.DAYS.between(dateSoldTodayCompa,dateAfter);
					System.out.println("Date sold: "+daysBetweenSoldAndToday);

				}
				dateBefore = LocalDate.parse(datePurchased);
				dateAfter = LocalDate.parse(dtf.format(now));
			} catch (ParseException e) {
				e.printStackTrace();
			}
		  
		    int quantityInt = Integer.parseInt(quantity);
		  	
				
			//calculating number of days in between
			long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore,dateAfter);
				
			//displaying the number of days
			System.out.println(noOfDaysBetween);
			
		
		       
		    //System.out.println("differenceInDays: " + diffInDays);
		  
		  if(ticker.matches(".*\\d.*") ||  !(matcher.matches()) ){
			    message = "Invalid ticker symbol";
		  } 
		  else if(quantityInt<0 || quantityInt ==0) {
			  message = "Quantity must be greater than 0";
		  }
		  else if(!dateSold.equals("Not Specified") && dateSoldFormat.compareTo(datePurchasedFormat) < 0) {
	         System.out.println("dates invalid");
	         message = "Purchased date must be before sold date";
	         
	      }
		  else if(noOfDaysBetween>365 || noOfDaysBetween<0) {
		    	message = "You must add a stock purchased within 1 year from today";
		  }
		  else if(!dateSold.equals("Not Specified") && daysBetweenSoldAndToday<0) {
			  message = "Invalid: You can't sell a stock at a future date";
		  }
		  else{
		         System.out.println("dates match");
		         
		         //add only if form type is for adding a stock
		         if (formType.equalsIgnoreCase("add")) {
		        	 SQLConnect.addStocks(ticker, Integer.parseInt(quantity), dateSold, datePurchased);
			         System.out.println("Stock Added");
		         }
		  } 
		
			String json = new Gson().toJson(message);
			response.setContentType("application/json");
			response.setCharacterEncoding("UTF-8");
			response.getWriter().write(json);
	}
}
