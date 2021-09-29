Feature: User tries to Login or out
  Scenario: User enters correct username and password with click
    Given I am on login.jsp
    And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I click on "Sign In" to sign in
    Then I should be redirected to "SamplePortfolioPage.jsp"
    
  Scenario: User enters correct username and password with enter
    Given I am on login.jsp
    And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I hit enter on login
    Then I should be redirected to "SamplePortfolioPage.jsp"
    
  Scenario: User enters incorrect username and password
    Given I am on login.jsp
    And I type in "incorrectUser" as the username
    And I type in "incorrectPass" as the password
    And I click on "Sign In" to sign in
    Then I should see an error that says "Incorrect Username and Password. Try again." on login
    
  Scenario: User navigates to signUp.jsp
    Given I am on login.jsp
    And I click on "Sign Up for an Account" to sign in
    Then I should be redirected to "signUp.jsp"

  Scenario: User enters correct username and password then logs out
    Given I am on login.jsp
    And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I click on "Sign In" to sign in
    And I click on Logout
    Then I should be redirected to "login.jsp"
    
  Scenario: User enters incorrect username and password 3 times within 15 seconds
  	Given I am on login.jsp
    And I type in "wrongUser" as the username
    And I type in "wrongPassword" as the password
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    Then I should see an error that says "You have entered the incorrect credentials 3 times in under 1 minute. Your account is temporarily locked." on login
    
  Scenario: User enters incorrect username and password 3 times within 15 seconds then successfully logs in after 60 seconds
  	Given I am on login.jsp
    And I type in "wrongUser" as the username
    And I type in "wrongPassword" as the password
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I wait 60 seconds
    And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I click on "Sign In" to sign in
    Then I should be redirected to "SamplePortfolioPage.jsp"
    
  Scenario: User enters incorrect username and password 3 times within 15 seconds then tries to log in again
  	Given I am on login.jsp
    And I type in "wrongUser" as the username
    And I type in "wrongPassword" as the password
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    Then I should see an error that says "The lockout period is not yet over." on login
    
  Scenario: User enters incorrect username and password 3 times within 15 seconds then does it wrong again after 60 seconds
  	Given I am on login.jsp
    And I type in "wrongUser" as the username
    And I type in "wrongPassword" as the password
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I click on "Sign In" to sign in
    And I wait 60 seconds
    And I type in "wrongUser" as the username
    And I type in "wrongPassword" as the password
    And I click on "Sign In" to sign in
    Then I should see an error that says "Incorrect Username and Password. Try again." on login
 
 Scenario: User is inactive for 2 minutes
  	Given I am on login.jsp
  	And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I wait 2 minutes without activity
    Then I should be redirected to "login.jsp"
    