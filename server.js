const express = require('express')
const Database = require('better-sqlite3')
const path = require('path')

const app = express()
const db = new Database(path.join(__dirname, 'game_store.db'))
db.pragma('foreign_keys = ON')

const gamesTable = db.prepare("select name from sqlite_master where name = 'Games'").get()

if (!gamesTable) {
	db.close()
	process.exit(1)
}

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

function cleanPhone(phone) {
	return String(phone || '').replace(/\D/g, '')
}

// get games and their consoless
app.get('/api/games', function (req, res) {
	const games = db.prepare('select Games.game_id, Games.title, Consoles.console_name, Games.current_price, Games.stock_quantity from Games join Consoles on Consoles.console_id = Games.console_id order by Games.title').all()

	res.json(games)
})

// find customers by phone number
app.get('/api/member', function (req, res) {
	const phone = cleanPhone(req.query.phone)

	if (phone.length < 10) {
		return res.status(400).json({ error: 'Enter a phone number with at least 10 digits.' })
	}

	const member = db.prepare('select member_id, first_name, last_name from Members where phone = ?').get(phone)

	res.json({ member: member || null })
})

// add customer
app.post('/api/members', function (req, res) {
	const data = req.body || {}
	const firstName = String(data.first_name || '').trim()
	const lastName = String(data.last_name || '').trim()
	const email = String(data.email || '').trim()
	const phone = cleanPhone(data.phone)

	if (!firstName || !lastName || !email || phone.length < 10) {
		return res.status(400).json({ error: 'Fill in all customer fields and enter a valid phone number.' })
	}

	try {
		db.prepare("insert into Members (first_name, last_name, email, phone, join_date) values (?, ?, ?, ?, date('now'))").run(firstName, lastName, email, phone)

		res.json({ message: 'Customer registered.' })
	} catch (error) {
		res.status(409).json({ error: 'That email or phone number is already registered.' })
	}
})

// save sale and update stock
app.post('/api/checkout', function (req, res) {
	const data = req.body || {}
	const phone = cleanPhone(data.phone)
	const items = data.items

	if (!Array.isArray(items) || items.length === 0) {
		return res.status(400).json({ error: 'Add a game first.' })
	}
	if (data.phone && phone.length < 10) {
		return res.status(400).json({ error: 'Enter a valid phone number.' })
	}

	// save sale and stock changes together since the backend doesn't do it
	const finishSale = db.transaction(function () {
		let member = null

		if (phone) {
			member = db.prepare('select member_id from Members where phone = ?').get(phone)
			if (!member) throw new Error('Customer not found. Register or look up the customer first.')
		}

		const purchase = db.prepare("insert into Purchases (member_id, purchase_date, total_price) values (?, datetime('now', 'localtime'), 0)").run(member ? member.member_id : null)

		let totalCents = 0

		for (const item of items) {
			if (!item) throw new Error('Enter a valid game and quantity.')

			const gameId = Number(item.game_id)
			const quantity = Number(item.quantity)

			if (!Number.isInteger(gameId) || gameId < 1 || !Number.isInteger(quantity) || quantity < 1) {
				throw new Error('Enter a valid game ID and quantity.')
			}

			const game = db.prepare('select title, current_price, stock_quantity from Games where game_id = ?').get(gameId)

			if (!game) throw new Error('Game not found.')
			if (game.stock_quantity < quantity) {
				throw new Error('Not enough stock for ' + game.title + '.')
			}

			db.prepare('insert into Purchase_Items (purchase_id, game_id, quantity, price_at_purchase) values (?, ?, ?, ?)').run(purchase.lastInsertRowid, gameId, quantity, game.current_price)
			db.prepare('update Games set stock_quantity = stock_quantity - ? where game_id = ?').run(quantity, gameId)

			totalCents += Math.round(game.current_price * 100) * quantity
		}

		const total = totalCents / 100
		db.prepare('update Purchases set total_price = ? where purchase_id = ?').run(total, purchase.lastInsertRowid)

		return { purchase_id: purchase.lastInsertRowid, total_price: total }
	})

	try {
		res.json(finishSale())
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

// get customer's past purchases
app.get('/api/purchases', function (req, res) {
	const phone = cleanPhone(req.query.phone)

	if (phone.length < 10) {
		return res.status(400).json({ error: 'Enter a phone number with at least 10 digits.' })
	}

	const purchases = db.prepare("select Purchases.purchase_id, Purchases.purchase_date, Purchases.total_price, group_concat(Games.title || ' x' || Purchase_Items.quantity, ', ') as items from Purchases join Members on Members.member_id = Purchases.member_id join Purchase_Items on Purchase_Items.purchase_id = Purchases.purchase_id join Games on Games.game_id = Purchase_Items.game_id where Members.phone = ? group by Purchases.purchase_id order by Purchases.purchase_date desc").all(phone)

	res.json(purchases)
})

// change game's price
app.post('/api/price', function (req, res) {
	const gameId = Number(req.body.game_id)
	const price = Number(req.body.price)

	if (!Number.isInteger(gameId) || gameId < 1 || !Number.isFinite(price) || price < 0) {
		return res.status(400).json({ error: 'Enter a valid game ID and price.' })
	}

	const result = db.prepare('update Games set current_price = ? where game_id = ?').run(price, gameId)

	if (!result.changes) {
		return res.status(400).json({ error: 'Game not found.' })
	}

	res.json({ message: 'Price updated.' })
})

// get total sales
app.get('/api/sales', function (req, res) {
	const report = db.prepare('select count(*) as purchases, coalesce(sum(total_price), 0) as sales from Purchases').get()

	res.json(report)
})

// get low stock games
app.get('/api/low-stock', function (req, res) {
	const games = db.prepare('select title, stock_quantity from Games where stock_quantity <= 3 order by stock_quantity').all()

	res.json(games)
})

const server = app.listen(3000)

process.on('SIGINT', function () {
	server.close(function () {
		db.close()
	})
})

process.on('SIGTERM', function () {
	server.close(function () {
		db.close()
	})
})
