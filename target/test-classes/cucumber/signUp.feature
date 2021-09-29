Feature: View views a Stock on the Portfolio Page
Scenario: User does not complete all entry fields
    Given I am on signUp.jsp
    And I type in "" as the username
    And I type in "pass" as the password
    And I click on "Create User" on sign up
    Then I should see an error that says "Please complete all fields." on sign up
    
  Scenario: User tries to enter different passwords
    Given I am on signUp.jsp
    And I type in "user" as the username
    And I type in "one" as the password
    And I type in "two" as the confirm password
    And I click on "Create User" on sign up
    Then I should see an error that says "Passwords do not match." on sign up
    
  Scenario: User tries to create a username that already exists 
    Given I am on signUp.jsp
    And I type in "testUser" as the username
    And I type in "testPassword" as the password
    And I type in "testPassword" as the confirm password
    And I click on "Create User" on sign up
    Then I should see an error that says "That username already exists, try again." on sign up
    
  Scenario: User successfully creates a new account by pressing enter
    Given I am on signUp.jsp
    And I type in "user_new20" as the username
    And I type in "pass_new" as the password
    And I type in "pass_new" as the confirm password
    And I hit enter on sign up
    Then I should be redirected to "login.jsp"
    
  Scenario: User successfully creates a new account by clicking button
    Given I am on signUp.jsp
    And I type in "user_new10" as the username
    And I type in "pass_new" as the password
    And I type in "pass_new" as the confirm password
    And I click on "Create User" on sign up
    Then I should be redirected to "login.jsp"
    
 Scenario: User navigates to login.jsp
    Given I am on signUp.jsp
    And I click on "Already have an account? Sign in." on sign up
    Then I should be redirected to "login.jsp"