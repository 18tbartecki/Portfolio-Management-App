/* The cors_api_url variable is to bypass some CORS stuff. It is a heroku app. Kinda weird. */
const cors_api_url = "https://fierce-inlet-95803.herokuapp.com/";

/* This is a samlpe url that could go in the API */
const test_url = "https://query1.finance.yahoo.com/v7/finance/download/FB?period1=1569036975&period2=1600659375&interval=1wk&events=history";

var deletedStocksCounter = 0; // checks the number of deleted stocks by a user
var deletedViewStocksCounter = 0; // checks the number of viewed stocks deleted by a user

var originalNotSpecifiedArray = new Array(); // add a stock

var today = new Date(); // today's date
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

var viewStocksArray = new Array(); // array of individual stocks user is viewing
var viewStocksData = new Array(); // array of individual stocks formatted for the portfolio graph
var viewCounter = 0; // counter of index of view stock

var resultPortfolio2;

var index = -1;
var viewIndex = -1;
var newPortfolio = new Array(); //stores the individual user's portfolio of stocks
var indexData = new Array(); //stores the dates and prices of the index
var portfolioData = new Array(); //stores the dates and prices of the value of the users portfolio
var userPortfolio = new Array(); //have this for toggling purposes. it stores the user's portfolio, but does NOT have price data like the 2 variables above
//making these global because I need two functions to access them
var chartDates = new Array();
var chartIndexData = new Array();
var chartPortfolioData = new Array();
var interval; // interval that's selected

/* This function is called when the page is loaded. It shows the load wheel and 
 * calls a function that takes a JSON file. */
function loadPortfolio(interval) {
	/* Showing the loading wheel */
	portfolioData = new Array(); //stores the dates and prices of the value of the users portfolio
	userPortfolio = new Array();
	indexData = new Array();
	
	//showing the loading wheels for the 3 different sections that have to load data from the database or api
	document.getElementById("chart-loading-wheel").style.visibility = "visible";
	document.getElementById("stock-loading-wheel").style.visibility = "visible";
	document.getElementById("delete-loading-wheel").style.visibility = "visible";
	document.getElementById("deleteTable").style.visibility = "hidden";

	document.getElementById("portfolio-stocks-disable").style.visibility = "hidden";
	document.getElementById("portfolio-stocks-enable").style.visibility = "hidden";
	
	document.getElementById("individual-stocks-disable").style.visibility = "hidden";
	document.getElementById("individual-stocks-enable").style.visibility = "hidden";
	
	document.getElementById('spy-line-toggle').innerText = "Disable S&P Line";
 
	retrieveStocks(interval); //getting the stocks from the user's portfolio. calls sqlite database. interval is one month. then it loads it up
	
	// retrieveViewedStocks(interval); // getting the currently viewed stocks from the session
	
//	if(viewStocksData.length > 0) {
//		for(var i = 0; i < viewStocksData.length; i++) {
//			var stockName = viewStocksData[i].ticker;
//			var stockAPI = viewStocksData[i].prices;
//			addViewStock(stockName, stockAPI);
//		}
//	}
	
	//there are four json files that you can use as tests
	//insertPortfolio("PortfolioJSON1.json");
	//insertPortfolio("PortfolioJSON2.json");
	//insertPortfolio("PortfolioJSON3.json");
	//insertPortfolio("PortfolioJSON4.json");
	//insertPortfolio("PortfolioJSON5.json", interval); //this can be used to run the hardcoded json portfolio files
}

function clearError(){
	document.getElementById("add-stock-message").innerHTML = "";
}

function clearErrorView(){
	document.getElementById("view-stock-message").innerHTML = "";
}

function checkAddSubmission() {
	let error = 0;
	let ticker = document.getElementById("add-stock-ticker").value;
	let quantity =document.getElementById("add-stock-quantity").value;
	let ds = document.getElementById("add-stock-ds").value;
	let dp = document.getElementById("add-stock-dp").value;
	var limitExceed = 0;
	
	var optionalSoldField = document.getElementById("add-stock-ds").value;
   	if(!optionalSoldField || optionalSoldField == ""){
   		optionalSoldField = "Not Specified";
   	}
   	if(!dp || dp==""){
   		document.getElementById("add-stock-message").innerHTML = "Please enter a value in the date purchased field.";
   		document.getElementById("add-stock-message").style = "color:red";
   		return;
   	}
   	
   	document.getElementById("add-stock-message").innerHTML = "";
	
	console.log(quantity, "   ", ds, "   ", dp);
	//return;
	//note: the form already makes sure the user enters stuff
	
	//checking the user entered a positive quantity
	if(quantity < 1) {
		document.getElementById("add-stock-message").innerHTML = "Please enter a positive quantity.";
        document.getElementById("add-stock-message").style = "color:red";
		return;
	}
	
	if(/\d/.test(ticker)){
		error = 1;
	}
	
	if(quantity>10000000){
		limitExceed = 1;
	}

	// check if date sold is empty
	if(!ds || ds == "") { // check if null
		ds = today;
	}
	
	request = new XMLHttpRequest();
	indexURL = getURLFromStockInfo(ticker,dp, ds, interval);
	console.log(indexURL);
	request.open("GET", cors_api_url+indexURL);
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			$.ajax({
				url: "addStockServlet",
				data: {
					formType:"add",
					ticker: ticker,
				    quantity: quantity,
				    dateSold: optionalSoldField,
		            datePurchased: dp
				},
				success: function(result) {
					if (result == "Added Successfully"){
						document.getElementById("add-stock-message").innerHTML = "Added Successfully";
				        document.getElementById("add-stock-message").style = "color:green";
				        loadPortfolio(interval);
					}
					else {
						document.getElementById("add-stock-message").innerHTML = result;
				        document.getElementById("add-stock-message").style = "color:red";
					}
				}
			})
			console.log(document.getElementById("add-stock-ticker").value);
			return false;
		} else {
			document.getElementById("add-stock-message").innerHTML = "Please enter a valid stock.";
	        document.getElementById("add-stock-message").style = "color:red";
			return false;
		}
	}
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
	request.send();
	
	
}

function selectGraphRange(){
	document.getElementById("graphRangeMesssage").innerHTML = "";
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	var today = new Date(year, month, day);
	var one_day=1000*60*60*24;
	
	
	
	var start = new Date(document.getElementById("startDateRangePicker").value);
	var end = new Date(document.getElementById("endDateRangePicker").value);
	if(start >= end) {
		document.getElementById("graphRangeMesssage").innerHTML = "Start Date must be before end Date";
		document.getElementById("graphRangeMesssage").style = "color:red";
		return false;
	}
	
	var daysBetween = Math.ceil((start.getTime()-today.getTime()))/one_day;
	
	if(Math.abs(daysBetween) > 365) {
		document.getElementById("graphRangeMesssage").innerHTML = "Stock start date should not go beyond 1 year from today";
		document.getElementById("graphRangeMesssage").style = "color:red";
		return false;
	}
	document.getElementById("startDateRangeTestHidden").innerHTML = document.getElementById("startDateRangePicker").value;
	document.getElementById("endDateRangeTestHidden").innerHTML = document.getElementById("endDateRangePicker").value;
	
	
	getStockDataFromAPIGrapeRangePicker(userPortfolio, new XMLHttpRequest(), 0, userPortfolio.length+2, interval);
}

