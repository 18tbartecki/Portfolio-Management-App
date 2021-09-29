/* The cors_api_url variable is to bypass some CORS stuff. It is a heroku app. Kinda weird. */
const cors_api_url = "https://fierce-inlet-95803.herokuapp.com/";

/* This is a samlpe url that could go in the API */
const test_url = "https://query1.finance.yahoo.com/v7/finance/download/FB?period1=1569036975&period2=1600659375&interval=1wk&events=history";

var indexData = new Array(); //stores the dates and prices of the index
var portfolioData = new Array(); //stores the dates and prices of the value of the users portfolio
var userPortfolio = new Array(); //have this for toggling purposes. it stores the user's portfolio, but does NOT have price data like the 2 variables above

//making these global because I need two functions to access them
var chartDates = new Array();
var chartIndexData = new Array();
var chartPortfolioData = new Array();
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
 
	retrieveStocks(interval); //getting the stocks from the user's portfolio. calls sqlite database. interval is one month. then it loads it up
	
	//there are four json files that you can use as tests
	//insertPortfolio("PortfolioJSON1.json");
	//insertPortfolio("PortfolioJSON2.json");
	//insertPortfolio("PortfolioJSON3.json");
	//insertPortfolio("PortfolioJSON4.json");
	//insertPortfolio("PortfolioJSON5.json", interval); //this can be used to run the hardcoded json portfolio files
}

//function calls daabas and gets user's portfolio
function retrieveStocks(interval) {
	//console.log("In function");
	$.ajax({
		url: "retrieveStocksServlet",
		data: {
			formType:"retrievStock"
		},
		success: function(result) {
			userPortfolio = result.portfolio;
			//if statements see if the datepurchased and date sold are logical
			for(let i=0; i<userPortfolio.length; i++) {
				if(userPortfolio[i].datePurchased > userPortfolio[i].dateSold) {
					userPortfolio[i].inPortfolio = 0;
					//console.log(userPortfolio[i]);
				} else {
					userPortfolio[i].inPortfolio = 1;
				}
			}
			getStockDataFromAPI(userPortfolio, new XMLHttpRequest(), 0, userPortfolio.length+2, interval); //+2 because I have to make two calls before
		}
	})
}

/* This function takes a JSON file name as an argument, finds that file, and parses it. it is only
 * used for a hardcoded json files with a portfolio. it is not used when the databased is used*/
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

