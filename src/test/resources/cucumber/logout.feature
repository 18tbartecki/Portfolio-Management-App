Feature: User tries to Logout
  Scenario: User tries to access page without logging in
    Given I am on SamplePortfolioPage.jsp
    Then I should be redirected to the "login.jsp" page