function getStockDataFromAPIGrapeRangePicker(portfolio, request, i, length, interval) {
	/* If i>= length, that means we have loaded the data for the index and all of the stocks in the 
	 * portfolio. So, we chart by calling the loadPortfolioChart() function*/
	console.log("stock date from API graph range picker");
	console.log("Portfolio for range"+ portfolio[0]);
	if (i>= length) {
	    drawChart(1);
		return;
	} else if(i == 0) {
		/* if i==0, then we will get data for the index. We only have to do this once. Might as well do it first*/
		//This is so that the index is the first call I make to the api. I need the index to be the first stock I call so that I can 
		//get all of the dates we need
		//here's where we use the cors_api_url variable. it just goes before the yahoo finance url
		//I want to find the earliest date-purchased so I know how far back the index and graph should go. 
		let earliestDate = document.getElementById("startDateRangePicker").value; //these functions are defined below
		let latestDate = document.getElementById("endDateRangePicker").value;
		console.log("graph range earlies date"+earliestDate);
		console.log(latestDate);
		indexURL = getURLFromStockInfo("SPY",earliestDate, latestDate, interval);
		request.open("GET", cors_api_url+indexURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				let indexDataAPI = parsePrices(request.response);
				//going through the index and adding the dates to the portfolio data array
				for(let j=0; j<indexDataAPI.length; j++) {
					indexData[j] = {date: indexDataAPI[j].date, price: 0};
					portfolioData[j] = {date: indexDataAPI[j].date, stocks: []};
				}
				getStockDataFromAPIGrapeRangePicker(portfolio, request, i + 1, length);
			}
		}
		 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
		request.send();
	} else if(i == 1) {
		let earliestDate = document.getElementById("startDateRangePicker").value; //these functions are defined below
		let latestDate = document.getElementById("endDateRangePicker").value;
		//getting daily data now
		indexURL = getURLFromStockInfo("SPY",earliestDate, latestDate, "1d");
		request.open("GET", cors_api_url+indexURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				let indexDataAPI = parsePrices(request.response);
				//going through the index and adding the dates to the portfolio data array
				//indexData is a global variable declared at the top of the file and 
				//refers to the values from the previous API call
				//now just trying to find the daily price from that date in time
				for(let j=0; j<indexData.length; j++) {
					//console.log(indexData[j].date, indexDataAPI);
					//this if-statement makes sure the date exists before we serach for it
					if(!(indexDataAPI[0].date > indexData[j].date || indexDataAPI[indexDataAPI.length-1].date < indexData[j].date)) {
						//console.log("looking for");
						//console.log(indexData[j].date);
						indexDateBinarySearch(indexData[j].date, indexDataAPI, 0, indexDataAPI.length-1, j);
					}
				}
				getStockDataFromAPIGrapeRangePicker(portfolio, request, i + 1, length);
			}
		}
		 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
		request.send();
	} else {
		let currentStock = portfolio[i-2]; //i-1 because the first stock we get info from is the index
		let currTicker = currentStock.ticker;
		let currQuantity = currentStock.quantity;
		let stockAPIURL = cors_api_url + getURLFromStockInfo(currentStock.ticker, currentStock.datePurchased, currentStock.dateSold,"1d");
		request.open("GET", stockAPIURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				/* this XMLHttpRequest will return a CSV to us 
				 * we parse it using the prasePrices function*/
				var stockDataAPI = parsePrices(request.response);
				aggregatePortfolio(stockDataAPI, currTicker, currQuantity, i-2);
				getStockDataFromAPIGrapeRangePicker(portfolio, request, i + 1, length);
				console.log("line 389: ");
				console.log(indexData);
			}
		}
		
		//only want to send request if it the stock is in the portfolio
		if(currentStock.inPortfolio == 1) {
			 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
			request.send();
		} else {
			getStockDataFromAPIGrapeRangePicker(portfolio, request, i + 1, length);
		}
	}	
}



   
function checkViewSubmission() {
	let ticker = document.getElementById("view-stock-ticker").value;
	let quantity =document.getElementById("view-stock-quantity").value;
	let dp = document.getElementById("view-stock-dp").value;
	let ds = document.getElementById("view-stock-ds").value;
	
	var optionalSoldField = document.getElementById("view-stock-ds").value;
   	if(!optionalSoldField || optionalSoldField == ""){
   		optionalSoldField = "Not Specified";
   	}
	
	console.log(ticker);
	console.log(quantity);
	console.log(ds);
	console.log(dp);
	
	//Empty message
	document.getElementById("view-stock-message").innerHTML = "";
	
	//note: the form already makes sure the user enters stuff
	
	//checking the user entered a positive quantity
	if(quantity < 1) {
		document.getElementById("view-stock-message").innerHTML = "Please enter a positive quantity.";
        document.getElementById("view-stock-message").style = "color:red";
		return;
	}
	
	// check if end date is empty
	if(!ds || ds == "") { // check if null
		ds = today;
	}
	
	request = new XMLHttpRequest();
	indexURL = getURLFromStockInfo(ticker,dp, ds, interval);
	console.log(indexURL);
	request.open("GET", cors_api_url+indexURL);
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			$.ajax({
				url: "viewStocksServlet",
				data: {
					formType:"view",
					ticker: ticker,
				    quantity: quantity,
				    datePurchased: dp,
				    dateSold: ds
				},
				success: function(result) {
					if (result == "Added to Graph"){
						document.getElementById("view-stock-message").innerHTML = "Added to Graph";
				        document.getElementById("view-stock-message").style = "color:green";
				        
				        document.getElementById("individual-stocks-disable").style.visibility = "visible";
				    	document.getElementById("individual-stocks-enable").style.visibility = "visible";
				    	
				    	document.getElementById('viewStocksMessage').innerText = "Stocks you are viewing...";
				        
				        // add to our map
				        var elem1 = ticker;
				        var elem2 = quantity;
				        var elem3 = dp;
				        var elem4 = ds;
				        
				        viewStocksArrayElem = {ticker: elem1, quantity: elem2, datePurchased: elem3, dateSold: ds}
				        viewStocksArray.push(viewStocksArrayElem);
				        
				        console.log("viewStocksArray: ");
				        console.log(viewStocksArray);
				        
				        getViewStockDataFromAPI(viewStocksArray, new XMLHttpRequest(), viewCounter, viewStocksArray.length, interval);
				        viewCounter++;
					}
					else {
						document.getElementById("view-stock-message").innerHTML = result;
				        document.getElementById("view-stock-message").style = "color:red";
					}
				}
			})
			return false;
		} else {
			document.getElementById("view-stock-message").innerHTML = "Please enter a valid stock.";
	        document.getElementById("view-stock-message").style = "color:red";
			return false;
		}
	}
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
	request.send();
}

