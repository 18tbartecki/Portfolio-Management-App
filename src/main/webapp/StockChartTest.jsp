<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<title>API Test</title>
		<link rel="stylesheet" href="StockChartTestStyle.css">
		<script src="StockChartTestJS.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
		<script src="https://unpkg.com/papaparse@5.3.0/papaparse.min.js"></script>
	</head>
	<body>
		<div id="top">
			<form>
				<label for="ticker">Ticker</label>
				<input type="text" id="ticker" value="FB">
			 	<label for="start-date">Start date:</label>
				<input type="date" id="start-date" value="2019-09-20" min="2018-01-01" max="2021-12-31">
			    <label for="end-date">End date:</label>
				<input type="date" id="end-date" value="2020-09-20" min="2018-01-01" max="2021-12-31"> 
			    <label for="duration">Choose a duration:</label>
				<select name="duration" id="duration" multiple>
					<option value="1d" selected>Daily</option>
					<option value="1wk">Weekly</option>
					<option value="1mo">Monthly</option>
				</select>
			    <label for="quantity">Quantity</label>
			    <input type="number" id="quantity">  
			</form> 
			<!-- <label>URL to be fetched:</label>
		    <input type="url" id="url" value="https://query1.finance.yahoo.com/v7/finance/download/FB?period1=1569036975&period2=1600659375&interval=1wk&events=history">
		    -->
		    <button id="get" onclick="get(-1)">GET</button>
		</div>
		<canvas id="chart" width="40" height="40"></canvas>
		<div id="bottom">
		  <textarea id="output"></textarea>
		</div>
	</body>
</html>