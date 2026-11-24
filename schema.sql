PRAGMA foreign_keys = ON;

DROP VIEW IF EXISTS purchase_summary;
DROP TABLE IF EXISTS Purchase_Items;
DROP TABLE IF EXISTS Member_Consoles;
DROP TABLE IF EXISTS Purchases;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Consoles;
DROP TABLE IF EXISTS Members;

CREATE TABLE Members (
	member_id INTEGER PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	phone TEXT UNIQUE,
	join_date DATE NOT NULL
);

CREATE TABLE Consoles (
	console_id INTEGER PRIMARY KEY,
	console_name TEXT NOT NULL,
	manufacturer TEXT
);

CREATE TABLE Games (
	game_id INTEGER PRIMARY KEY,
	console_id INTEGER NOT NULL,
	title TEXT NOT NULL,
	description TEXT,
	current_price DECIMAL NOT NULL CHECK (current_price >= 0),
	stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
	FOREIGN KEY (console_id) REFERENCES Consoles(console_id)
);

CREATE TABLE Purchases (
	purchase_id INTEGER PRIMARY KEY,
	member_id INTEGER,
	purchase_date DATETIME NOT NULL,
	total_price DECIMAL NOT NULL CHECK (total_price >= 0),
	FOREIGN KEY (member_id) REFERENCES Members(member_id)
);

CREATE TABLE Purchase_Items (
	purchase_id INTEGER NOT NULL,
	game_id INTEGER NOT NULL,
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	price_at_purchase DECIMAL NOT NULL CHECK (price_at_purchase >= 0),
	PRIMARY KEY (purchase_id, game_id),
	FOREIGN KEY (purchase_id) REFERENCES Purchases(purchase_id),
	FOREIGN KEY (game_id) REFERENCES Games(game_id)
);

CREATE TABLE Member_Consoles (
	member_id INTEGER NOT NULL,
	console_id INTEGER NOT NULL,
	date_added DATE,
	PRIMARY KEY (member_id, console_id),
	FOREIGN KEY (member_id) REFERENCES Members(member_id),
	FOREIGN KEY (console_id) REFERENCES Consoles(console_id)
);

-- helps to find the purchases made by a member
CREATE INDEX idx_purchases_member
ON Purchases(member_id);

-- display purchase information and member names
CREATE VIEW purchase_summary AS
SELECT
	Purchases.purchase_id,
	Purchases.purchase_date,
	Purchases.member_id,
	Members.first_name,
	Members.last_name,
	Purchases.total_price
FROM Purchases
LEFT JOIN Members
	ON Purchases.member_id = Members.member_id;