function deleteStock() {
	console.log("In delete function");
	var stock = newPortfolio[index];
	for(let i=0; i < originalNotSpecifiedArray.length; i++) {
		if(index == originalNotSpecifiedArray[i]) {
			stock.dateSold = "Not Specified";
			break;
		}
	}
	console.log(stock);
	document.getElementById("deleteStockTestHidden").innerHTML = deletedStocksCounter;
	$.ajax({
		url: "deleteStockServlet",
		data: {
			ticker: stock.ticker,
		    quantity: stock.quantity,
		    dateSold: stock.dateSold,
            datePurchased: stock.datePurchased
		},
		success: function(result) {
			console.log(result);
			retrieveStocks(); // automatically update our portfolio
			
			if (result == "Deleted Successfully"){
				document.getElementById("message-deleteStock").innerHTML = "Deleted Successfully";
		        document.getElementById("message-deleteStock").style = "color:green";
		        console.log("Deleted Succesfully");
		        
		        // we have deleted a stock
		        deletedStocksCounter++;
		        
		        // for testing delete stock functionality
		        document.getElementById("deleteStockTestHidden").innerHTML = deletedStocksCounter;
		      
		        document.getElementById("confirmDeleteStock").disabled = true;
		        window.location.reload(true);
			}
			else {
				document.getElementById("message-viewStocks").innerHTML = result;
		        document.getElementById("message-viewStocks").style = "color:red";
			}
		}
	})
}

function retrieveStocks() {
	console.log("In function");
	$.ajax({
		url: "retrieveStocksServlet",
		data: {
			formType:"retrievStock"
		},
		success: function(result) {
			console.log(result);
			
			// check which interval button is selected
			if(document.getElementById("1d").checked) {
				interval = "1d";
			}
			
			if(document.getElementById("1wk").checked) {
				interval = "1wk";
			}
			
			if(document.getElementById("1mo").checked) {
				interval = "1mo";
			}
			
			//if statements see if the date purchased and date sold are logical
			userPortfolio = result.portfolio;
			for(let i=0; i<userPortfolio.length; i++) {
				userPortfolio[i].inPortfolio = 1;
			}
			
			console.log("result.portfolio: ");
			console.log(result.portfolio);
			
			resultPortfolio2 = result.portfolio;
			
//			for(let i=0; i<userPortfolio.length; i++) {
//				if(userPortfolio[i].datePurchased > userPortfolio[i].dateSold) {
//					userPortfolio[i].inPortfolio = 0;
//					console.log(userPortfolio[i]);
//				} else {
//					userPortfolio[i].inPortfolio = 1;
//				}
//			}

			var portfolioElem = result.portfolio;
			newPortfolio = portfolioElem;
			var firstElem = portfolioElem[1];
			console.log(firstElem);
			
			document.getElementById("delete-loading-wheel").style.visibility = "hidden";
			document.getElementById("deleteTable").style.visibility = "visible";
			
			document.getElementById("portfolio-stocks-disable").style.visibility = "visible";
			document.getElementById("portfolio-stocks-enable").style.visibility = "visible";
			
			var userTable = document.getElementById("deleteTable");
			
			userTable.innerHTML = 
				'<thead><tr><th>Ticker</th><th>Quantity</th><th>Date Bought</th><th>Date Sold</th><th>Remove?</th></tr></thead>';
				
			for(let i=0; i < portfolioElem.length; i++) {
				var elemI = portfolioElem[i];
				userTable.innerHTML +=
					'<tr><th>' + elemI.ticker + '</th>' +
					'<th>' + elemI.quantity + '</th>' +
					'<th>' + elemI.datePurchased + '</th>' +
					'<th>' + elemI.dateSold + '</th>' +
					'<th><button type="button" onclick="passInIndex('+i+')" class="btn btn-danger" data-toggle="modal" data-target="#confirmStockDelete"><i class="fas fa-trash-alt"></i> Delete</button>' +
					'</tr>';
			}
			
			// if no date sold was entered by user, use a dummy value of today's date for our API call
			for(let i = 0; i < userPortfolio.length; i++) {
				if(userPortfolio[i].dateSold == "Not Specified") {
					originalNotSpecifiedArray.push(i);
					userPortfolio[i].dateSold = today;
				}
			}
			getStockDataFromAPI(result.portfolio, new XMLHttpRequest(), 0, result.portfolio.length+2, interval);
			
			
		}
		
	})	
}

// for add a stock
function passInIndex(i) {
	index = i;
	console.log(index);	
}


// for view a stock
function passInIndex2(i) {
	viewIndex = i;
	console.log(viewIndex);	
}

/* This function takes a JSON file name as an argument, finds that file, and parses it*/
function insertPortfolio(data, interval) {
	fetch(data)
		.then(response => response.json())
		.then(json => {
			userPortfolio = json.portfolio; //"portfolio" is from the JSON file. it contains the stocks in the user's portfolio
			//this for-loop goes through the portfolio and creates a flag, "inPortfolio," that is set to 1. 
			//when the user toggles off a stock, this value will be set to 1.
			for(let i=0; i<userPortfolio.length; i++) {
				userPortfolio[i].inPortfolio = 1;
			}
			getStockDataFromAPI(userPortfolio, new XMLHttpRequest(), 0, userPortfolio.length+2, interval); //+2 because I have to make two calls before
		});	
}

/* For View A Stock" feature */
function getViewStockDataFromAPI(portfolio, request, i, length, interval) {
//	console.log("in getviewStockDataFromAPI");
//	console.log(i);
	let currentStock = portfolio[i];
//	console.log("current stock:");
//	console.log(currentStock);
	
	let currTicker = currentStock.ticker;
	let currQuantity = currentStock.quantity;
	
	let stockAPIURL = cors_api_url + getURLFromStockInfo(currentStock.ticker, currentStock.datePurchased, currentStock.dateSold,"1d");
	console.log(stockAPIURL);
	request.open("GET", stockAPIURL);
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			/* this XMLHttpRequest will return a CSV to us 
			 * we parse it using the prasePrices function*/
			console.log("in line 351");
			// got the prices & dates
			var stockDataAPI = parsePrices(request.response);
			console.log("stockDataAPI: ");
			console.log(stockDataAPI);
			
			// now add to graph
			// addViewStock(currTicker, stockDataAPI);
			
			var newViewedStock = {ticker: currTicker, prices: stockDataAPI}
			
			viewStocksData.push(newViewedStock);
			
			drawChart(1);
			
			loadToggleDiv2();
		}
	}
	request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
	request.send();
}

