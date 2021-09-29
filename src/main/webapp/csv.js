function checkCSVFile(event) {
	event.preventDefault();
	var uploadButton = document.querySelector("#csvConfirm");
	uploadButton.innerHTML = "Uploading...";
	
	var fileUpload = document.querySelector("#txtFileUpload");

	var reader = new FileReader();
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDate();
	
	var today = new Date(year, month, day);
	
	reader.onload = function (e) {
		
		var rows = e.target.result.split("\n");
		console.log(rows);
		for (var i = 0; i < rows.length; i++) {
			var cells = rows[i].split(",");
			console.log("purchase date: " + cells[2] + " sold date: " + cells[3]);
			for (var j = 0; j < cells.length; j++) {
				if(cells[j] == "") {
					//throw a not all cells formatted error
					document.getElementById("csvMessage").innerHTML = "Invalid file format. Please fill out all columns.";
					document.getElementById("csvMessage").style = "color:red";
					return false;
				}
			}
			
			if(cells[1] < 0) {
				document.getElementById("csvMessage").innerHTML = "Quantity must be greater than 0";
				document.getElementById("csvMessage").style = "color:red";
				return false;
			}
			else if(cells[3] != "\r") {
				var start = new Date(cells[2]);
				var end = new Date(cells[3]);
				if(start >= end) {
					document.getElementById("csvMessage").innerHTML = "Purchase date must be before sold date";
					document.getElementById("csvMessage").style = "color:red";
					return false;
				}
			} 
			
			var purchase = new Date(cells[2]);
			var one_day=1000*60*60*24;
			
			var daysBetween = Math.ceil((purchase.getTime()-today.getTime()))/one_day;
			
			if(Math.abs(daysBetween) > 365) {
				document.getElementById("csvMessage").innerHTML = "You must add a stock purchased within 1 year from today";
				document.getElementById("csvMessage").style = "color:red";
				return false;
			}
			
				// Send to add Stock
				var tickerData = cells[0];
				var quantityData = cells[1];
				var datePurchasedData = cells[2];
				var dateSoldData = cells[3].trim();
				//console.log(quantityData);
				$.ajax({
					url: "addStockServlet",
					data: {
						formType: "add",
						ticker: tickerData,
						quantity: quantityData,
						dateSold: dateSoldData,
						datePurchased: datePurchasedData
					},
					success: function(result) {
						if (result == "Added Successfully"){
							document.getElementById("csvMessage").innerHTML = "Added Successfully";
					        document.getElementById("csvMessage").style = "color:green";
						}
						else {
							document.getElementById("csvMessage").innerHTML = result;
					        document.getElementById("csvMessage").style = "color:red";
							
						}
					}
				})
			
		}
	}	
	uploadButton.innerHTML = "Upload";
	reader.readAsText(fileUpload.files[0]);
}


	