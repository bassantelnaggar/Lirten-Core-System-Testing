const userFunctions = require('./functions/user.function')
const taskFunctions = require('./functions/task.function')
const meetingFunctions = require('./functions/meeting.function')

test('Get all users', async done => {
  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(24)
  done()
})

test('User should be able to signin after the signup', async done => {
  const createNewUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo123',
      email: 'boo@boo.boo',
      password: 'password'
    }
  })
  expect(createNewUser.data.header.statusCode).toEqual('0000')
  done()
})