function getStockDataFromAPI(portfolio, request, i, length, interval) {
	/* If i>= length, that means we have loaded the data for the index and all of the stocks in the 
	 * portfolio. So, we chart by calling the loadPortfolioChart() function*/
	if (i>= length) {
	    drawChart(1);
		return;
	} else if(i == 0) {
		/* if i==0, then we will get data for the index. We only have to do this once. Might as well do it first*/
		//This is so that the index is the first call I make to the api. I need the index to be the first stock I call so that I can 
		//get all of the dates we need
		//here's where we use the cors_api_url variable. it just goes before the yahoo finance url
		//I want to find the earliest date-purchased so I know how far back the index and graph should go. 
		let earliestDate = getEarliestDate(portfolio); //these functions are defined below
		let latestDate = getLatestDate(portfolio);
		console.log(earliestDate);
		console.log(latestDate);
		indexURL = getURLFromStockInfo("SPY",earliestDate, latestDate, interval);
		request.open("GET", cors_api_url+indexURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				let indexDataAPI = parsePrices(request.response);
				//going through the index and adding the dates to the portfolio data array
				for(let j=0; j<indexDataAPI.length; j++) {
					indexData[j] = {date: indexDataAPI[j].date, price: 0};
					portfolioData[j] = {date: indexDataAPI[j].date, stocks: []};
				}
				getStockDataFromAPI(portfolio, request, i + 1, length);
			}
		}
		 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
		request.send();
	} else if(i == 1) {
		let earliestDate = getEarliestDate(portfolio); //these functions are defined below
		let latestDate = getLatestDate(portfolio);
		//getting daily data now
		indexURL = getURLFromStockInfo("SPY",earliestDate, latestDate, "1d");
		request.open("GET", cors_api_url+indexURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				let indexDataAPI = parsePrices(request.response);
				//going through the index and adding the dates to the portfolio data array
				//indexData is a global variable declared at the top of the file and 
				//refers to the values from the previous API call
				//now just trying to find the daily price from that date in time
				for(let j=0; j<indexData.length; j++) {
					//console.log(indexData[j].date, indexDataAPI);
					//this if-statement makes sure the date exists before we serach for it
					if(!(indexDataAPI[0].date > indexData[j].date || indexDataAPI[indexDataAPI.length-1].date < indexData[j].date)) {
						//console.log("looking for");
						//console.log(indexData[j].date);
						indexDateBinarySearch(indexData[j].date, indexDataAPI, 0, indexDataAPI.length-1, j);
					}
				}
				getStockDataFromAPI(portfolio, request, i + 1, length);
			}
		}
		 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
		request.send();
	} else {
		let currentStock = portfolio[i-2]; //i-1 because the first stock we get info from is the index
		let currTicker = currentStock.ticker;
		let currQuantity = currentStock.quantity;
		let stockAPIURL = cors_api_url + getURLFromStockInfo(currentStock.ticker, currentStock.datePurchased, currentStock.dateSold,"1d");
		request.open("GET", stockAPIURL);
		request.onreadystatechange = function() {
			if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
				/* this XMLHttpRequest will return a CSV to us 
				 * we parse it using the prasePrices function*/
				var stockDataAPI = parsePrices(request.response);
				aggregatePortfolio(stockDataAPI, currTicker, currQuantity, i-2);
				getStockDataFromAPI(portfolio, request, i + 1, length);
				console.log("line 389: ");
				console.log(indexData);
			}
		}
		
		//only want to send request if it the stock is in the portfolio
		if(currentStock.inPortfolio == 1) {
			 request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
			request.send();
		} else {
			getStockDataFromAPI(portfolio, request, i + 1, length);
		}
	}	
}

/* This function simply gets the earliest date from the portfolio */
function getEarliestDate(portfolio) {
	let earliestDate = portfolio[0].datePurchased; //sets the variable to the first element of the portfolio
	for(var i=0; i<portfolio.length-1; i++) {
		/* This if-statement simply swaps two elements if one has a lower date*/
		if(portfolio[i+1].datePurchased < earliestDate) {
			earliestDate = portfolio[i+1].datePurchased;
		}
	}
	return earliestDate;
}

/* This function simply finds the latest date in the portoflio*/
function getLatestDate(portfolio) {	
	//console.log(portfolio);
	var latestDate = portfolio[0].dateSold;
	for(var i=0; i<portfolio.length-1; i++) {
		if(portfolio[i+1].dateSold > latestDate) {
			latestDate = portfolio[i+1].dateSold;
		}
	}
	return latestDate;
}

/* This function simply takes a date such as 09-29-2020, and returns its Unix timestamp at 4:01 pm EDT. 
 * We do this because we need the Unix timestamp to call the API */
function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	//addded the 72001 to get the market close price, as the Date.parse() function returns the 
	//time at 12:00am, which means we don't get the current day's closing price
	return (datum/1000) + 72001;
}

function getURLFromStockInfo(ticker, purchaseDate, soldDate, interval) {
	/* The template variables are for creating the url that goes into the API */
	const TEMPLATE1 = "https://query1.finance.yahoo.com/v7/finance/download/";
	const TEMPLATE2 = "?period1=";
	const TEMPLATE3 = "&period2=";
	const TEMPLATE4 = "&interval=";
	const TEMPLATE5 = "&events=history";
	return TEMPLATE1 + ticker + TEMPLATE2 + toTimestamp(purchaseDate) + TEMPLATE3 + toTimestamp(soldDate) + TEMPLATE4 + interval + TEMPLATE5;
}

/* This function takes the stock data in the from of a CSV, parses it as a JSON, and then 
 * returns the dates and closing prices of the stock as an array of objects
 */
function parsePrices(data) {
	console.log("LINE 564: in parsePrices()");
	var prices = new Array();
	var dataJSON = Papa.parse(data).data;
	for(var i = 1; i<dataJSON.length; i++) {
		prices.push({date: dataJSON[i][0],price: dataJSON[i][4]}); //[0] corresponds to the date, [4] corresponds to the closing price on that date
	}
	return prices;
}

//go through our list of dates, and find the matching dates in the individual stocks.
function aggregatePortfolio(stockData, ticker, quantity, indexInUserPortfolio) {
	/*At this point in time, portfolioData has all of the dates we need for the portfolio.
	 * We basically go through the dates of the portfolio, then find if the stock data contains that date. 
	 * if it does, we add the value of the stock, times its quantity, to the value of the portfolio*/ 
	for(var i=0; i<portfolioData.length; i++) {
		//the if-statements determines if we should even check for a date. If the entire condition returns false, that 
		//means that the stock was not in the portfolio on a portfolioDate[i].date
		if(!(stockData[0].date > portfolioData[i].date || stockData[stockData.length-1].date < portfolioData[i].date)) {
			stockDateBinarySearch(portfolioData[i].date, stockData, 0, stockData.length-1, i, ticker, quantity, indexInUserPortfolio);
		}
	}
}
//This function performs binary search on the stock's price data 
//targetDate is the date we are searching for in the stock's price data
//stockData contains the daily prices of the stock
//indexInPortfolio tells us where to add the value of the stock, if it containts the targetdate
function stockDateBinarySearch(targetDate, stockData, startIndex, endIndex, indexInPortfolio, ticker, quantity, indexInUserPortfolio) {
	let mid = Math.floor((startIndex + endIndex)/2); 
	if (startIndex > endIndex) {
		/*
		 * Ok, there is something important to mention here. Sometimes, Yahoo Finance has incomplete data.
		 * On these days, the value of the stock is 0. Obviously, we cannot use the value 0 as the stock certainly
		 * has a non-zero value. So, we then search for the date after the targetDate. This algortihm will return
		 * the price of the first business date after the targetDate.
		 * 
		 * For instance, if targetDate = 2020-01-01 and the stock's data does not
		 * contain that date, then the next date we search for is 2020-01-02. Then, if the stock's data
		 * still does not have that date, we would serach for 2020-01-03. This goes on until we find a date and price we can use. 
		 * 
		 */
		var date = new Date(targetDate);
		date.setDate(date.getDate() +2); //+2 gets the correct date for the date after the targetdate
		var nextDateString = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2);
		return stockDateBinarySearch(nextDateString, stockData, 0, stockData.length-1, indexInPortfolio, ticker, quantity, indexInUserPortfolio);
	} else if (stockData[mid].date===targetDate) {
		//adding that stock to an array of stocks who were in the portfolio on a specific day
		portfolioData[indexInPortfolio].stocks.push({ticker: ticker, quantity: quantity, price: stockData[mid].price, indexInUserPortfolio: indexInUserPortfolio});
		//console.log(portfolioData[indexInPortfolio].stocks);
		return;
	} else if(stockData[mid].date > targetDate) {
		return stockDateBinarySearch(targetDate, stockData, startIndex, mid-1, indexInPortfolio, ticker, quantity, indexInUserPortfolio);
	} else {
	    return stockDateBinarySearch(targetDate, stockData, mid+1, endIndex, indexInPortfolio, ticker, quantity, indexInUserPortfolio); 
	}
}

