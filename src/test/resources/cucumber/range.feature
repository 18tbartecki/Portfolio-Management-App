Feature: Specify range of dates
  Scenario: User tries to enter start after end date 
	Given I am on signUp.jsp briefly
    And I type in "rangeFeature1" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "rangeFeature1" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "AAPL" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 12-18-2019 as the date the stock being added is purchased
    And I type in 10-11-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Range Selector" button
    And I type in 11-11-2020 as the date to start
    And I type in 11-5-2020 as the date to end
    And I click on the "Pick Range" button in the range modal
    Then I should see an error that reads "Start Date must be before end Date" in the range modal
    
  Scenario: User tries to enter start date over a year ago
	Given I am on login.jsp to login to the portfolio
  	And I type in "rangeFeature1" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Range Selector" button
    And I type in 9-11-2019 as the date to start
    And I type in 11-5-2020 as the date to end
    And I click on the "Pick Range" button in the range modal
    Then I should see an error that reads "Stock start date should not go beyond 1 year from today" in the range modal
    
  Scenario: User correctly enters a range
	Given I am on login.jsp to login to the portfolio
  	And I type in "rangeFeature1" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Range Selector" button
    And I type in 10-11-2020 as the date to start
    And I type in 11-5-2020 as the date to end
    And I click on the "Pick Range" button in the range modal
    Then the start and end range should not be "0"
    