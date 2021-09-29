Feature: S&P line enable/disable
  Scenario: Disable S&P Index
	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
	And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-14-2020 as the date the stock being added is purchased
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "1 Day" button
    And I click on the "S&P" button
    Then the S&P button should say "Enable S&amp;P Line"
    
   Scenario: Re-enable S&P Index
	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
	And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 1 as the quantity to add
    And I type in 10-14-2020 as the date the stock being added is purchased
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "1 Day" button
    And I click on the "S&P" button
    And I click on the "S&P" button
    Then the S&P button should say "Disable S&amp;P Line"
    
  Scenario: User changes from month to week interval
  	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "1 Week" button
    Then "1W" will become selected and display
  
  Scenario: User changes from month to day interval
  	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "1 Day" button
    Then "1D" will become selected and display
    
  Scenario: User changes from month to day and back to month interval
  	Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "1 Day" button
    And I click on the "1 Month" button
    Then "1M" will become selected and display