//This function does binary search on the index's data. It is a slightly different function that
//stockDateBinarySearch, hence the new function declaration
function indexDateBinarySearch(targetDate, stockData, startIndex, endIndex, indexInPortfolio) {
	let mid = Math.floor((startIndex + endIndex)/2);
	//basically, if we can't find the date, we search for the next day
	if (startIndex > endIndex) {
		var date = new Date(Date.parse(targetDate));
		date.setDate(date.getDate()+2); //plus 2 to get the correct date. 
		var nextDateString = date.getFullYear() + "-" + ("0"+(date.getMonth() + 1)).slice(-2) + "-" + ("0"+date.getDate()).slice(-2);
		/*console.log("previous day is: ",targetDate);
		console.log("next day is: ",nextDateString);
		console.log("official previous day is: ", new Date(Date.parse(targetDate)));
		console.log("official next day is: ", date);*/
		return indexDateBinarySearch(nextDateString, stockData, 0, stockData.length-1, indexInPortfolio);
	} else if (stockData[mid].date===targetDate) {
		indexData[indexInPortfolio].price = stockData[mid].price;
		return;
	} else if(stockData[mid].date > targetDate) {
		return indexDateBinarySearch(targetDate, stockData, startIndex, mid-1, indexInPortfolio);
	} else {
	    return indexDateBinarySearch(targetDate, stockData, mid+1, endIndex, indexInPortfolio); 
	}
}

//this function loads the table of user stocks that could be toggled.  it's the div to the right of the chart
function loadToggleDiv() {
	document.getElementById("stock-loading-wheel").style.visibility = "hidden";
	
	var userTable = document.getElementById("dataTable");
	
	userTable.innerHTML = 
		'<thead><tr><th>Ticker</th><th>On/Off</th><th>Remove?</th></tr></thead>';
		
	for(let i=0; i < userPortfolio.length; i++) {
		if(i==0){
			userTable.innerHTML +=
				'<tr><th>' + userPortfolio[i].ticker + '</th>' +
				'<th><input name="userStocksCheckboxes" id="checkbox-test-'+i+'" type="checkbox" checked data-toggle="toggle" onclick="toggle('+i+')"></th>' +
				'<th><button type="button" id="deletebutton-test-0-portfolio" onclick="passInIndex('+i+')" class="btn btn-danger" data-toggle="modal" data-target="#confirmStockDelete"><i class="fas fa-trash-alt"></i> Delete</button></th>' +
				'</tr>';
		}
		else{
		userTable.innerHTML +=
			'<tr><th>' + userPortfolio[i].ticker + '</th>' +
			'<th><input name="userStocksCheckboxes" id="checkbox-test-'+i+'" type="checkbox" checked data-toggle="toggle" onclick="toggle('+i+')"></th>' +
			'<th><button type="button" onclick="passInIndex('+i+')" class="btn btn-danger" data-toggle="modal" data-target="#confirmStockDelete"><i class="fas fa-trash-alt"></i> Delete</button></th>' +
			'</tr>';
		}
	}
}	

//this function loads the table of individual stocks that could be toggled.  it's the div to the right of the chart
function loadToggleDiv2() {
	var userTable = document.getElementById("dataTable2");

	userTable.innerHTML = 
		'<thead><tr><th>Ticker</th><th>On/Off</th><th>Remove?</th></tr></thead>';
		
	for(let i=0; i < viewStocksArray.length; i++) {
		userTable.innerHTML +=
			'<tr><th>' + viewStocksArray[i].ticker + '</th>' +
			'<th><input name="viewStocksCheckboxes" id="checkbox-view-test-'+i+'" type="checkbox" checked data-toggle="toggle" onclick="toggleViewStock('+i+')"></th>' +
			'<th><button type="button" onclick="passInIndex2('+i+')" class="btn btn-danger" data-toggle="modal" data-target="#confirmViewStockDelete"><i class="fas fa-trash-alt"></i> Delete</button></th>' +
			'</tr>';
	}
}

//this function is called whenever the checkbox is clicked. 
function toggle(index) {
	//if it's already in portfolio, we should remove it
	if(userPortfolio[index].inPortfolio == 1) {
		toggleOff(index);
	} else {
		//if it's not in the portfolio, we should add it.
		toggleOn(index);
	}
	drawChart(0);
}

//this function will be called whenever the user toggles off a stock.
function toggleOff(index) {
	userPortfolio[index].inPortfolio = 0; //0 means that the stock is not the portfolio 
	console.log(index);
	console.log(userPortfolio[index].inPortfolio);
}

function toggleOn(index) {
	userPortfolio[index].inPortfolio = 1;  //1 means that the stock is in the portfolio
	console.log(index); 
	console.log(userPortfolio[index].inPortfolio);
}

function toggleOnAll(source) {
	checkboxes = document.getElementsByName('userStocksCheckboxes');
	for(var i in checkboxes) {
		checkboxes[i].checked = source.checked
		toggleOn(i);
	}
}

function toggleOffAll(source) {
	checkboxes = document.getElementsByName('userStocksCheckboxes');
	for(var i in checkboxes) {
		checkboxes[i].checked = source.checked
		toggleOff(i);
	}
}

function toggleAll(source) {
	checkboxes = document.getElementsByName('userStocksCheckboxes');
	for(var i in checkboxes) 
		checkboxes[i].checked = source.checked
}


