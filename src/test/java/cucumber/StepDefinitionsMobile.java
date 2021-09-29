package cucumber;

import java.util.HashMap;
import java.util.Map;
import static org.junit.Assert.assertEquals;


import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class StepDefinitionsMobile {
	
	Map<String, String> mobileEmulation = new HashMap<>();
	//private static final String ROOT_URL = "http://localhost:8080/";
	ChromeOptions chromeOptions;
	//WebDriver driver;
	
	private static final String ROOT_URL = "https://localhost:8443/";

	private WebDriver driver;

	@Before
	public void ChromeSetup() {
		ChromeOptions options = new ChromeOptions();
		mobileEmulation.put("deviceName", "Pixel 2");
		options.setExperimentalOption("mobileEmulation", mobileEmulation);
		
		options.addArguments("--allow-insecure-localhost");
		options.addArguments("—ignore-certificate-errors");
		options.addArguments("acceptInsecureCerts");
		options.setAcceptInsecureCerts(true);
		driver = new ChromeDriver(options);
	}
	
	
	@Given("I am on the mobile version of login.jsp")
	public void i_am_on_the_mobile_version_of_login_jsp() {

		driver.get(ROOT_URL + "login.jsp");
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	    
	}


	@When("I enter a valid username and password")
	public void i_enter_a_valid_username_and_password() {
		WebElement user = driver.findElement(By.id("username"));
		WebElement password = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
		password.sendKeys("testPassword");
		user.clear();
		user.sendKeys("testUser");
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@When("I press the login button")
	public void i_press_the_login_button() {
		WebElement enter = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
		enter.sendKeys(Keys.ENTER);
		try {
			Thread.sleep(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	@Then("logout and Add and View popup buttons should not overlap on sampleportfolio page")
	public void add_and_View_popup_buttons_should_not_overlap_on_sampleportfolio_page() {
			WebElement addButton = driver.findElement(By.id("addButtonTest"));
			WebElement viewButton = driver.findElement(By.id("viewButtonTest"));
			WebElement logoutButton = driver.findElement(By.id("logout"));
			Boolean overlap = false;
			
			
			/**rateIndexGrowthMobile
			numberOfStocksCounterMobile
			graphMobile
			myStocksTableMobile
			individualStocksMobile
			currentPortfolioMobile**/
			
	        Point addButtonPosition = addButton.getLocation();
	        Point viewButtonPosition = viewButton.getLocation();
	        Point logoutButtonPosition = logoutButton.getLocation();
	        int addButtonHeight = addButton.getSize().getHeight();
	        System.out.println(addButtonPosition);
	        
	        if( (logoutButtonPosition.getY()+logoutButton.getSize().getHeight())>addButtonPosition.getY()) {
	        	overlap = true;
	        }
	        
	        if( (addButtonPosition.getY()+addButtonHeight)>viewButtonPosition.getY()) {
	        	overlap = true;
	        }
	        assertEquals(overlap,false);
	        
	       
	}
	
	@Given("I am on the mobile version of signUp.jsp")
	public void i_am_on_the_mobile_version_of_signUp_jsp() {
		
		driver.get(ROOT_URL + "signUp.jsp");
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		
	    
	}

	@Then("Signup and cancel buttons should not overlap")
	public void signup_and_cancel_buttons_should_not_overlap() {
		WebElement signUpButton = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[4]/button"));
		WebElement cancelButton = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[6]/button"));
		
		boolean overlap = false;
		Point signUpButtonPosition = signUpButton.getLocation();
        Point cancelButtonPosition = cancelButton.getLocation();
        int signUpButtonHeight = signUpButton.getSize().getHeight();
      
        
        if( (signUpButtonPosition.getY()+signUpButtonHeight)>cancelButtonPosition.getY()) {
        	overlap = true;
        }
        assertEquals(overlap,false);
		
		
	}
	
	@Then("sign in and password should not overlap")
	public void sign_in_and_password_should_not_overlap() {
		
		WebElement signInButton = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[4]/button"));
		WebElement passwordField = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
	
		boolean overlap = false;
		Point signInButtonPosition = signInButton.getLocation();
        Point passwordFieldPosition = passwordField.getLocation();
        int passwordFieldHeight = passwordField.getSize().getHeight();
      
        
        if( (passwordFieldPosition.getY()+passwordFieldHeight)>signInButtonPosition.getY()) {
        	overlap = true;
        }
        assertEquals(overlap,false);
		
	}
	@Then("the view popup buttons,current portfolio value, its rate and index along with graph and stock tables should not overlap on sampleportfolio page")
	public void the_view_popup_buttons_current_portfolio_value_its_rate_and_index_along_with_graph_and_stock_tables_should_not_overlap_on_sampleportfolio_page() {
		WebElement viewButton = driver.findElement(By.id("viewButtonTest"));
		Boolean overlap = false;
		
		WebElement valuePortfolioElement = driver.findElement(By.id("valueOfPortfoliMobileTest"));
		System.out.println("Value portfolio div from y: "+valuePortfolioElement.getLocation().getY()+" Height: "+valuePortfolioElement.getSize().getHeight());
		WebElement rateOfPorGrowth = driver.findElement(By.id("ratePorGrowthMobile"));
		WebElement rateIndexGrowth = driver.findElement(By.id("rateIndexGrowthMobile"));
		WebElement numberOfStocksCounter = driver.findElement(By.id("numberOfStocksCounterMobile"));
		WebElement graph = driver.findElement(By.id("graphMobile"));
		WebElement stocksTable = driver.findElement(By.id("myStocksTableMobile"));
		WebElement individualStocks = driver.findElement(By.id("individualStocksMobile"));
		WebElement currentPortfolio = driver.findElement(By.id("currentPortfolioMobile"));
		
		/**rateIndexGrowthMobile
		numberOfStocksCounterMobile
		graphMobile
		myStocksTableMobile
		individualStocksMobile
		currentPortfolioMobile**/
		Point valuePortfolioPosition = valuePortfolioElement.getLocation();
		Point rateOfPorGrowthPosition = rateOfPorGrowth.getLocation();
		Point rateIndexGrowthPosition = rateIndexGrowth.getLocation();
		Point numberOfStocksCounterPosition = numberOfStocksCounter.getLocation();
		Point graphPosition = graph.getLocation();
		Point stocksTablePosition = stocksTable.getLocation();
		Point individualStocksPosition = individualStocks.getLocation();
		Point currentPortfolioPosition = currentPortfolio.getLocation();

        
        
        if( (valuePortfolioPosition.getY()+valuePortfolioElement.getSize().getHeight())>rateOfPorGrowthPosition.getY()) {
        	overlap = true;
        }
        if( (rateOfPorGrowthPosition.getY()+rateOfPorGrowth.getSize().getHeight()) > rateIndexGrowthPosition.getY()) {
        	overlap = true;
        }
        if( (rateIndexGrowthPosition.getY()+rateIndexGrowth.getSize().getHeight()) > numberOfStocksCounterPosition.getY()) {
        	overlap = true;
        }
        
        if( (numberOfStocksCounterPosition.getY()+numberOfStocksCounter.getSize().getHeight()) > graphPosition.getY()) {
        	overlap = true;
        }
        if( (graphPosition.getY()+graph.getSize().getHeight()) > stocksTablePosition.getY()) {
        	overlap = true;
        }
        
        if( (stocksTablePosition.getY()+stocksTable.getSize().getHeight()) > individualStocksPosition.getY()) {
        	overlap = true;
        }
        if( (individualStocksPosition.getY()+individualStocks.getSize().getHeight()) > currentPortfolioPosition.getY()) {
        	overlap = true;
        }
        
        assertEquals(overlap,false);
	}
	
	@After()
	public void after() {
		driver.quit();
	}


}
