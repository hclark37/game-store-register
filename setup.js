const Database = require('better-sqlite3')
const fs = require('fs')
const path = require('path')

const databasePath = path.join(__dirname, 'game_store.db')
const db = new Database(databasePath)

try {
	db.pragma('foreign_keys = ON')

	const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
	const sampleData = fs.readFileSync(path.join(__dirname, 'insert_data.sql'), 'utf8')

	db.exec(schema)
	db.exec(sampleData)

} catch (error) {
	process.exitCode = 1
} finally {
	db.close()
}