//this function draws a chart on the canvas in the .jsp file. it is called when the page loads and when a stock is toggled
function drawChart(onload) {
	chartDates = new Array();
	chartIndexData = new Array();
	chartPortfolioData = new Array();
	let color = "rgb(255,0,0)"; //red color
	let borderWidth = 4;
	for(let i=0; i<portfolioData.length; i++) {
		chartDates.push(portfolioData[i].date);
		chartIndexData.push(indexData[i].price);
		let sum = 0;
		//going through all of the stocks in the portfolio at a sepcific date and aggregating them all
		for(var j=0; j<portfolioData[i].stocks.length; j++) {
			//we only want to add the stocks who are currently in the portfolio
			//this is some tricky stuff
			/* basically, i am checking to see if the stcok should be added to the portfolio or not*/
			if(userPortfolio[portfolioData[i].stocks[j].indexInUserPortfolio].inPortfolio == "1") {
				sum = sum + (portfolioData[i].stocks[j].price * portfolioData[i].stocks[j].quantity);
			}
		}
		chartPortfolioData.push(sum);
	}
	
	var dragOptions = {
		animationDuration: 1000
	};
	
	/* 
	 * Basically, if the user says they bought/sold a stock on a  day when the market is closed, the value
	 * of the stock on that day is zero. I am taking care of this with these while loops. 
	 */
	while(chartIndexData[chartIndexData.length-1] == 0) {
		chartIndexData.pop();
		chartDates.pop();
		chartPortfolioData.pop();	
	}
	while(chartIndexData[0] == 0) {
		chartIndexData.shift();
		chartDates.shift();
		chartPortfolioData.shift();		
	}
	
	document.getElementById("chart").innerHTML = "";
	
	//from here on down, we are simply loading data into the chart and graphing it
	//console.log(chartPortfolioData);
	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.height = "500";
	canvas.width  = "900";
	var ctx = document.getElementById('chart').getContext('2d');
	let gradient = ctx.createLinearGradient(0, 0, 0, 450);
	
	//this if statement is true if the portfolio is up. rbg color is green
	if(chartPortfolioData[chartPortfolioData.length-1] > chartPortfolioData[1]){ 
		color = "rgb(51, 153, 51)";
		gradient.addColorStop(0, 'rgba(51, 153, 51, 1)');
		gradient.addColorStop(1, 'rgba(51, 153, 51, 0)');
	} else {
		//now for if the portfolio is down
		//we already have color=red, so i only need to do the gradient stuff here
		gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
		gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
	}
	
	//show outline of portfolio
	var lineChartData = {
			labels: chartDates,
			datasets: [{
				label: 'Value of Your Portfolio',
				borderColor: color,
				borderWidth: borderWidth,
				backgroundColor: gradient,
				fill: true,
				data: chartPortfolioData,
				pointRadius: 0,
				yAxisID: 'y-axis-1',
			}, 
			{
				label: 'Value of S&P 500 Index (SPY)',
				borderColor: '#3e95cd',
				borderWidth: borderWidth,
				backgroundColor: '#3e95cd',
				fill: false,
				data: chartIndexData,
				pointRadius: 0,
				onclick: console.log("S&P line exists"),
				yAxisID: 'y-axis-2',
			}]
	};
	
	//making loading wheel dissapear
	document.getElementById("chart-loading-wheel").style.visibility = "hidden";
	if(window.myLine != undefined) {
		window.myLine.destroy(); 
	};
	//generate the user portfolio chart
	window.myLine = Chart.Line(ctx, {
		data: lineChartData,
		options: {
			responsive: true,
			hoverMode: 'index',
			title: {
				display: true,
				text: 'Your Portfolio vs. the S&P 500'
			},
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Value ($)'
					},
					type: 'linear',
					display: true,
					position: 'right',
					id: 'y-axis-1',
					beginAtZero: true,
				}, 
				{
					type: 'linear',
					display: false,
					position: 'left',
					id: 'y-axis-2',
					beginAtZero: true,
				}],
				xAxes: [{
					id:'x-axis-1',
//					ticks: {
//	                    beginAtZero:true,
//	                    stepSize: 1,
//	                    callback: function(tickValue, index, ticks) {
//	                     
//	                      if(!(index % parseInt(ticks.length / 5))) {
//	                        return tickValue
//	                      }
//	  
//	                    }
//	                },
					scaleLabel: {
						display: true,
						labelString: 'Date'
					},
					gridLines: {
						color: 'rgba(196, 189, 188,1)',
						drawOnChartArea: false
					}
				}]
			},
			plugins: {
				zoom: {
					// Container for pan options
					pan: {
						// Boolean to enable panning
						enabled: true,

						// Panning directions. Remove the appropriate direction to disable
						// Eg. 'y' would only allow panning in the y direction
						// A function that is called as the user is panning and returns the
						// available directions can also be used:
						//   mode: function({ chart }) {
						//     return 'xy';
						//   },
						mode: 'xy',

						rangeMin: {
							// Format of min pan range depends on scale type
							x: null,
							y: null
						},
						rangeMax: {
							// Format of max pan range depends on scale type
							x: null,
							y: null
						},

						// On category scale, factor of pan velocity
						speed: 20,

						// Minimal pan distance required before actually applying pan
						threshold: 10,

						// Function called while the user is panning
						onPan: function({chart}) { console.log(`I'm panning!!!`); },
						// Function called once panning is completed
						onPanComplete: function({chart}) { console.log(`I was panned!!!`); }
					},

					// Container for zoom options
					zoom: {
						// Boolean to enable zooming
						enabled: true,

						// Enable drag-to-zoom behavior
						drag: true,

						// Drag-to-zoom effect can be customized
						// drag: {
						// 	 borderColor: 'rgba(225,225,225,0.3)'
						// 	 borderWidth: 5,
						// 	 backgroundColor: 'rgb(225,225,225)',
						// 	 animationDuration: 0
						// },

						// Zooming directions. Remove the appropriate direction to disable
						// Eg. 'y' would only allow zooming in the y direction
						// A function that is called as the user is zooming and returns the
						// available directions can also be used:
						//   mode: function({ chart }) {
						//     return 'xy';
						//   },
						mode: 'xy',

						rangeMin: {
							// Format of min zoom range depends on scale type
							x: null,
							y: null
						},
						rangeMax: {
							// Format of max zoom range depends on scale type
							x: null,
							y: null
						},

						// Speed of zoom via mouse wheel
						// (percentage of zoom on a wheel event)
						speed: 0.1,

						// Minimal zoom distance required before actually applying zoom
						threshold: 2,

						// On category scale, minimal zoom level before actually applying zoom
						sensitivity: 3,

						// Function called while the user is zooming
						onZoom: function({chart}) { console.log(`I'm zooming!!!`); 
						document.getElementById("zoomTestHidden").innerHTML = "zoom in";},
						// Function called once zooming is completed
						onZoomComplete: function({chart}) { console.log(`I was zoomed!!!`); }
					}
				}
			},
			toolTips: {
				mode: 'nearest'
			}
		}
	});
	
	//onload is set to 1 if we are drawing the chart on the page load up, as opposed to when a stock is toggled.
	//on pageload, we want to load the tickers as well. thats what the function does
	if(onload == 1) {
		loadToggleDiv();
		
//		if(viewStocksArray.length > 0) {
//			addAllViewStocks();
//			loadToggleDiv2();
//		}
	}
	
	loadPerformaceData();
	
	// randomly selects a color for the viewed stock
	 window.chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(231,233,237)'
	};
	 
	var colorNames = Object.keys(window.chartColors);
	
	// test data population
	window.randomScalingFactor = function() {
		return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
	}
	
	// when different intervals are selected, make sure we add all our viewed stocks
	window.addAllViewStocks = function() {
		for (var i = 0; i < viewStocksData.length; i++) {
			var stockName = viewStocksData[i].ticker;
			var stockDataAPI = viewStocksData[i].prices;
			addViewStock(stockName, stockDataAPI);
		}
	};
	
	// adds a new stock to view
	window.addViewStock = function(stockName, stockDataAPI) {
		var colorName = colorNames[lineChartData.datasets.length % colorNames.length];
		var newColor = window.chartColors[colorName];
		var newDataset = {
			label: stockName,
			borderColor: newColor,
			backgroundColor: newColor,
			data: [],
			fill: false
		};

		for (var i = 0; i < stockDataAPI.length; i++) {
			newDataset.data.push(stockDataAPI[i].price);
			// newDataset.data.push(randomScalingFactor());
		}

		lineChartData.datasets.push(newDataset);
		window.myLine.update();
	};
	
	// removes a viewed stock
	window.deleteViewStock = function() {
		console.log(viewIndex);
		
		var removalIndex = viewIndex+2;
		
		console.log(removalIndex);
		
		// update graph
		lineChartData.datasets.splice(removalIndex, 1);
		
		// update view stock arrays
		viewStocksArray.splice(viewIndex, 1);
		viewStocksData.splice(viewIndex, 1);
		
		// success message
		document.getElementById("message-deleteViewStock").innerHTML = "Delete Successful";
		document.getElementById("message-deleteViewStock").style = "color:green";
		
		// for tests
		document.getElementById("deleteViewStockTestHidden").innerHTML = deletedViewStocksCounter;
	    
		// reload graph
	    drawChart(1);
	    
	    // reload view stock table
	    loadToggleDiv2();
	};
	
	// This function resets the zoom on the portfolio by clicking on the "Reset" button
	window.resetZoom = function() {
		// reset view back to the selected interval
		loadPortfolio(interval);
	};
	
	window.zoomIn = function() {
		ticks = window.myLine.options.scales.yAxes[0].ticks;
		
		/* if x-axis is categorical, use the data.labels to determine current axis range
	    labels = window.myLine.chart.data.labels; 
	    startTick = labels.indexOf(ticks.min);
	    endTick = labels.indexOf(ticks.max);
	    */

	    // below assumes ticks.min and ticks.max are numeric
	    var diff = ticks.max - ticks.min;
	    var factor = 0.05;

	    var newMin = ticks.min + factor * diff;
	    var newMax = ticks.max - factor * diff;

	    ticks.min = 0.5;
	    ticks.max = 0.5; 
	    
	    window.myLine.update();
	    
	    document.getElementById("zoomTestHidden").innerHTML = "zoom in graph";
	    
	    console.log(`zoom in`);
	};
	
	window.zoomOut = function() {
		ticks = window.myLine.options.scales.yAxes[0].ticks;
		
		/* if x-axis is categorical, use the data.labels to determine current axis range, e.g.:
	    labels = window.myLine.chart.data.labels; 
	    startTick = labels.indexOf(ticks.min);
	    endTick = labels.indexOf(ticks.max);
	    */

	    // below assumes ticks.min and ticks.max are numeric
	    var diff = ticks.max - ticks.min;
	    var factor = 1.5;

	    var newMin = ticks.min + factor * diff;
	    var newMax = ticks.max - factor * diff;

	    ticks.min = ticks.min+0.5;;
	    ticks.max = ticks.max+0.5; 
	    
	    window.myLine.update();
	    document.getElementById("zoomTestHidden").innerHTML = "zoom out graph";
	    console.log(`zoom out`);
	};
	
	// This function enables/disables S&P Line of the graph
	document.getElementById("spy-line-toggle").onclick = function() {
		var spyLine = window.myLine.data.datasets[1];
		spyLine.hidden = !spyLine.hidden;

		// We hid the line - re-render the chart
		window.myLine.update();
		
		// change button text
		document.getElementById('spy-line-toggle').innerText = spyLine.hidden ? 'Enable S&P Line' : 'Disable S&P Line';
	};
	
	// This function enables/disables an individual user stock of the graph
	window.toggleUserStock = function(i) {
		var userStockLine = window.myLine.data.datasets[0];
		userStockLine.hidden = false;

		window.myLine.update();
	}
	
	// This function disables all user portfolio stocks of the graph
	$("#portfolio-stocks-disable").click(function() {
		var userStockLine = window.myLine.data.datasets[0];
		userStockLine.hidden = true;
		
		var userStocksCheckboxesArray =  document.getElementsByName("userStocksCheckboxes");
		
		// disable all checkboxes
		for(let i=0; i < userStocksCheckboxesArray.length; i++) {
			userStocksCheckboxesArray[i].checked = false;
		}
		
		// set hidden div test to $0
		document.getElementById("deselectAllStocksTestHidden").innerText = "0";
		
		window.myLine.update();
	});
	
	
	// This function enables all user portfolio stocks of the graph
	$("#portfolio-stocks-enable").click(function() {
		var userStockLine = window.myLine.data.datasets[0];
		userStockLine.hidden = false;
		
		var userStocksCheckboxesArray =  document.getElementsByName("userStocksCheckboxes");
		
		// enable all checkboxes
		for(let i=0; i < userStocksCheckboxesArray.length; i++) {
			userStocksCheckboxesArray[i].checked = true;
		}
		
		window.myLine.update();
	});
	
	// This function enables/disables an individually viewed stock of the graph
	window.toggleViewStock = function(i) {
		var individualStocksLine = window.myLine.data.datasets[2+i];
		individualStocksLine.hidden = !individualStocksLine.hidden;
		window.myLine.update();
	}
	
	// This function disables all individual stocks of the graph
	$("#individual-stocks-disable").click(function() {
		var individualStocksLine;
		
		for(let i = 0; i < viewStocksArray.length; i++) {
			// datasets[0] is our portfolio value, datasets[1] is our S&P line
			individualStocksLine = window.myLine.data.datasets[2+i];
			individualStocksLine.hidden = true;
		}
		
		var viewStocksCheckboxesArray =  document.getElementsByName("viewStocksCheckboxes");
		
		// disable all checkboxes
		for(let i=0; i < viewStocksCheckboxesArray.length; i++) {
			viewStocksCheckboxesArray[i].checked = false;
		}

		// We hid the lines - re-render the chart
		window.myLine.update();
	});
	
	// This function enables all individual stocks of the graph
	$("#individual-stocks-enable").click(function() {
		var individualStocksLine;
		
		for(let i = 0; i < viewStocksArray.length; i++) {
			// datasets[0] is our portfolio value, datasets[1] is our S&P line
			individualStocksLine = window.myLine.data.datasets[2+i];
			individualStocksLine.hidden = false;
		}
		
		var viewStocksCheckboxesArray =  document.getElementsByName("viewStocksCheckboxes");
		
		// enable all checkboxes
		for(let i=0; i < viewStocksCheckboxesArray.length; i++) {
			viewStocksCheckboxesArray[i].checked = true;
		}
		
		window.myLine.update();
	});
	
