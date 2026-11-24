# Game Store Register

## Project Overview
The Game Store Register is an application tailered to game stores that allows for the tracking of sales, game stock, and sales reports. This aids in the operation of a game store, allowing stores to keep track of users and sales.

## Intended Users
The intended users for this program are game stores and their cashiers and managers, who would utilize the customer purchases features to track purchases as well the inventory features that keep track of stock of games and the reports that gauge game sales and overall sales.

## How to Run
This application runs on SQLite with Node.js, Express, and better-sqlite3. 

1. Install Node.js 22 or newer.
2. Open this folder in PowerShell.
3. Run `npm install`; this installs the npm dependencies. 
4. Run `npm run setup` to make the test database, running it again resets back to the test database. The database is a local file and requires no passwords or credentials to use. This runs schema.sql then insert_data.sql in that order.
5. Run `npm start`. This starts the web application.
6. Open `http://localhost:3000` in your browser.
7. Press Ctrl+C to stop the app.

Run `npm run setup` again to reset the database to the sample data. The program is made with javascript and HTML primarily.

The app uses Express to run the website and SQLite to save the data. The database file is `game_store.db` in this folder.

## What the Page Can Do

- Show games, prices, stock, and consoles.
- Find customers by phone or register a new customer.
- Add games to a sale and check out.
- Show a customer's purchase history.
- Change a game's price.
- Show total sales and low stock.

## Known Limitations

The program does not currently keep track of the consoles owned by each client.
