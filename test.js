const functions = require('./fn')

test('get all users ', async done => {
  const response = await functions.getUsers()
  expect(response.data.body.user.length).toBe(24)
  done()
})