//	$("#portfolio-stocks-toggle").click(function() {
//		var portfolioLine = window.myLine.data.datasets[0];
//		portfolioLine.hidden = !portfolioLine.hidden;
//		window.myLine.update();
//		document.getElementById('portfolio-stocks-toggle').innerText = portfolioLine.hidden ? 'Select All' : 'Deselect All';
//	}
	
	// This function enables/disables "drag" mode of the graph
	window.toggleDragMode = function() {
		const zoomOptions = window.myLine.options.plugins.zoom.zoom;
		zoomOptions.drag = zoomOptions.drag ? false : dragOptions;

		window.myLine.update();
		document.getElementById('drag-switch').innerText = zoomOptions.drag ? 'Disable drag mode' : 'Enable drag mode';
	};
	
	console.log("earliest date LINE 1260: ");
	console.log(getEarliestDate(resultPortfolio2));
	console.log("latest date: ");
	console.log(getLatestDate(resultPortfolio2));
	
	
//	if(interval == "1d") {
//		if(viewStocksData.length > 0) {
//			// our map
//			var newDatesAndPrices = new Array();
//			
//			for(var i = 0; i < viewStocksData.length; i++) {
//				// get first date
//				console.log(viewStocksData[0].prices[0]);
//				
//				// these are strings
//				var earlyPortfolioDate = getEarliestDate(resultPortfolio2);
//				var earlyStockDate = viewStocksData[i].prices[i].date;
//
//				// convert from strings -> int
//				var dateOne = Date.parse(earlyPortfolioDate);
//				var dateTwo = Date.parse(earlyStockDate);
//				
//				// hours*minutes*seconds*milliseconds
//				var oneDay = 24 * 60 * 60 * 1000;
//
//				// calc difference in days
//				var diffDays = Math.round(Math.abs((dateOne - dateTwo) / oneDay));
//				
//				//console.log("LINE 1288: X AXIS TICKS");
//				//console.log(window.myLine.scales['x-axis-1'].ticksAsNumbers);
//				//console.log(window.myLine.options.scales.xAxes[0].ticks);
//
//				console.log("diffDays: " + diffDays);
//				
//				var calc = diffDays;
//				
//				
////				if(diffDays >= 360) {
////					
////				}
////				
////				else if(diffDays >= 180) {
////					
////				}
//				
//				if(diffDays <= 30) {
//					calc = 2;
//				}
//				
//				
//				else if(diffDays <= 60) {
//					calc = 6;
//				}
//				
//				// set 0 for prices out of range
//				for(let k = 0; k < calc; k++) {
//					// add to our map
//			        var elem1 = 0;
//			        var elem2 = 0;
//			        
//			        var newArrayElem = {date: elem1, price: elem2};
//			        newDatesAndPrices.push(newArrayElem);	
//				}
//				
//				for(let j = 0; j < viewStocksData[i].prices.length; j++) {
//					var elem1 = viewStocksData[i].prices[j].date;
//					var elem2 = viewStocksData[i].prices[j].price;
//					var newArrayElem = {date: elem1, price: elem2}
//					newDatesAndPrices.push(newArrayElem);
//				}
//
//				console.log(newDatesAndPrices);
//				
//				addViewStock(viewStocksData[i].ticker, newDatesAndPrices);
//			}	
//		}
//	}
	
	
	
