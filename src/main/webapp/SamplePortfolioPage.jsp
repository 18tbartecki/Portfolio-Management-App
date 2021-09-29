<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page import="csci310.*" %>
<!DOCTYPE html>
<html>
<head>
		<meta charset="UTF-8">
		<title>My Portfolio</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta http-equiv="X-UA-Compatible" content="ie=edge">
		
		<!-- jquery cdn -->
		<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min.js"></script>
		<!-- fontawesome api for the icons -->
		<script src="https://kit.fontawesome.com/7a4deee9a0.js" crossorigin="anonymous"></script>
		<!-- simple css file for buttons and loading wheels -->
		<link rel="stylesheet" href="SamplePortfolioPage.css">
		<!-- bootstrap stuff -->
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>  
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
		<!-- .js file that has all the api stuff -->
		<script src="logout.js"></script>
		<script src="StockChartTestJS.js"></script>
		<!-- <script src="StockChartTestJS1.js"></script> -->
		<!-- .js file for chart.js -->
		<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3"></script>
		<script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
		<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@0.7.5/dist/chartjs-plugin-zoom.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
		<!-- .js file for papa.parse, an api that that converts a csv file to a json -->
		<script src="https://unpkg.com/papaparse@5.3.0/papaparse.min.js"></script>
		<!-- image for the "icon" that apears in the browser tab -->
		<link rel="icon" href="USCicon.png">
		<script>
			var timer;
			function startTimer() {
				timer = window.setTimeout(autoReload, 120000);
			}
			function autoReload()
			{
				window.location.href = 'https://localhost:8443/logout.jsp';
			}
			function setTimer() {
				document.addEventListener("mousemove", resetTimer);
				document.addEventListener("mousedown", resetTimer);
			 	document.addEventListener("keypress", resetTimer);
				document.addEventListener("touchmove", resetTimer);
				document.addEventListener("onscroll", resetTimer);
				startTimer();
			}
			function resetTimer() {
				window.clearTimeout(timer);
				startTimer();
			}
		</script>
	</head>

	<body onload="loadPortfolio('1mo'); setTimer();">
		<%
			String loggedIn=(String)session.getAttribute("loggedIn");
			if(loggedIn == null) {
				loggedIn = "false";
			}
				
			if(!loggedIn.equals("true")) {
				String redirectURL = "https://localhost:8443/login.jsp";
			    response.sendRedirect(redirectURL);
			}
		%>
		
		<!-- Header -->
		<nav style="background: #787878;"class="navbar navbar-expand-sm navbar-light justify-content-between topbar mb-4 static-top shadow">
			<a class="navbar-brand" href="SamplePortfolioPage.jsp">
				<h5 style="color: white;">USC CS310 Stock Portfolio Management</h5>
			</a>
			<form class="my-2 my-lg-0">
		      <button onclick="logoutUser(event); return false;" id="logout" class="btn btn-danger btn-lg my-2 my-sm-0">Logout</button>
		    </form>
		</nav>
		
		<div hidden>
			<p id="zoomTestHidden"></p>
		</div>
		
		<div hidden>
			<p id="addStockTestHidden"></p>
		</div>
		
		<div hidden>
			<p id="deleteStockTestHidden"></p>
		</div>
		
		<div hidden>
			<p id="deleteViewStockTestHidden"></p>
		</div>

		<div hidden>
			<p id="deselectAllStocksTestHidden"></p>
		</div>

		<div hidden>
			<p id="color1">rgba(255, 205, 87, 1)</p>
		</div>

		<div hidden>
			<p id="color2">rgba(76, 192, 192, 1)</p>
		</div>

		<div hidden>
			<p id="color3">rgba(53, 162, 235, 1)</p>
		</div>
		
		<div hidden>
			<p id="startDateRangeTestHidden">0</p>
		</div>
		<div hidden>
			<p id="endDateRangeTestHidden">0</p>
		</div>

		<!-- Begin Page Content -->
		<div class="container-fluid">
			<!-- Page Heading -->
			<div class="d-sm-flex align-items-center justify-content-between mb-4">
				<h1 id="your-portfolio-header" class="h3 mb-0 text-gray-800">Your Portfolio</h1>
				<br></br> 
   				<h1>
					<button type="button" id = "addButtonTest" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#seeStock">
					Add A  Stock
					</button>
					<button type="button" id = "viewButtonTest" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#viewStock">
					View A Stock
					</button>
					<button type="button" id = "rangeSelectorButtonTest" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#rangeSelectorGraph">
					 Range Selector
					</button>
					
				</h1>
			</div>
			<!-- Content Row -->
			<div class="row">
				<!-- Current Value of Portfolio Card -->
				<div class="col-xl-3 col-md-6 mb-4">
					<div class="card border-left-primary shadow h-100 py-2" id = "valueOfPortfoliMobileTest">
						<div class="card-body">
							<div class="row no-gutters align-items-center">
								<div class="col mr-2">
									<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Current value of portfolio</div>
									<div id="value-of-portfolio" class="h5 mb-0 font-weight-bold text-gray-800"></div>
								</div>
								<div class="col-auto">
									<!-- <i class="fas fa-money-bill-wave fa-2x text-gray-300"></i> -->
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- CAGR for portfolio -->
				<div class="col-xl-3 col-md-6 mb-4">
					<div class="card border-left-success shadow h-100 py-2" id = "ratePorGrowthMobile">
						<div class="card-body">
							<div class="row no-gutters align-items-center">
								<div class="col mr-2">
									<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Rate of portfolio growth</div>
									<div id="cagr-of-portfolio" class="h5 mb-0 font-weight-bold text-gray-800"></div>
								</div>
								<!-- Green up arrow if positive, red down arrow if negative -->
								<div id="cagr-of-portfolio-indicator" class="col-auto">
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- CAGR for index -->
				<div class="col-xl-3 col-md-6 mb-4">
					<div class="card border-left-success shadow h-100 py-2" id ="rateIndexGrowthMobile">
						<div class="card-body">
							<div class="row no-gutters align-items-center">
								<div class="col mr-2">
									<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Rate of index growth</div>
									<div id="cagr-of-index" class="h5 mb-0 font-weight-bold text-gray-800"></div>	
								</div>
								<!-- Green up arrow if positive, red down arrow if negative -->
								<div id="cagr-of-index-indicator" class="col-auto">
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- # of stocks for portfolio -->
				<div class="col-xl-3 col-md-6 mb-4">
					<div class="card border-left-warning shadow h-100 py-2" id = "numberOfStocksCounterMobile">
						<div class="card-body">
							<div class="row no-gutters align-items-center">
								<div class="col mr-2">
									<div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Number of stocks in portfolio</div>
									<div id="number-of-stocks" class="h5 mb-0 font-weight-bold text-gray-800">0</div>
								</div>
								<div class="col-auto">
									<!-- <i class="fa fa-line-chart fa-2x text-gray-300"></i> -->
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- Content Row -->
			<!--  2 column portfolio view -->
			<div class="row">
				<!-- Portfolio Performance Card -->
				<div class="col-xl-8 col-lg-7">
					<div class="card shadow mb-4" id = "graphMobile">
						<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
							<h2 class="m-0 font-weight-bold text-primary">Portfolio Performance</h2>
							<!-- Toggle Button for Drag On/Off -->
 							<!-- <button id="drag-switch" onclick="toggleDragMode()" class="btn btn-outline-secondary " >Disable Drag Mode</button> -->
							<!-- Reset graph zoom / scrolling -->
							<button id="resetZoom" onclick="resetZoom()" type="button" class="btn btn-outline-dark">Reset View</button>
						</div>
						<!-- Card Body -->
						<div class="card-body text-center">
							<div style="margin-bottom: 2%;" class="btn-group btn-group-toggle" data-toggle="buttons">
								<label id="1D" class="btn btn-secondary">
								<input type="radio" id="1d" onclick="loadPortfolio('1d')" name="interval-option" value="1d" autocomplete="off"> 1 Day
								</label>
								<label id="1W" class="btn btn-secondary">
								<input type="radio" id="1wk" onclick="loadPortfolio('1wk')" name="interval-option" value="1wk" autocomplete="off"> 1 Week
								</label>
								<label id="1M" class="btn btn-secondary active">
								<input type="radio" id="1mo" onclick="loadPortfolio('1mo')" name="interval-option" value="1mo" autocomplete="off" checked> 1 Month
								</label>
							</div>
							<!-- Toggle Button for S&P Line On/Off -->
							<div style="margin-bottom: 2%;" class="btn-group">
 								<button id="spy-line-toggle" class="btn btn-outline-primary" >Disable S&P Line</button>
							</div>
							<div class="chart-area">
								<div id="chart-loading-wheel"></div>
								<canvas id="chart"></canvas>
							</div>
							<div style="margin-top: 3%;" class="btn-group" role="group">
								<button type="button" class="btn btn-outline-primary" id="zoomOut" onclick="zoomOut()" value="zoomOut">
									<i class="fas fa-search-minus"></i>
								</button>
								<button type="button" class="btn btn-outline-primary" id="zoomIn" onclick="zoomIn()" value="zoomIn">
									<i class="fas fa-search-plus"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- View A Stock Card -->
				<div class="col-xl-4 col-lg-5">
					<div id="stock-loading-wheel"></div>
					<div class="card shadow mb-4">
						<!-- My Stocks - View A Stock -->
						<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
							<h2 class="m-0 font-weight-bold text-primary">My Stocks</h2>
						</div>
						<!-- Card Body -->
						<div class="card-body" id ="myStocksTableMobile">
							<!-- Toggle Button for Portfolio Stocks On/Off -->
  							<div style="margin-bottom: 2%;">
								<button id="portfolio-stocks-disable" class="btn btn-outline-primary" >Deselect All</button>
								<button id="portfolio-stocks-enable" class="btn btn-outline-primary" >Select All</button>
							</div>
							<table id="dataTable" class="table table-bordered" width="100%" cellspacing="0">
							</table>
						</div>
					</div>
					<div class="card shadow mb-4" id ="individualStocksMobile">
						<!-- Individual Stocks - View A Stock -->
						<div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
							<h2 class="m-0 font-weight-bold text-primary">View Individual Stocks</h2>
						</div>
						<!-- Card Body -->
						<div class="card-body">
							<p id="viewStocksMessage">Stocks you add from "View A Stock" will go here.</p>
							<!-- Toggle Button for All Individual Stocks On/Off -->
							<div style="margin-bottom: 2%;">
								<button id="individual-stocks-disable" class="btn btn-outline-primary" >Deselect All</button>
								<button id="individual-stocks-enable" class="btn btn-outline-primary" >Select All</button>
							</div>
							<table id="dataTable2" class="table table-bordered" width="100%" cellspacing="0">
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- /.container-fluid -->
		<hr>
		<div style="padding-left: 5%; padding-right: 5%; class="container-fluid">
			<h1 id="current-portfolio-header">Current Portfolio</h1>
			<div class="card shadow mb-4" id ="currentPortfolioMobile">
				<div class="card-header py-3">
					<h6 class="m-0 font-weight-bold text-primary">Stocks In Your Portfolio</h6>
				</div>
				<div class="card-body">
 					<div id="delete-loading-wheel"></div>
					<div class="table-responsive">
						<table id="deleteTable" class="table table-bordered" width="100%" cellspacing="0">
							
						</table>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Modal for Graph Range picker -->
		<div class="modal fade"   id="rangeSelectorGraph" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
	    <div class="modal-dialog" role="document">
	      <div class="modal-content">
	        <div class="modal-header">
	          <h3 class = "customNav">Pick Range</h3>
	          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	            <span aria-hidden="true">&times;</span>
	          </button>
	        </div>
	        <div class="modal-body">
	            <form class = "col-lg-6 well paddingLeft" onsubmit="selectGraphRange(); return false; ">
	                <medium id="graphRangeMesssage"> </medium>
	                <div class="form group">
	                        <label for="purchasedL" class ="customNav">Start Date</label>
	                        <input type = "date" id = "startDateRangePicker" class = "form-control" name="startDateRange" required>
	                        <br>
	                </div>
	                <div class="form group">
	                        <label for="soldL" class ="customNav">End Date</label>
	                        <input type = "date" id = "endDateRangePicker" class = "form-control" name="endDateRange" required>
	                        <br>
	                </div>
	                <button id="pickRangeButton" type="submit" class="btn btn-success">Pick Range</button>
	                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
	            </form>
	        </div>
	      </div>
	    </div>
	  </div>
	  <!-- End Modal for graph range picker -->
		
		<!-- Modal for Add A Stock -->
		<div class="modal fade" id="seeStock" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Add A Stock</h3>
						<button type="button" onclick ="clearError();" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form class="form-group col-md-12" onsubmit="checkAddSubmission(); return false;">
							<medium id="add-stock-message"> </medium>
							
							<div class="form group">
								<label for="userL" class ="customNav" >Ticker</label>
								<input type = "username" class ="form-control" name="ticker" id="add-stock-ticker" required>
								<br>
							</div>
							<div class="form-group">
								<label for="quantityL" class ="customNav" >Quantity</label>
								<input type = "number" class = "form-control" name="quantity" id="add-stock-quantity" required>
							</div>
							<div class="form group">
								<label for="purchasedL" class ="customNav" >Date Purchased</label>
								<input type = "date" class = "form-control" name="datePurchased" id="add-stock-dp">
								<br>
							</div>
							<div class="form group">
								<label for="soldL" class ="customNav" >Date Sold (Optional)</label>
								<input type = "date" class = "form-control" name="dateSold" id="add-stock-ds">
								<br>
							</div>
							<div class="modal-footer">
								<button type="submit" id="inner-addstock-submit-test" class="btn btn-success" onclick="">Add Stock</button>
								<button type="button" id="inner-addstock-cancel-test" class="btn btn-danger" onclick="clearError();" data-dismiss="modal">Cancel</button>
						    	<button type="button" id="inner-addstock-upload-csv-test" class="btn btn-light" data-toggle="modal" data-target="#addCSV" data-dismiss="modal">Add A CSV File</button>
						    </div>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal for View A Stock-->
		<div class="modal fade" id="viewStock" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">View A Stock</h3>
						<button type="button" onclick ="clearErrorView();" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<form class="form-group col-md-12" onsubmit="checkViewSubmission(); return false;">
	                	<medium id="view-stock-message"> </medium>
	
	                <div class="form group">
	                    <label for="tickerL" class ="customNav">Ticker</label>
	                    <input type = "username" id="view-stock-ticker" class = "form-control" name="ticker" required>
	                    <br>
	                </div>
	                    <div class="form-group">
	                        <label for="quantityL" class ="customNav">Quantity</label>
	                        <input type = "number" id="view-stock-quantity" class = "form-control" name="quantity" required>
	                </div>
	                <div class="form group">
	                        <label for="soldL" class ="customNav">Start Date</label>
	                        <input type = "date" id ="view-stock-dp" class = "form-control" name="datePurchased" required>
	                        <br>
	                </div>
	                <div class="form group">
	                        <label for="purchasedL" class ="customNav">End Date (Optional)</label>
	                        <input type = "date" id="view-stock-ds" class = "form-control" name="dateSold">
	                        <br>
	                </div>
	                <div class="modal-footer">
		                <button type="submit" id="inner-viewstock-submit-test" class="btn btn-success">View Stock</button>
		                <button type="button" id="inner-viewstock-cancel-test" class="btn btn-danger" onclick ="clearErrorView();" data-dismiss="modal">Cancel</button>
	                </div>
	            </form>
	        </div>
	      </div>
	    </div>
	  </div>
		<!--  Modal for Adding CSV -->
		<div class="modal fade" id="addCSV" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class = "customNav" id="addcsvtest-header">Add A CSV File</h3>
						<button id="add-csv-inner-test-cancel" type="button" class="close" data-dismiss="modal" aria-label="Close">
						Cancel
						</button>
					</div>
					<div class="modal-body">
						<form class = "col-lg-4 well paddingLeft" id="csvForm" onsubmit="checkCSVFile(event); return false;">
							<div id="csvMessage"> </div>
							<div class="form-group">
								<input type="file" name="File Upload" id="txtFileUpload" accept=".csv" required>
							</div>
							<div class="form-group">
								<button class="btn btn-primary" id="csvConfirm" >Upload File</button>
							</div>
						</form>
					</div>
				</div>
			</div>		
		</div>
		<script src="csv.js"></script>
		
		<!--  Modal for Confirming Added Stock Deletion -->
		<div class="modal fade" id="confirmStockDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this stock?</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
		      	<medium id="message-deleteStock"> </medium>

		      </div>
		      <div class="modal-footer">
			  	<button id="confirmDeleteStock" type="button" class="btn btn-danger" id="get" onclick="deleteStock(); return false;" type="submit">Delete Stock</button>
				<button id="cancelDeleteStockModal" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
			  </div>
		    </div>
		  </div>
		</div>
		
		<!--  Modal for Confirming View Stock Deletion -->
		<div class="modal fade" id="confirmViewStockDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this stock?</h5>
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		          <span aria-hidden="true">&times;</span>
		        </button>
		      </div>
		      <div class="modal-body">
		      	<medium id="message-deleteViewStock"> </medium>
		      </div>
		      <div class="modal-footer">
			  	<button id="confirmViewDeleteStock" type="button" class="btn btn-danger" id="get" onclick="deleteViewStock(); return false;" type="submit">Delete Stock</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
			  </div>
		    </div>
		  </div>
		</div>
	</body>
</html>