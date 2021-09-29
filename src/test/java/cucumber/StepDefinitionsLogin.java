package cucumber;

import static org.junit.Assert.assertEquals;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;

public class StepDefinitionsLogin {
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
//private static final String ROOT_URL = "http://localhost:8080/";
//
//private final WebDriver driver = new ChromeDriver();

@Given("I am on login.jsp")
public void i_am_on_login_jsp() {
driver.get(ROOT_URL + "login.jsp");

try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}

@When("I click on {string} to sign in")
public void i_click_on_to_sign_in(String string) {

if(string.equals("Sign In")) {
	WebElement button = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[3]/button"));
	button.click();
	} else {
	WebElement link = driver.findElement(By.xpath("/html/body/div/div[3]/div/a"));
	link.click();
	}
	try {
	Thread.sleep(1000);
	} catch (InterruptedException e) {
	e.printStackTrace();
	}
}

@Given("I am on signUp.jsp")
public void i_am_on_signUp_jsp() {
	driver.get(ROOT_URL + "signUp.jsp");
	
	try {
	Thread.sleep(1000);
	} catch (InterruptedException e) {
	e.printStackTrace();
	}
}

@When("I hit enter on login")
public void i_hit_enter() {
WebElement enter = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[2]/input"));
enter.sendKeys(Keys.ENTER);
try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}

/*@Then("I should be redirected to {string}")
public void i_should_be_redirected_to(String string) {
    String url = driver.getCurrentUrl();
    assertEquals(url, ROOT_URL + string);
   
}*/

@Then("I should see an error that says {string} on login")
public void i_should_see_an_error_that_says(String string) {
WebElement error = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[4]"));
assertEquals(error.getAttribute("innerHTML"), string);
}


@When("I type in {string} as the username")
public void i_type_in_as_the_username(String string) {
System.out.println("I type in {string} as the username " + string);
// /html/body/div/div[2]/div[2]/form/div[1]/input
// /html/body/div/div[2]/div[2]/form/div[1]/input
// WebElement stockBox = driver.findElement(By.xpath("/html/body/div[4]/div/div/div[2]/div[1]/form/input[1]"));
// /html/body/div/div[2]/div[2]/form/div[1]/input
// /html/body/div/div[2]/div[2]/form/div[1]/input

// /html/body/div/div[2]/div[2]/form/div[1]/input
WebElement user = driver.findElement(By.id("username"));
user.clear();
user.sendKeys(string);
try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}
@When("I type in {string} as the password")
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

@When("I type in {string} as the confirm password")
public void i_type_in_as_the_confirm_password(String string) {
WebElement confirmPassword = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[3]/input"));
confirmPassword.sendKeys(string);
try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}

@When("I click on {string} on sign up")
public void i_click_on_on_sign_up(String string) {
if(string.equals("Create User")) {
WebElement button = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[4]/button"));
button.click();
} else {
WebElement link = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[6]/button"));
link.click();
}
try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}

@When("I click on Logout") 
public void i_click_on_logout() {
	WebElement button = driver.findElement(By.xpath("/html/body/nav/form/button"));
	button.click();
}

@When("I wait 2 minutes without activity")
public void i_wait_2_minutes_without_activity() {
	try {
		Thread.sleep(130000);
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
}

@When("I wait 60 seconds")
public void i_wait_seconds() {
	try {
		Thread.sleep(70000);
	} catch (InterruptedException e) {
		e.printStackTrace();
	}
}

@When("I hit enter on sign up")
public void i_hit_enter_on_sign_up() {
WebElement enter = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[3]/input"));
enter.sendKeys(Keys.ENTER);
try {
Thread.sleep(1000);
} catch (InterruptedException e) {
e.printStackTrace();
}
}

@Then("I should be redirected to {string}")
public void i_should_be_redirected_to(String string) {
String url = driver.getCurrentUrl();
assertEquals(url, ROOT_URL + string);
}

@Then("I should see an error that says {string} on sign up")
public void i_should_see_an_error_that_says_on_sign_up(String string) {
WebElement error = driver.findElement(By.xpath("/html/body/div/div[2]/div[2]/form/div[5]"));
assertEquals(error.getAttribute("innerHTML"), string);
}

@After()
public void after() {
	driver.quit();
}

}
