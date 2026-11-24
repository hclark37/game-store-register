PRAGMA foreign_keys = ON;

-- 1. Filtering and Sorting
-- shows games currently in stock sorted lowest to highest 
SELECT title, current_price, stock_quantity FROM Games WHERE stock_quantity > 0 ORDER BY current_price;

-- 2. INNER JOIN
-- shows games with their console
SELECT Games.title, Consoles.console_name FROM Games
INNER JOIN Consoles
	ON Games.console_id = Consoles.console_id;

-- 3. LEFT JOIN
-- shows purchases including memberless
SELECT Purchases.purchase_id, Members.first_name, Members.last_name, Purchases.total_price FROM Purchases
LEFT JOIN Members
	ON Purchases.member_id = Members.member_id;

-- 4. Three-Table Join
-- shows games and quantities in each purchase
SELECT Purchases.purchase_id, Games.title, Purchase_Items.quantity FROM Purchases
INNER JOIN Purchase_Items
	ON Purchases.purchase_id = Purchase_Items.purchase_id
INNER JOIN Games
	ON Purchase_Items.game_id = Games.game_id;

-- 5. Aggregate Query
-- shows average total
SELECT AVG(total_price) AS average_purchase_total FROM Purchases;

-- 6. GROUP BY and HAVING
-- shows members with more than one purchase
SELECT Members.first_name, Members.last_name, COUNT(Purchases.purchase_id) AS purchase_count FROM Members
INNER JOIN Purchases
	ON Members.member_id = Purchases.member_id
GROUP BY Members.member_id HAVING COUNT(Purchases.purchase_id) > 1;

-- 7. Subquery
-- shows games costing more than average price
SELECT title, current_price FROM Games
WHERE current_price > (
	SELECT AVG(current_price)
	FROM Games
);

-- 8. Set Operation
-- shows consoles owned by members or that have games currently in stock
SELECT console_id FROM Member_Consoles
UNION
SELECT console_id FROM Games WHERE stock_quantity > 0;

-- 9. View
-- show purchases with member names via purchase summary view
SELECT purchase_id, purchase_date, first_name, last_name, total_price FROM purchase_summary ORDER BY purchase_date;