//there are discrepencies between daily and weekly data from yahoo finance. 
//the second and third cases handle this discprency. 
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
			}
		}
		
		//only want to send request if it the stock is in the portfolio
		if(currentStock.inPortfolio == 1) {
			request.send();
		} else {
			getStockDataFromAPI(portfolio, request, i + 1, length);
		}
	}	
}
/* This function simply gets the earliest date from the portfolio */
function getEarliestDate(portfolio) {
	console.log(portfolio);
	
	console.log(portfolio[0])
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

//this function loads the table of stocks that could be toggled.  it's the div to the right of the chart
function loadToggleDiv() {
	//templates for the markup
	const ELEMENT = document.getElementById("dataTable");
	const TEMPLATE1 = "<tbody>";
	const TEMPLATE2 = "<tr>";
	const TEMPLATE3 = "<td>";
	const TEMPLATE4 = "</td>";
	const TEMPLATE5 = "<td><input type=\"checkbox\" checked data-toggle=\"toggle\" onclick=\"";
	const TEMPLATE6 = "toggle(";
	const TEMPLATE7 = ")\"></td>";
	const TEMPLATE8 = "</tr>";
	const TEMPLATE9 = "</tbody>";
	
	document.getElementById("stock-loading-wheel").style.visibility = "hidden";
	ELEMENT.innerHTML = ''; //getting rid of any present HTML
	ELEMENT.innerHTML += "<thead><tr><th>Ticker</th><th>On/Off</th></tr></thead>";
	//now just going through the user's portfolio and adding it to the markup
	ELEMENT.innerHTML += TEMPLATE1;
	for(let i=0; i<userPortfolio.length; i++) {
		let markup = TEMPLATE2 + TEMPLATE3 + userPortfolio[i].ticker+TEMPLATE4 + TEMPLATE5 + TEMPLATE6 + i+TEMPLATE7 + TEMPLATE8;
		ELEMENT.innerHTML += markup;
	}
	ELEMENT.innerHTML += TEMPLATE9;
}

//this function loads the table of stocks that could be deleted from the portfolio using the trash can button.  
//it's the div to underneath the chart. this function is very similar to the function above
function loadDeleteDiv() {
	//templates for the markup
	const ELEMENT = document.getElementById("deleteTable");
	const TEMPLATE1 = "<tbody>";
	const TEMPLATE2 = "<tr>";
	const TEMPLATE3 = "<td>";
	const TEMPLATE4 = "</td>";
	const TEMPLATE5 = "</tr>";
	const TEMPLATE11 = "</tbody>";
	
	document.getElementById("delete-loading-wheel").style.visibility = "hidden";
	document.getElementById("deleteTable").style.visibility = "visible";
	
	ELEMENT.innerHTML = ''; //getting rid of any present HTML
	//readding the table's header
	ELEMENT.innerHTML += "<thead><tr><th>Ticker</th><th>Date Bought</th><th>Date Sold</th><th>Remove?</th></tr></thead>";
	//now just going through the user's portfolio and adding it to the markup
	ELEMENT.innerHTML += TEMPLATE1;
	for(let i=0; i<userPortfolio.length; i++) {
		let markup = TEMPLATE2 + TEMPLATE3;
		markup += userPortfolio[i].ticker+ TEMPLATE4 + TEMPLATE3;
		markup+= userPortfolio[i].datePurchased + TEMPLATE4 + TEMPLATE3;
		markup+= userPortfolio[i].dateSold + TEMPLATE4 + TEMPLATE3;
		markup+= "<i class=\"fas fa-trash-alt\" onclick=\"removeStockFromDatabase("+i+")\"><a href=#>" + TEMPLATE4;
		markup+= TEMPLATE5;
		ELEMENT.innerHTML += markup;
	}
	ELEMENT.innderHTML += TEMPLATE11;
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
}

function toggleOn(index) {
	userPortfolio[index].inPortfolio = 1;  //1 means that the stock is in the portfolio
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
	console.log(chartPortfolioData);
	
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
	if(chartPortfolioData[chartPortfolioData.length-1] > chartPortfolioData[0]){ 
		color = "rgb(51, 153, 51)";
		gradient.addColorStop(0, 'rgba(51, 153, 51, 1)');
		gradient.addColorStop(1, 'rgba(51, 153, 51, 0)');
	} else {
		//now for if the portfolio is down
		//we already have color=red, so i only need to do the gradient stuff here
		gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
		gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
	}

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
			}, {
				label: 'Value of S&P 500 Index (SPY)',
				borderColor: '#3e95cd',
				borderWidth: borderWidth,
				backgroundColor: '#3e95cd',
				fill: false,
				data: chartIndexData,
				pointRadius: 0,
				yAxisID: 'y-axis-2',
			}]
	};
	
	//making loading wheel dissapear
	document.getElementById("chart-loading-wheel").style.visibility = "hidden";
	if(window.myLine != undefined) {
		window.myLine.destroy(); 
	};
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
					type: 'linear',
					display: true,
					position: 'right',
					id: 'y-axis-1',
					beginAtZero: true,
				}, {
					type: 'linear',
					display: false,
					position: 'left',
					id: 'y-axis-2',
					beginAtZero: true,
				}],
				xAxes: [{
					gridLines: {
						color: 'rgba(196, 189, 188,1)',
						drawOnChartArea: false
					}
				}]
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
	}
	
	loadDeleteDiv();
	
	loadPerformaceData();
}
// Success message after adding a stock
function showSubmissionMessage(){
    document.getElementById("message").innerHTML = "Added Successfully";
    document.getElementById("message").style = "color:green";
}

