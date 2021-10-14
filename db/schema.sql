DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Holdings;
DROP TABLE IF EXISTS Coins;
DROP TABLE IF EXISTS Login;
DROP TABLE IF EXISTS Settings;
DROP TABLE IF EXISTS Stocks;
DROP TABLE IF EXISTS Watchlist;

CREATE TABLE User (
	userID INTEGER NOT NULL AUTO_INCREMENT,
	username VARCHAR(32) UNIQUE NOT NULL,
	password BLOB NOT NULL,
	PRIMARY KEY (userID)
);

CREATE TABLE Activity (
	activityID INTEGER NOT NULL AUTO_INCREMENT,
	userID INTEGER NOT NULL,
	activityTransactionID VARCHAR(32) UNIQUE NOT NULL,
	activityAssetID BLOB NOT NULL,
	activityAssetSymbol BLOB NOT NULL,
	activityAssetType BLOB NOT NULL,
	activityDate BLOB NOT NULL,
	activityType BLOB NOT NULL,
	activityAssetAmount BLOB NOT NULL,
	activityFee BLOB NOT NULL,
	activityNotes BLOB NOT NULL,
	activityExchange BLOB NOT NULL,
	activityPair BLOB NOT NULL,
	activityPrice BLOB NOT NULL,
	activityFrom BLOB NOT NULL,
	activityTo BLOB NOT NULL,
	PRIMARY KEY (activityID),
	FOREIGN KEY (userID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Holding (
	holdingID INTEGER NOT NULL AUTO_INCREMENT,
	userID INTEGER NOT NULL,
	holdingAssetID BLOB NOT NULL,
	holdingAssetSymbol BLOB NOT NULL,
	holdingAssetAmount BLOB NOT NULL,
	holdingAssetType BLOB NOT NULL,
	PRIMARY KEY (holdingID),
	FOREIGN KEY (userID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Coin (
	coinID INTEGER NOT NULL AUTO_INCREMENT,
	assetID VARCHAR(64) NOT NULL,
	assetSymbol VARCHAR(16) NOT NULL,
	PRIMARY KEY (coinID)
);

CREATE TABLE Login (
	loginID INTEGER NOT NULL AUTO_INCREMENT,
	userID INTEGER NOT NULL,
	loginToken VARCHAR(64) NOT NULL UNIQUE,
	loginDate DATETIME NOT NULL,
	PRIMARY KEY (loginID),
	FOREIGN KEY (userID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Setting (
	settingID INTEGER NOT NULL AUTO_INCREMENT,
	userID INTEGER NOT NULL UNIQUE,
	userSettings BLOB NOT NULL,
	FOREIGN KEY (userID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE Stock (
	stockID INTEGER NOT NULL AUTO_INCREMENT,
	assetID VARCHAR(64) NOT NULL,
	assetSymbol VARCHAR(16) NOT NULL,
	PRIMARY KEY (stockID)
);

CREATE TABLE Watchlist (
	watchlistID INTEGER NOT NULL AUTO_INCREMENT,
	userID INTEGER NOT NULL,
	assetID BLOB NOT NULL,
	assetSymbol BLOB NOT NULL,
	assetType BLOB NOT NULL,
	PRIMARY KEY (watchlistID),
	FOREIGN KEY (userID) REFERENCES User(userID) ON UPDATE CASCADE ON DELETE CASCADE
);
