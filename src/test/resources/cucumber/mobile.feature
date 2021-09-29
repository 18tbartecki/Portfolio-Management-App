Feature: Test Mobile Version of Website
  Scenario: Add and View popup buttons overlap
    Given I am on the mobile version of login.jsp
    When I enter a valid username and password
    And I press the login button
    Then logout and Add and View popup buttons should not overlap on sampleportfolio page
    
  Scenario: Check overlap of all elements for portfolio page
    Given I am on the mobile version of login.jsp
    When I enter a valid username and password
    And I press the login button
    Then the view popup buttons,current portfolio value, its rate and index along with graph and stock tables should not overlap on sampleportfolio page
    
    
Scenario: SignUp and cancel buttons overlap
	Given I am on the mobile version of signUp.jsp
	Then Signup and cancel buttons should not overlap
	
Scenario: Sign In and Password fields don't overlap
	Given I am on the mobile version of signUp.jsp
	Then sign in and password should not overlap
    