//this function calculates and loads the value for the "current value of portfolio" and "cagr" divs at the top of the page
function loadPerformaceData() {
		
	//different divs we are changing in the .jsp file
	const ELEMENT1 = document.getElementById("value-of-portfolio");
	const ELEMENT2 = document.getElementById("cagr-of-portfolio");
	const ELEMENT3 = document.getElementById("cagr-of-index");
	
	ELEMENT1.innerHTML = '$'+chartPortfolioData[chartPortfolioData.length-1].toFixed(2);
	const unixConstant = 31536000; //this number is equivalent to 1 year. i need it for CAGR calculations
	const numYears = (toTimestamp(chartDates[chartDates.length-1]) - toTimestamp(chartDates[0])) / unixConstant; //this variable stores how many years have passed
	
	
	//this is the cagr formula
	ELEMENT2.innerHTML = ((Math.pow((chartPortfolioData[chartPortfolioData.length-1] / chartPortfolioData[0]), 1/numYears) - 1) * 100).toFixed(2)+'%';
	ELEMENT3.innerHTML = ((Math.pow((chartIndexData[chartIndexData.length-1] / chartIndexData[0]), 1/numYears) - 1) * 100).toFixed(2) + '%';
	
	
}

function checkAddSubmission() {
	let ticker = document.getElementById("add-stock-ticker").value;
	let quantity =document.getElementById("add-stock-quantity").value;
	let ds = document.getElementById("add-stock-ds").value;
	let dp = document.getElementById("add-stock-dp").value;
	
	console.log(quantity, "   ", ds, "   ", dp);
	//return;
	//note: the form already makes sure the user enters stuff
	
	//checking the user entered a positive quantity
	if(quantity < 1) {
		document.getElementById("add-stock-message").innerHTML = "Please enter a positive quantity. No shorting allowed dear.";
        document.getElementById("add-stock-message").style = "color:red";
		return;
	}
		
	var today = new Date();
	today = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');


	//checking that the date sold is after the date purchased
	if(ds < dp) {
		document.getElementById("add-stock-message").innerHTML = "Date sold cannot be before date purchased dear.";
        document.getElementById("add-stock-message").style = "color:red";
		return;
	}
	
	//checking that the date purchase is less than a year before today
	
	let oneYear = 31536000;
	if(toTimestamp(dp) + oneYear < toTimestamp(today)) {
		document.getElementById("add-stock-message").innerHTML = "You must purchase the stock within the last year.";
        document.getElementById("add-stock-message").style = "color:red";
		return;
	}
	
	//checking that the date sold is before tomorrow
	
	if(new Date(ds) > new Date(today)) {
		console.log("cannot enter a future date");
		return;
	}
	
	request = new XMLHttpRequest();
	indexURL = getURLFromStockInfo(ticker,dp, ds, "1mo");
	request.open("GET", cors_api_url+indexURL);
	request.onreadystatechange = function() {
		if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
			$.ajax({
				url: "addStockServlet",
				data: {
					formType:"add",
					ticker: ticker,
				    quantity: quantity,
				    dateSold: ds,
		            datePurchased: dp
				},
				success: function(result) {
					if (result == "Added Successfully"){
						document.getElementById("add-stock-message").innerHTML = "Added Successfully";
				        document.getElementById("add-stock-message").style = "color:green";
				        loadPortfolio("1mo");
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
			document.getElementById("add-stock-message").innerHTML = "Please enter a valid stock dear.";
	        document.getElementById("add-stock-message").style = "color:red";
			return false;
		}
	}
	request.send();
	
	
}

function removeStockFromDatabase(index) {
	var stock = userPortfolio[index];
	//console.log(stock);
	$.ajax({
		url: "RemoveStockServlet",
		data: {
			formType:"add",
			ticker: stock.ticker,
		    quantity: stock.quantity,
		    datePurchased: stock.datePurchased,
            dateSold: stock.dateSold
		},
		success: function() {loadPortfolio("1mo");}
	})
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