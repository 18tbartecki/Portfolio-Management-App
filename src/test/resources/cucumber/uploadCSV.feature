Feature: User uploads a CSV to mass add stocks
Scenario: User uploads an incorrect CSV file
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "missingInfo.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "Invalid file format. Please fill out all columns." in the modal    
Scenario: User uploads file with a negative quantity
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "negativeQuantity.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "Quantity must be greater than 0" in the modal
    
Scenario: User uploads file with purchase date must be before sold date
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "mismatchedDate.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "Purchase date must be before sold date" in the modal

Scenario: User uploads a file more than one year out
   Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "oneYearOut.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "You must add a stock purchased within 1 year from today" in the modal

Scenario: User correctly uploads a file
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "goodStocks.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "Added Successfully" in the modal
    
Scenario: CSV modal exists
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    Then I should see a heading that reads "Add A CSV File"
    
Scenario: CSV modal cancel button exists and works
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Cancel" button in the modal
    Then I should see a heading that reads "Your Portfolio"
    
Scenario: User uploads an incorrect CSV file then reuploads a correct one
    Given I am on login.jsp to login to the portfolio
    When I type in "testUser" for the username
    And I type in "testPassword" for the password
    And I click on "Sign In" to sign in to portfolio
    And I click on the "Add a Stock" button
    And I click on the "Add a CSV File" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "missingInfo.csv" as the file to read in
    And I click on the "Upload" button in the modal
    And I click on the "Upload File" button in the modal
    And I select "goodStocks.csv" as the file to read in
    And I click on the "Upload" button in the modal
    Then I should see a message that reads "Added Successfully" in the modal
    