Feature: Add a stock to portfolio

Scenario: Existence of Add Stock Button
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    Then I should see a "Add Stock" button in the modal
    
Scenario: Existence of Cancel Button
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    Then I should see a "Cancel" button in the modal

Scenario: User enters incorrect ticker value
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "@" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 10-20-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a valid stock." in the add a stock modal

Scenario: User enters incorrect ticker value
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "FJSD" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 10-20-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a valid stock." in the add a stock modal

Scenario: User enters a sold date that is before the purchase date
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 11-10-2020 as the date the stock being added is purchased
    And I type in 10-10-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a valid stock." in the add a stock modal
    
Scenario: User enter a negative value for quantity
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in -1 as the quantity to add
    And I type in 10-11-2020 as the date the stock being added is purchased
    And I type in 10-15-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a positive quantity." in the add a stock modal
    
Scenario: User enter a zero value for quantity
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 0 as the quantity to add
    And I type in 10-11-2020 as the date the stock being added is purchased
    And I type in 10-15-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a positive quantity." in the add a stock modal
    
  Scenario: User enters no purchase date
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 1 as the quantity to add
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Please enter a value in the date purchased field." in the add a stock modal


Scenario: User adds a stock to their portfolio
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-30-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Invalid: You can't sell a stock at a future date" in the add a stock modal
    
Scenario: User adds a stock to their portfolio
	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 11-21-2019 as the date the stock being added is purchased
    And I type in 10-11-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    Then I should see a message that reads "Added Successfully" in the add a stock modal
    