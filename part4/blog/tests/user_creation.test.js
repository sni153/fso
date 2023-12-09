const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./user_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('User Creation Error Handling', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		const user = new User({ username: 'root', password: 'root' })
		await user.save()
	})

	test('with invalid username', async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'ch',
			name: 'Steph Curry',
			password: 'warriors',
		}
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})

	test('with invalid password', async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'saltman',
			name: 'Sam Altman',
			password: 'pw',
		}
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd.length).toBe(usersAtStart.length)
	})
})

afterAll(() => {
	mongoose.connection.close()
}) 