Feature: Zooming in on the portfolio graph
  
  Scenario: Color of first new view stock is new
  	Given I am on signUp.jsp briefly
    And I type in "color__5" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "color__5" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-01-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 5 as the quantity to view
    And I type in 10-10-2020 as the date the stock being viewed is purchased
    And I type in 11-11-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the modal
    And I click on the "view X" button
    Then the 1st new line should be "rgba(255, 205, 87, 1)"
  
   Scenario: Color of second new view stock is new
  	Given I am on signUp.jsp briefly
    And I type in "color_8" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "color_8" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-11-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 5 as the quantity to view
    And I type in 10-10-2020 as the date the stock being viewed is purchased
    And I type in 11-7-2020 as the date the stock being viewed is sold
    And I click on the "View Stock" button in the modal
    And I type in "AAPL" as the stock to view
    And I click on the "View Stock" button in the modal
    And I click on the "view X" button
    Then the 2nd new line should be "rgba(76, 192, 192, 1)"
  
  Scenario: Color of third new view stock is new
  	Given I am on signUp.jsp briefly
    And I type in "color_____5" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    When I type in "color_____5" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-11-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "View a Stock" button
    And I type in "MSFT" as the stock to view
    And I enter 5 as the quantity to view
    And I type in 10-10-2020 as the date the stock being viewed is purchased
    And I type in 11-7-2020 as the date the stock being viewed is sold
    And I click on the "View a Stock" button in the modal
    And I type in "AAPL" as the stock to view
    And I click on the "View a Stock" button in the modal
    And I type in "AMGN" as the stock to view
    And I click on the "View a Stock" button in the modal
    And I click on the "view X" button
    Then the 3rd new line should be "rgba(53, 162, 235, 1)"
 

Scenario: User Zooms In
	Given I am on signUp.jsp briefly
    And I type in "zoomingIn_1" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "zoomingIn_1" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-8-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Zoom In" button
    Then I should see "zoom in graph" and a zoomed graph
    
  Scenario: User Zooms Out
	Given I am on signUp.jsp briefly
    And I type in "zoomingOut_1" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "zoomingOut_1" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-8-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Zoom In" button
    And I click on the "Zoom Out" button
    And I click on the "Zoom Out" button
    Then I should see "zoom out graph" and a zoomed graph 

Scenario: User selects select all after deselecting all
    Given I am on signUp.jsp briefly
    And I type in "selectAll" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "selectAll" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-8-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Deselect All" button
    And I click on the "Select All" button
    Then "all" elements should be selected
    
  Scenario: User selects deselect all
    Given I am on signUp.jsp briefly
    And I type in "deselectAll" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "deselectAll" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-8-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Deselect All" button
    Then "no" elements should be selected
    
  Scenario: User toggles a stock off
    Given I am on signUp.jsp briefly
    And I type in "toggleOff" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "toggleOff" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-8-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Toggle Stock" button
    Then the checkbox should "not" be selected
    
  Scenario: User toggles a stock back on
    Given I am on signUp.jsp briefly
    And I type in "toggleOn" as the new username
    And I type in "pass" as the new password
    And I type in "pass" as the new confirm password
    And I click on the "Create User" button
    And I type in "toggleOn" for the username
    And I type in "pass" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I type in "MSFT" as the stock to add
    And I type in 5 as the quantity to add
    And I type in 10-10-2020 as the date the stock being added is purchased
    And I type in 11-7-2020 as the date the stock being added is sold
    And I click on the "Add a Stock" button in the modal
    And I click on the "X" button
    And I click on the "Toggle Stock" button
    And I click on the "Toggle Stock" button
    Then the checkbox should "definitely" be selected
  
  
    