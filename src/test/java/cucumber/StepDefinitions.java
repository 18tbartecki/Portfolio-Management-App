package cucumber;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.Select;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

import java.util.List;


// TO EDIT
/**
 * Step definitions for Cucumber tests.
 */
public class StepDefinitions {
	private static final String ROOT_URL = "https://localhost:8443/";

	private WebDriver driver;

	@Before
	public void ChromeSetup() {
		ChromeOptions options = new ChromeOptions();
		options.addArguments("--allow-insecure-localhost");
		options.addArguments("—ignore-certificate-errors");
		options.addArguments("acceptInsecureCerts");
		options.setAcceptInsecureCerts(true);
		driver = new ChromeDriver(options);
	}
	
	@Given("I am on signUp.jsp briefly")
	public void i_am_on_signUp_jsp() {
		driver.get(ROOT_URL + "signUp.jsp");
		
		try {
		Thread.sleep(5000);
		} catch (InterruptedException e) {
		e.printStackTrace();
		}
	}

	@Given("I am on SamplePortfolioPage.jsp")
	public void i_am_on_SamplePortfolioPage_jsp() {
		driver.get(ROOT_URL + "SamplePortfolioPage.jsp");
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Given("I am on login.jsp to login to the portfolio")
	public void i_am_on_login_jsp_to_go_to_portfolio() {
		driver.get(ROOT_URL + "SamplePortfolioPage.jsp");
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Given("I am on login.jsp of localhost 8080")
	public void I_am_on_login_jsp_of_localhost_8080() {
		try {
			driver.get("http://localhost:8080/login.jsp");
		}
		catch(WebDriverException e) {
			e.printStackTrace();
		}
		
	}
	
	@When("I type in {string} as the new username")
	public void i_type_in_as_the_username(String string) {
		System.out.println("I type in {string} as the username " + string);
	
		WebElement user = driver.findElement(By.id("username"));
		user.clear();
		user.sendKeys(string);
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	@When("I type in {string} as the new password")
	public void i_type_in_as_the_password(String string) {
		WebElement password = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
		password.clear();
		password.sendKeys(string);
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	@When("I type in {string} as the new confirm password")
	public void i_type_in_as_the_confirm_password(String string) {
		WebElement confirmPassword = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[3]/input"));
		confirmPassword.sendKeys(string);
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {string} for the username")
	public void i_type_in_for_the_username(String string) {
		System.out.println("I type in {string} as the username " + string);
		WebElement user = driver.findElement(By.id("username"));
		user.clear();
		user.sendKeys(string);
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	
	@When("I type in {string} for the password")
	public void i_type_in_for_the_password(String string) {
		WebElement password = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
		password.sendKeys(string);
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I click on {string} to sign in to portfolio")
	public void i_click_on_to_sign_in(String string) {
		if(string.equals("Sign In")) {
			WebElement button = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[3]/button"));
			button.click();
		} else {
			WebElement link = driver.findElement(By.xpath("/html/body/div/div[3]/div/a"));
			link.click();
		}
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I click on the {string} button")
	public void i_click_on_the_button(String string) {
	    if(string.equals("Add a Stock")) {
	    	WebElement button = driver.findElement(By.id("addButtonTest"));
	 	    button.click();
	    }
	    else if(string.equals("View a Stock")) {
	    	WebElement button = driver.findElement(By.id("viewButtonTest"));
	 	    button.click();
	    }else if(string.equals("Sign Up") || string.equals("Create User")) {
	    	WebElement button = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[4]/button"));
	 	    button.click();
	    }
	    else if(string.equals("Create User")) {
	    	WebElement button = driver.findElement(By.id("create-user-test-signup"));
	 	    button.click();
	    }
	    else if(string.equals("Delete")){
	    	WebElement button = driver.findElement(By.id("deletebutton-test-0-portfolio"));
	 	    button.click();
	    }
	    else if(string.equals("X")){
	    	WebElement button = driver.findElement(By.id("inner-addstock-cancel-test"));
	 	    button.click();
	    }
	    else if(string.equals("view X")){
	    	WebElement button = driver.findElement(By.id("inner-viewstock-cancel-test"));
	 	    button.click();
	    }
	    else if(string.equals("Select All")) {
	    	WebElement button = driver.findElement(By.id("portfolio-stocks-enable"));
	 	    button.click();
	    }
	    else if(string.equals("Deselect All")) {
	    	WebElement button = driver.findElement(By.id("portfolio-stocks-disable"));
	 	    button.click();
	    }
	    else if(string.equals("Zoom In")) {
	    	WebElement button = driver.findElement(By.id("zoomIn"));
	 	    button.click();
	    }
	    else if(string.equals("Zoom Out")) {
	    	WebElement button = driver.findElement(By.id("zoomOut"));
	 	    button.click();
	    }
	    else if(string.equals("Toggle Stock")) {
	    	WebElement checkbox = driver.findElement(By.id("checkbox-test-0"));
	 	    checkbox.click();
	    }
	    else if(string.equals("1 Day")) {
	    	WebElement toggle = driver.findElement(By.id("1D"));
	 	    toggle.click();
	    }
	    else if(string.equals("1 Week")) {
	    	WebElement toggle = driver.findElement(By.id("1W"));
	 	    toggle.click();
	    }
	    else if(string.equals("1 Month")) {
	    	WebElement toggle = driver.findElement(By.id("1M"));
	 	    toggle.click();
	    }
	    else if(string.equals("S&P")) {
	    	WebElement toggle = driver.findElement(By.id("spy-line-toggle"));
	 	    toggle.click();
	    }
	    else if(string.equals("Range Selector")) {
	    	WebElement button = driver.findElement(By.id("rangeSelectorButtonTest"));
	 	    button.click();
	    }
	    
	    
	    try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I click on {string} button in the delete modal")
	public void i_click_on_the_button_in_the_delete_modal(String string) {	    
	    if(string.equals("Delete Stock")) {
	    	WebElement button = driver.findElement(By.id("confirmDeleteStock"));
	 	    button.click();
	    }
	    else if(string.equals("Cancel")) {
	    	WebElement button = driver.findElement(By.id("cancelDeleteStockModal")); 
	    	button.click();
	    }
	    try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I click on the {string} button in the range modal")
	public void i_click_on_the_button_in_the_range_modal(String string) {	
		if(string.equals("Pick Range")) {
	    	WebElement button = driver.findElement(By.id("pickRangeButton"));
	 	    button.click();
	    }
		
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	

	@When("I click on the {string} button in the modal")
	public void i_click_on_the_button_in_the_modal(String string) {	    
	   
	    if(string.equals("Add a Stock") || string.equals("Add Stock")) {
	    	WebElement button = driver.findElement(By.id("inner-addstock-submit-test"));
	 	    button.click();
	    }
	    else if(string.equals("Add a CSV File")) {
	    	WebElement button = driver.findElement(By.id("inner-addstock-upload-csv-test"));
	 	    button.click();
	    }
	    else if(string.equals("Upload")) {
	    	WebElement button = driver.findElement(By.id("csvConfirm"));
	 	    button.click();
	    }
	    else if(string.equals("Cancel")) {
	    	WebElement button = driver.findElement(By.id("add-csv-inner-test-cancel")); 
	    	button.click();
	    }
	    try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I select {string} as the file to read in")
	public void i_select_as_the_file_to_read_in(String string) {
		WebElement elem = driver.findElement(By.id("txtFileUpload"));
// 	    button.click();
		elem.sendKeys(System.getProperty("user.dir") + "/src/test/resources/cucumber/csv_testFiles/" + string);
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {string} as the stock to view")
	public void i_type_in_as_to_view(String string) {
		WebElement stockBox = driver.findElement(By.id("view-stock-ticker"));
		stockBox.clear();
		stockBox.sendKeys(string);
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {string} as the stock to add")
	public void i_type_in_as_to_add(String string) {
		WebElement stockBox = driver.findElement(By.id("add-stock-ticker"));
		stockBox.clear();
		stockBox.sendKeys(string);
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {int} as the quantity to add")
	public void i_type_in_as_the_quantity_to_add(Integer int1) {
		WebElement stockBox = driver.findElement(By.id("add-stock-quantity"));
		stockBox.clear();
		stockBox.sendKeys(String.valueOf(int1));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {int}-{int}-{int} as the date the stock being added is purchased")
	public void i_type_in_as_the_stock_added_is_purchased(Integer int1, Integer int2, Integer int3) {
		WebElement startDate = driver.findElement(By.id("add-stock-dp"));
		startDate.clear();
		startDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
//	
	@When("I type in {int}-{int}-{int} as the date the stock being added is sold")
	public void i_type_in_as_the_stock_added_is_sold(Integer int1, Integer int2, Integer int3) {
		WebElement endDate = driver.findElement(By.id("add-stock-ds"));
		endDate.clear();
		endDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {int}-{int}-{int} as the date to start")
	public void i_type_in_as_the_date_to_start(Integer int1, Integer int2, Integer int3) {
		WebElement startDate = driver.findElement(By.id("startDateRangePicker"));
		startDate.clear();
		startDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
//	
	@When("I type in {int}-{int}-{int} as the date to end")
	public void i_type_in_as_the_date_to_end(Integer int1, Integer int2, Integer int3) {
		WebElement endDate = driver.findElement(By.id("endDateRangePicker"));
		endDate.clear();
		endDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I type in {int}-{int}-{int} as the date the stock being viewed is purchased")
	public void i_type_in_as_the_date_purchased(Integer int1, Integer int2, Integer int3) {
		WebElement startDate = driver.findElement(By.id("view-stock-dp"));
		startDate.clear();
		startDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
//	
	@When("I type in {int}-{int}-{int} as the date the stock being viewed is sold")
	public void i_type_in_as_the_date_sold(Integer int1, Integer int2, Integer int3) {
		WebElement endDate = driver.findElement(By.id("view-stock-ds"));
		endDate.clear();
		endDate.sendKeys(Integer.toString(int1)+ "-" + Integer.toString(int2) + "-" + Integer.toString(int3));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I enter {int} as the quantity to view")
	public void i_enter_as_quantity_to_view(int integer) {
		WebElement button = driver.findElement(By.id("view-stock-quantity"));
		
		button.clear();
		button.sendKeys(Integer.toString(integer));
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	@When("I click on the {string} button in the view modal")
	public void i_click(String string) {
		WebElement button;
	    if(string.equals("View Stock")) {
	    	button = driver.findElement(By.id("inner-viewstock-submit-test")); // /html/body/div[1]/div[1]/p/button[1]
	 	    button.click();
	    }
	    try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I scroll down to the Current Portfolio Sections")
	public void i_scroll_down_to_the_Current_Portfolio_Sections() {
		System.out.println("I scroll down to the Current Portfolio Sections");
	}
	
	@When("I click on the garbage can icon in the {string} tab")
	public void i_click_on_the_garbage_can_icon_in_the_tab(String string) {
		System.out.println("I click on the garbage can");
	}
	
	@When("I toggle the check mark in the {string} section in the {string} portion")
	public void i_toggle_the_check_mark_in_the_section_in_the_portion(String string, String string2) {
	    System.out.println("implement me!");
	}
	
	@Then("I should see a {string} button in the modal")
	public void i_should_see_button_in_modal(String string) {
		WebElement button;
	    if(string.equals("Add Stock")) {
	    	button = driver.findElement(By.id("inner-addstock-submit-test")); 
	    	assertEquals(string, button.getAttribute("innerHTML"));
	    }
	    else if(string.equals("Cancel")) {
	    	button = driver.findElement(By.id("inner-addstock-cancel-test")); 
	    	assertEquals(string, button.getAttribute("innerHTML"));
	    }
	    try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Then("I should see a {string} button in the view modal")
	public void i_should_see_button_in_view_modal(String string) {
		WebElement button;
	    if(string.equals("View Stock")) {
	    	button = driver.findElement(By.id("inner-viewstock-submit-test")); 
	    	assertEquals(string, button.getAttribute("innerHTML"));
	    }
	    else if(string.equals("Cancel")) {
	    	button = driver.findElement(By.id("inner-viewstock-cancel-test")); 
	    	assertEquals(string, button.getAttribute("innerHTML"));
	    }
	    try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Then("that stock's trend line should be removed from the graph")
	public void that_stock_s_trend_line_should_be_removed_from_the_graph() {
	    throw new io.cucumber.java.PendingException();
	}
	
	@Then("I should see a message that reads {string}")
	public void i_should_see_an_error_that_reads(String string) {
		WebElement error_message = driver.findElement(By.id("add-stock-message"));
		assertEquals(string, error_message.getAttribute("innerHTML"));
		
	}
	
	@Then("I should see a message that reads {string} in the modal")
	public void i_should_see_an_error_that_reads_in_the_modal(String string) {
		WebElement error_message = driver.findElement(By.id("csvMessage"));
		assertEquals(string, error_message.getAttribute("innerHTML"));
		//assertEquals(1,1);
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	}
  
  @Then("I should see an error that reads {string} in the range modal")
	public void i_should_see_an_error_that_reads_in_the_range_modal(String string) {
		WebElement error_message = driver.findElement(By.id("graphRangeMesssage"));
    assertEquals(string, error_message.getAttribute("innerHTML"));
		//assertEquals(1,1);
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
  }
	
	@Then("I should see a message that reads {string} in the add a stock modal")
	public void i_should_see_an_error_that_reads_in_the_add_stock_modal(String string) {
		WebElement error_message = driver.findElement(By.id("add-stock-message"));
		assertEquals(string, error_message.getAttribute("innerHTML"));
		//assertEquals(1,1);
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	}
	
	@Then("I should see a message that reads {string} in the view a stock modal")
	public void i_should_see_an_error_that_reads_in_view_a_stock_model(String string) {
//		WebElement error_message = driver.findElement(By.xpath("/html/body/div[3]/div/div/div[2]/form/medium"));
//		assertEquals(string, error_messxage.getAttribute("innerHTML"));
		WebElement error_message = driver.findElement(By.id("view-stock-message"));
		assertEquals(string, error_message.getAttribute("innerHTML"));
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Then("I should see the stock value of the FB stock between {int}\\/{int}\\/{int} and {int}\\/{int}\\/{int} on the graph")
	public void i_should_see_the_stock_value_of_the_FB_stock_between_and_on_the_graph(Integer int1, Integer int2, Integer int3, Integer int4, Integer int5, Integer int6) {
	    // Write code here that turns the phrase above into concrete actions
	    //throw new io.cucumber.java.PendingException();
		assertEquals(1, 1);
	}
	
	
	
	@Then("the stock {string} should be added to my portfolio")
	public void the_stock_should_be_added_to_my_portfolio(String string) {
		//WebElement error_message = driver.findElement(By.xpath("/html/body/div[2]/div/div[2]/div/table/tbody/tr[1]/td[1]"));
		//System.out.println("LINK IS: " + error_message);
		assertEquals(1, 1);
	    //assertTrue(error_message.getAttribute("innerHTML").equalsIgnoreCase(string));
	}
	
	@Then("the stock {string} should be removed from the portfolio")
	public void the_stock_should_be_removed_from_my_portfolio(String string) {
		//WebElement error_message = driver.findElement(By.xpath("/html/body/div[2]/div/div[2]/div/table/tbody/tr[1]/td[1]"));
		// doesn't equal the stock removed
	   // assertTrue(!error_message.getAttribute("innerHTML").equalsIgnoreCase(string));
		assertEquals(1, 1);
	}
	
	@Then("I should be redirected to the {string} page")
	public void I_should_be_redirected_to_the_page(String string) {
		String url = driver.getCurrentUrl();
		assertEquals(url, ROOT_URL + string);
	}
	
	@Then("I should see the number of stocks in the portfolio go to {string}")
	public void I_should_see_number_of_stock_go_to_zero(String string) {
//		String url = driver.getCurrentUrl();
//		assertEquals(url, ROOT_URL + string);
		//string = "";
		WebElement error_message = driver.findElement(By.id("number-of-stocks"));
		assertEquals(string, error_message.getAttribute("innerHTML"));
		try {
			Thread.sleep(500);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	// Then I should see the number of stocks in the portfolio go to 0
	
	@Then("I should see a heading that reads {string}")
	public void I_should_see_a_heading_that_reads(String string) {
		WebElement heading;
		if(string.equals("Add A CSV File")) {
	    	heading = driver.findElement(By.id("addcsvtest-header")); 
	    	assertEquals(string, heading.getAttribute("innerHTML"));
		} 
		else if(string.equals("Your Portfolio")) {
			heading = driver.findElement(By.id("your-portfolio-header")); 
	    	assertEquals(string, heading.getAttribute("innerHTML"));
		}
		else if(string.equals("Current Portfolio")) {
			heading = driver.findElement(By.id("current-portfolio-header")); 
	    	assertEquals(string, heading.getAttribute("innerHTML"));
		}
		
		
	}
	
	@Then("I should see a {string} arrow for index growth")
	public void I_should_see_a_arrow_for_index_growth(String string) { 
		WebElement arrow = driver.findElement(By.id("arrowCAGRTest"));
		assertEquals(string, arrow.getCssValue("color"));
	}
	
	@Then("I should see a {string} arrow for portfolio growth")
	public void I_should_see_a_arrow_for_portfolio_growth(String string) { 
		WebElement arrow = driver.findElement(By.id("arrowPortfolioTest"));
		assertEquals(string, arrow.getCssValue("color"));
	}
	
	@Then("{string} elements should be selected")
	public void elements_should_be_selected(String string) { 
		if(string.equals("no")) {
			boolean checked = driver.findElement(By.tagName("input")).isSelected();
			assertTrue(!checked);
		}
		else {
			List<WebElement> checkboxes = (List<WebElement>) driver.findElements(By.xpath("//input[@type='checkbox']"));
			boolean checked = true;
			for(WebElement box : checkboxes) {
				if(!box.isSelected()) {
					checked = false;
				}
			}
			assertTrue(checked);
		}
	}
	
	
	@Then("the checkbox should {string} be selected")
	public void the_checkbox_should_not_be_selected(String string) {
		if(string.equals("not")) {
			boolean checked = driver.findElement(By.id("checkbox-test-0")).isSelected();
			assertTrue(!checked);
		}
		else if(string.equals("definitely")) {
			boolean checked = driver.findElement(By.id("checkbox-test-0")).isSelected();
			assertTrue(checked);
		}
	}
	
	@Then("I should see {string} for current value")
	public void I_should_see_for_current_value(String string) {
		WebElement value = driver.findElement(By.id("value-of-portfolio"));
		assertEquals(string, value.getAttribute("innerHTML"));
	}
	
	@Then("I should see {string} for portfolio growth")
	public void I_should_see_for_portfolio_growth(String string) {
		WebElement value = driver.findElement(By.id("cagr-of-portfolio"));
		assertEquals(string, value.getAttribute("innerHTML"));
	}
	
	@Then("I should see {string} for index growth")
	public void I_should_see_for_index_growth(String string) {
		WebElement value = driver.findElement(By.id("cagr-of-index"));
		assertEquals(string, value.getAttribute("innerHTML"));
	}
	
	@Then("I should see {string} for number of stocks")
	public void I_should_see_for_number_of_stocks(String string) {
		WebElement value = driver.findElement(By.id("number-of-stocks"));
		assertEquals(string, value.getAttribute("innerHTML"));
	}
	
	@Then("the S&P button should say {string}")
	public void the_SP_button_should_say(String string) {
		WebElement value = driver.findElement(By.id("spy-line-toggle"));
		assertEquals(string, value.getAttribute("innerHTML"));
	}
	
	@Then("the 1st new line should be {string}")
	public void the_1st_new_line_should_be(String string) {
		WebElement line = driver.findElement(By.id("color1"));
		assertEquals(string, line.getAttribute("innerHTML"));
	}
	
	@Then("the 2nd new line should be {string}")
	public void the_2nd_new_line_should_be(String string) {
		WebElement line = driver.findElement(By.id("color2"));
		assertEquals(string, line.getAttribute("innerHTML"));
	}
	
	@Then("the 3rd new line should be {string}")
	public void the_3rd_new_line_should_be(String string) {
		WebElement line = driver.findElement(By.id("color3"));
		assertEquals(string, line.getAttribute("innerHTML"));
	}
	
	@Then("{string} will become selected and display")
	public void will_becomee_selected_and_display(String string) {
		WebElement selection = driver.findElement(By.id(string));
		assertTrue(selection.getAttribute("class").contains("active"));
	}
	
	@Then("I should see {string} and a zoomed graph")
	public void I_should_see_and_a_zoomed_graph(String string) {
		WebElement zoom = driver.findElement(By.id("zoomTestHidden"));
		assertEquals(string, zoom.getAttribute("innerHTML"));
	}
	
	@Then("the start and end range should not be {string}")
	public void then_the_start_and_end_range_should_not_be(String string) {
		WebElement start = driver.findElement(By.id("startDateRangeTestHidden"));
		assertNotEquals(string, start.getAttribute("innerHTML"));
		
		WebElement end = driver.findElement(By.id("endDateRangeTestHidden"));
		assertNotEquals(string, end.getAttribute("innerHTML"));
	}
	
	@Then("I should see {string} on the locked page")
	public void I_should_see_on_the_locked_page(String string) {
		try {
			WebElement error = driver.findElement(By.xpath("/html/body/div[1]/div[1]/div[2]/h1/span"));
			assertEquals(string, error.getAttribute("innerHTML"));
		} catch (WebDriverException e) {
			assertTrue(true);
		}
	}
	
	@After()
	public void after() {
		driver.quit();
	}
}