//	
//	if(interval == "1wk") {
//		
//	}
	
	if(viewStocksData.length > 0) {
		for(var i = 0; i < viewStocksData.length; i++) {
			var stockName = viewStocksData[i].ticker;
			var stockAPI = viewStocksData[i].prices;
			addViewStock(stockName, stockAPI);
		}
	}
}

// formats portfolio value with commas
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

//this function calculates and loads the value for the "current value of portfolio" and "cagr" divs at the top of the page
function loadPerformaceData() {
		
	//different divs we are changing in the .jsp file
	const ELEMENT1 = document.getElementById("value-of-portfolio");
	const ELEMENT2 = document.getElementById("cagr-of-portfolio");
	const ELEMENT3 = document.getElementById("cagr-of-index");
	const ELEMENT4 = document.getElementById("number-of-stocks");
	
	ELEMENT4.innerHTML = userPortfolio.length;
	
	// for testing: check if > 0
	document.getElementById("addStockTestHidden").innerHTML = userPortfolio.length;
	
	// nothing in portfolio
	if(userPortfolio.length == 0) {
		ELEMENT1.innerHTML = '$0.00';
		ELEMENT2.innerHTML = 'TBD';
		ELEMENT3.innerHTML = 'TBD';
	}
	
	// just 1 single stock; load portfolio value
	else if(userPortfolio.length == 1) {
		var sum = indexData[0].price * userPortfolio[0].quantity;
		var value = sum.toFixed(2);
		var formattedVal = numberWithCommas(value);
		ELEMENT1.innerHTML = '$'+formattedVal;
		ELEMENT2.innerHTML = 'TBD';
		ELEMENT3.innerHTML = 'TBD';
	}
	
	// more than a single stock in portfolio
	else {
		var value = chartPortfolioData[chartPortfolioData.length-1].toFixed(2);
		var formattedVal = numberWithCommas(value);
		
		ELEMENT1.innerHTML = '$'+formattedVal;
		// ELEMENT1.innerHTML = '$' + chartPortfolioData[chartPortfolioData.length-1].toFixed(2);
		
		const unixConstant = 31536000; //this number is equivalent to 1 year. i need it for CAGR calculations
		const numYears = (toTimestamp(chartDates[chartDates.length-1]) - toTimestamp(chartDates[0])) / unixConstant; //this variable stores how many years have passed
		
		//this is the cagr formula
		ELEMENT2.innerHTML = ((Math.pow((chartPortfolioData[chartPortfolioData.length-1] / chartPortfolioData[0]), 1/numYears) - 1) * 100).toFixed(2)+'%';
		ELEMENT3.innerHTML = ((Math.pow((chartIndexData[chartIndexData.length-1] / chartIndexData[0]), 1/numYears) - 1) * 100).toFixed(2) + '%';
		
		const ARROW1 = document.getElementById("cagr-of-portfolio-indicator");
		const ARROW2 = document.getElementById("cagr-of-index-indicator");
		
		// check if CAGR portfolio negative
		var cagrPortfolio = ((Math.pow((chartPortfolioData[chartPortfolioData.length-1] / chartPortfolioData[0]), 1/numYears) - 1) * 100);

		// if positive, use green arrow
		if(cagrPortfolio > 0) {
			ARROW1.innerHTML = '<span id="arrowPortfolioTest" style="color:green"><i class="fas fa-arrow-alt-circle-up fa-2x"></i></span>';
		}
		
		// if negative, use red arrow
		else {
			ARROW1.innerHTML = '<span id="arrowPortfolioTest" style="color:red"><i class="fas fa-arrow-alt-circle-down fa-2x"></i></span>';
		}
		
		// check if CAGR index negative
		var cagrIndex = ((Math.pow((chartIndexData[chartIndexData.length-1] / chartIndexData[0]), 1/numYears) - 1) * 100);
		
		// if positive, use green arrow
		if(cagrIndex > 0) {
			ARROW2.innerHTML = '<span id="arrowCAGRTest" style="color:green"><i class="fas fa-arrow-alt-circle-up fa-2x"></i></span>';
		}
		
		// if negative, use red arrow
		else {
			ARROW2.innerHTML = '<span id="arrowCAGRTest" style="color:red"><i class="fas fa-arrow-alt-circle-down fa-2x"></i></span>';
		}
	}
}

function loadChartWithInterval() {
	console.log("test");
}
/* These functions are commented out for now, as they are not needed to load the portfolio.
 * 
 * However, these functions could be useful for the graph webpage*/
/*
function doCORSRequest(url) {
	var outputField = document.getElementById('outputDiv');
	let x = new XMLHttpRequest();
	x.open('GET', cors_api_url + url);
	x.onload = x.onerror = function() {
		var response = 'GET ' + url + '\n' + x.status + ' ' + x.statusText + '\n\n' + (x.responseText || '');
		//outputField.value = parsePrices(response);
		var responseData = parsePrices(response);
		for(var i=0; i<responseData.length; i++) {
			outputField.innerHTML += responseData[i];
			outputField.innerHTML += ",   ";
			if(i%2 == 1) {
				outputField.innerHTML += "<br>";
			}
		}
		//loadChart(x.responseText);
	};
	x.send();
}
*/


/*
function get(url) {
	if(url != "-1") {
		//doCORSRequest(url);
		insertPortfolio(1);
	} else {
		var ticker = document.getElementById("ticker").value;
		var duration = document.getElementById("duration").value;
		var startDate = document.getElementById("start-date").value;
		var endDate = document.getElementById("end-date").value;
		if(endDate < startDate) {
			alert("Startdate cannot be after begin date");
			return;
		}
		var fullUrl = template1+ticker+template2+toTimestamp(startDate)+template3+toTimestamp(endDate)+template4+duration+template5;
		doCORSRequest(fullUrl);
	}
}
*/