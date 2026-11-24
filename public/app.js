let cart = []

function getElement(id) {
	return document.getElementById(id)
}

// send request to the server
async function request(url, method, data) {
	const options = {
		method: method || 'GET',
		headers: { 'content-type': 'application/json' }
	}

	if (data) {
		options.body = JSON.stringify(data)
	}

	const response = await fetch(url, options)
	const result = await response.json()

	if (!response.ok) {
		throw new Error(result.error)
	}

	return result
}

function showMessage(text) {
	getElement('message').textContent = text
}

// keep game names sanitized for page display
function safeText(text) {
	const span = document.createElement('span')
	span.textContent = text
	return span.innerHTML
}

// put games in the table
async function showGames() {
	const games = await request('/api/games')
	let rows = ''

	for (const game of games) {
		rows += '<tr>'
		rows += '<td>' + game.game_id + '</td>'
		rows += '<td>' + safeText(game.title) + '</td>'
		rows += '<td>' + safeText(game.console_name) + '</td>'
		rows += '<td>$' + Number(game.current_price).toFixed(2) + '</td>'
		rows += '<td>' + game.stock_quantity + '</td>'
		rows += '</tr>'
	}

	getElement('games').innerHTML = rows
}

// look up customers by phone number
async function lookUpCustomer() {
	try {
		const phone = encodeURIComponent(getElement('phone').value)
		const result = await request('/api/member?phone=' + phone)

		if (result.member) {
			getElement('customer-result').textContent =
				result.member.first_name + ' ' + result.member.last_name
		} else {
			getElement('customer-result').textContent = 'Customer not found.'
		}
	} catch (error) {
		showMessage(error.message)
	}
}

// save new customers
async function registerCustomer() {
	try {
		const customer = {
			phone: getElement('phone').value,
			first_name: getElement('first').value,
			last_name: getElement('last').value,
			email: getElement('email').value
		}

		await request('/api/members', 'POST', customer)
		getElement('customer-result').textContent = 'Customer registered.'
	} catch (error) {
		showMessage(error.message)
	}
}

// add games to a sale
function addGame() {
	const game = {
		game_id: getElement('game-id').value,
		quantity: getElement('quantity').value
	}

	cart.push(game)

	let text = ''
	for (const item of cart) {
		if (text !== '') {
			text += ', '
		}
		text += 'Game ' + item.game_id + ' x ' + item.quantity
	}
	getElement('cart').textContent = text
}

// save a sale and show the total
async function completeSale() {
	try {
		const saleInfo = {
			phone: getElement('phone').value,
			items: cart
		}
		const sale = await request('/api/checkout', 'POST', saleInfo)

		cart = []
		getElement('cart').textContent = ''
		showMessage('Sale complete. Total: $' + sale.total_price.toFixed(2))
		await showGames()
	} catch (error) {
		showMessage(error.message)
	}
}

// show customer's past purchases
async function showPurchaseHistory() {
	try {
		const phone = encodeURIComponent(getElement('phone').value)
		const purchases = await request('/api/purchases?phone=' + phone)
		let text = ''

		for (const purchase of purchases) {
			text += 'Sale ' + purchase.purchase_id + ', $'
			text += Number(purchase.total_price).toFixed(2) + ', '
			text += purchase.items + '\n'
		}

		if (text === '') {
			text = 'No purchases found.'
		}
		getElement('history-result').textContent = text
	} catch (error) {
		showMessage(error.message)
	}
}

// update price of a game
async function savePrice() {
	try {
		const priceInfo = {
			game_id: getElement('price-game-id').value,
			price: getElement('new-price').value
		}

		await request('/api/price', 'POST', priceInfo)
		showMessage('Price updated.')
		await showGames()
	} catch (error) {
		showMessage(error.message)
	}
}

// show total sales
async function showSalesReport() {
	try {
		const report = await request('/api/sales')
		const text = 'Purchases: ' + report.purchases +
			'. Total sales: $' + Number(report.sales).toFixed(2)
		getElement('report-result').textContent = text
	} catch (error) {
		showMessage(error.message)
	}
}

// show games with low stock count
async function showLowStock() {
	try {
		const games = await request('/api/low-stock')
		let text = ''

		for (const game of games) {
			text += game.title + ': ' + game.stock_quantity + '\n'
		}

		if (text === '') {
			text = 'No games are low on stock.'
		}
		getElement('report-result').textContent = text
	} catch (error) {
		showMessage(error.message)
	}
}

getElement('lookup').onclick = lookUpCustomer
getElement('register').onclick = registerCustomer
getElement('add').onclick = addGame
getElement('checkout').onclick = completeSale
getElement('history').onclick = showPurchaseHistory
getElement('save-price').onclick = savePrice
getElement('sales-report').onclick = showSalesReport
getElement('stock-report').onclick = showLowStock
getElement('refresh').onclick = showGames

// show a message if games do not load and accompanying error
function showLoadError(error) {
	showMessage(error.message)
}

showGames().catch(showLoadError)
