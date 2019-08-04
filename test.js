const userFunctions = require('./functions/user.function')
const taskFunctions = require('./functions/task.function')
const meetingFunctions = require('./functions/meeting.function')

test('Get all users', async done => {
  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(24)
  done()
})
