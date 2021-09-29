-- DROP function is for testing purposes
-- DROP DATABASE IF EXISTS StockPortfolioDatabase;

CREATE DATABASE StockPortfolioDatabase;
USE StockPortfolioDatabase;


-- Holds Information about the user info
CREATE TABLE UserRegistry
(
    userID INT PRIMARY KEY NOT NULL auto_increment,
    username VARCHAR(50) NOT NULL UNIQUE,
    pw VARCHAR(50) NOT NULL
);

-- Sold date must be before purchased Date
CREATE TABLE Portfolio
(
    userID INT NOT NULL,
    tickerSymbol VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    dateSold VARCHAR(30) NULL,
    datePurchased VARCHAR(30) NOT NULL,
    FOREIGN KEY (userID) REFERENCES UserRegistry(userID)
);

-- Test Data
-- INSERT INTO UserRegistry(username,pw) VALUES("random","random");
-- INSERT into Portfolio(userID,tickerSymbol,quantity,dateSold,datePurchased) VALUES(1,"APPL",2,"2010-8-9","2009,8,9");