Feature: Up and Down arrows	
  Scenario: Index growth is positive 
	Given I am on signUp.jsp briefly
    And I type in "positiveStocks4" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "positiveStocks4" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 12-18-2019 as the date the stock being added is purchased
    And I type in 10-11-2020 as the date the stock being added is sold
    And I click on the "Add Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    Then I should see a "rgba(0, 128, 0, 1)" arrow for index growth
    
  Scenario: Index growth is negative 
	Given I am on signUp.jsp briefly
    And I type in "negativeStocks4" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "negativeStocks4" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 12-17-2019 as the date the stock being added is purchased
    And I type in 7-13-2020 as the date the stock being added is sold
    And I click on the "Add Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    Then I should see a "rgba(255, 0, 0, 1)" arrow for index growth
    
  Scenario: Portfolio growth is negative
    Given I am on signUp.jsp briefly
    And I type in "negativePortfolio4" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "negativePortfolio4" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 11-17-2019 as the date the stock being added is purchased
    And I type in 10-13-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    Then I should see a "rgba(255, 0, 0, 1)" arrow for portfolio growth
    
  Scenario: Portfolio current value correct
    Given I am on signUp.jsp briefly
    And I type in "valuePorttfolio" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "valuePorttfolio" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-21-2020 as the date the stock being added is purchased
    And I type in 11-06-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "1 Day" button
    Then I should see "$237.38" for current value
    
  Scenario: Portfolio growth value correct
    Given I am on signUp.jsp briefly
    And I type in "growthValue" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "growthValue" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-21-2020 as the date the stock being added is purchased
    And I type in 11-06-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "1 Day" button
    Then I should see "42.26%" for portfolio growth
    
  Scenario: Index growth value correct
    Given I am on signUp.jsp briefly
    And I type in "growthValue" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "growthValue" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-21-2020 as the date the stock being added is purchased
    And I type in 11-06-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "1 Day" button
    Then I should see "63.11%" for index growth
    
    