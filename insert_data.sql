PRAGMA foreign_keys = ON;

INSERT INTO Members (member_id, first_name, last_name, email, phone, join_date) VALUES
	(1, 'Mike', 'Smith', 'mikesmith@gmail.com', '2027384916', '2026-01-08'),
	(2, 'John', 'Smith', 'johnsmith@hotmail.com', '2024918273', '2026-01-08'),
	(3, 'Mike', 'Brown', 'mikebrown@aol.com', NULL, '2026-02-03'),
	(4, 'John', 'Brown', 'johnbrown@gmail.com', '2028631924', '2026-02-06'),
	(5, 'Mike', 'Jones', 'mikejones@hotmail.com', '2026273841', '2026-02-06'),
	(6, 'Steve', 'Smith', 'stevesmith@gmail.com', NULL, '2026-03-12');

INSERT INTO Consoles (console_id, console_name, manufacturer) VALUES
	(1, 'PlayStation 5', 'Sony'),
	(2, 'Xbox Series X', 'Microsoft'),
	(3, 'Nintendo Switch', 'Nintendo'),
	(4, 'PlayStation 4', 'Sony');

INSERT INTO Games (game_id, console_id, title, description, current_price, stock_quantity) VALUES
	(1, 1, 'Madden NFL', 'Football game', 25.00, 7),
	(2, 1, 'Call of Duty: Modern Warfare III', 'Shooting game', 15.00, 3),
	(3, 2, 'Minecraft', 'Building game', 40.00, 22),
	(4, 3, 'Mario Kart 8 Deluxe', 'Racing game', 60.00, 7),
	(5, 3, 'Super Mario Odyssey', 'Mario game', 50.00, 4),
	(6, 4, 'Grand Theft Auto V', 'Action game', 10.00, 13),
	(7, 2, 'Halo Infinite', 'Shooting game', 20.00, 0),
	(8, 1, 'EA Sports', 'Soccer game', 30.00, 6),
	(9, 2, 'EA Sports', 'Soccer game', 30.00, 3),
	(10, 3, 'Animal Crossing', 'Island game', 15.00, 16),
	(11, 4, 'Minecraft', 'Building game', 10.00, 7),
	(12, 1, 'NBA 2K', 'Basketball game', 35.00, 2);

INSERT INTO Member_Consoles (member_id, console_id, date_added) VALUES
	(1, 1, '2026-01-08'),
	(1, 3, '2026-01-08'),
	(2, 1, '2026-01-08'),
	(2, 2, '2026-01-15'),
	(2, 4, '2026-01-15'),
	(3, 2, '2026-02-03'),
	(3, 3, '2026-02-03'),
	(4, 1, '2026-02-06'),
	(4, 4, '2026-02-06'),
	(5, 3, '2026-02-06'),
	(5, 4, '2026-03-02');

-- NULL member_id -> customer is not a member
INSERT INTO Purchases (purchase_id, member_id, purchase_date, total_price) VALUES
	(1, 1, '2026-04-02 13:12:00', 40.00),
	(2, 2, '2026-04-02 13:40:00', 80.00),
	(3, 3, '2026-04-07 16:05:00', 110.00),
	(4, NULL, '2026-04-07 16:11:00', 15.00),
	(5, 4, '2026-04-09 11:23:00', 25.00),
	(6, 1, '2026-04-09 15:02:00', 55.00),
	(7, 5, '2026-05-03 12:17:00', 70.00),
	(8, NULL, '2026-05-03 12:30:00', 30.00),
	(9, 2, '2026-05-11 17:06:00', 55.00),
	(10, 4, '2026-05-14 14:38:00', 30.00);

-- prices can differ from current game prices
INSERT INTO Purchase_Items (purchase_id, game_id, quantity, price_at_purchase) VALUES
	(1, 1, 1, 25.00),
	(1, 2, 1, 15.00),
	(2, 3, 2, 40.00),
	(3, 4, 1, 60.00),
	(3, 5, 1, 50.00),
	(4, 10, 1, 15.00),
	(5, 2, 1, 15.00),
	(5, 6, 1, 10.00),
	(6, 1, 1, 25.00),
	(6, 8, 1, 30.00),
	(7, 10, 2, 15.00),
	(7, 5, 1, 40.00),
	(8, 9, 1, 30.00),
	(9, 7, 1, 30.00),
	(9, 3, 1, 25.00),
	(10, 11, 1, 10.00),
	(10, 8, 1, 20.00);