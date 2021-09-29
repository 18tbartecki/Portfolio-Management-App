Feature: View views a Stock on the Portfolio Page
    
Scenario: User deletes a stock but then cancels
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 11-21-2019 as the date the stock being added is purchased
    And I type in 10-11-2020 as the date the stock being added is sold
    And I click on the "Add Stock" button in the modal
    And I click on the "X" button
    And I click on the "Delete" button
    And I click on "Cancel" button in the delete modal
    Then I should see a heading that reads "Current Portfolio"

Scenario: User deletes a stock successfully
 	Given I am on signUp.jsp briefly
    And I type in "user_new005" as the new username
    And I type in "pass_new" as the new password
    And I type in "pass_new" as the new confirm password
    And I click on the "Sign Up" button
    And I type in "user_new005" for the username
    And I type in "pass_new" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 11-21-2019 as the date the stock being added is purchased
    And I type in 10-11-2020 as the date the stock being added is sold
    And I click on the "Add Stock" button in the modal
    And I click on the "X" button
    And I click on the "Delete" button
    And I click on "Delete Stock" button in the delete modal
    Then I should see the number of stocks in the portfolio go to "0"
    
Scenario: Existence of View Stock Button
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button in the view modal
    Then I should see a "View Stock" button in the view modal
    
Scenario: Existence of Cancel Button
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button in the view modal
    Then I should see a "Cancel" button in the view modal

Scenario: User enters incorrect ticker value
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button
    And I type in "@" as the stock to view
    And I enter 1 as the quantity to view
    And I type in 9-10-2020 as the date the stock being viewed is purchased
    And I type in 10-20-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Please enter a valid stock." in the view a stock modal

Scenario: User enters incorrect ticker value
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button
    And I type in "FJSD" as the stock to view
    And I enter 1 as the quantity to view
    And I type in 9-10-2020 as the date the stock being viewed is purchased
    And I type in 10-20-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Please enter a valid stock." in the view a stock modal

Scenario: User enters a sold date that is before the purchase date
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 1 as the quantity to view
    And I type in 11-10-2020 as the date the stock being viewed is purchased
    And I type in 10-10-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Please enter a valid stock." in the view a stock modal
    
Scenario: User enter a negative value for quantity
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter -1 as the quantity to view
    And I type in 9-11-2020 as the date the stock being viewed is purchased
    And I type in 10-15-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Please enter a positive quantity." in the view a stock modal
    
Scenario: User enter a zero value for quantity
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 0 as the quantity to view
    And I type in 9-11-2020 as the date the stock being viewed is purchased
    And I type in 10-15-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Please enter a positive quantity." in the view a stock modal
      
Scenario: User clicks to view a stock 
	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-21-2020 as the date the stock being added is purchased
    And I type in 11-06-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 1 as the quantity to view
    And I type in 9-21-2019 as the date the stock being viewed is purchased
    And I type in 10-21-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the view modal
    Then I should see a message that reads "Added to Graph" in the view a stock modal
    