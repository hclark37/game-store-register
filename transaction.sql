PRAGMA foreign_keys = ON;

BEGIN;

INSERT INTO Purchases (purchase_id, member_id, purchase_date, total_price) VALUES (11, 1, '2026-05-20 12:00:00', 40.00);

INSERT INTO Purchase_Items (purchase_id, game_id, quantity, price_at_purchase) VALUES
	(11, 1, 1, 25.00),
	(11, 2, 1, 15.00);

UPDATE Games SET stock_quantity = stock_quantity - 1 WHERE game_id IN (1, 2);

ROLLBACK;
