const userFunctions = require('./functions/user.function')
const taskFunctions = require('./functions/task.function')
const meetingFunctions = require('./functions/meeting.function')
const pg = require('pg')
const connectionString = 'postgres://username:password@localhost:5432/dbname'
const client = new pg.Client(connectionString)
client.connect()

beforeAll(async done => {
  await client
    .query(`DELETE FROM TASKMEETINGS `)
    .then(
      async () =>
        await client
          .query(`DELETE FROM MEETINGS`)
          .then(
            async () =>
              await client
                .query(`DELETE FROM TASKPROPOSALS`)
                .then(
                  async () =>
                    await client
                      .query(`DELETE FROM TASKS`)
                      .then(
                        async () => await client.query(`DELETE FROM USERS `)
                      )
                )
          )
    )
  done()
})

test('User should be able to signin after the signup', async done => {
  await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo1',
      email: 'boo1@boo.boo',
      password: 'password'
    }
  })

  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(1)

  const signinUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo1@boo.boo',
      password: 'password'
    }
  })
  expect(signinUser.data.header.statusCode).toEqual('0000')
  done()
})

test('Suspended user should not be able to signin or create a task', async done => {
  const createUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo12',
      email: 'boo12@boo.boo',
      password: 'password'
    }
  })
  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(2)

  await userFunctions.suspendUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      userId: createUser.data.body.user[0].id,
      status: true
    }
  })

  const signinUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo12@boo.boo',
      password: 'password'
    }
  })
  expect(signinUser.data.header.statusCode).toEqual('0106')

  const createTask = await taskFunctions.createTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskName: 'Task Testing',
      taskOwner: createUser.data.body.user[0].id,
      deadline: '2019-11-28 01:53:30'
    }
  })

  expect(createTask.data.header.statusCode).toEqual('0106')

  const taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task.length).toBe(0)

  done()
})

test('Suspended User should not be able to apply on a task', async done => {
  const createUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo123',
      email: 'boo123@boo.boo',
      password: 'password'
    }
  })
  const userResponse = await userFunctions.getUsers()
  expect(userResponse.data.body.user.length).toBe(3)

  const signinUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo123@boo.boo',
      password: 'password'
    }
  })
  expect(signinUser.data.header.statusCode).toEqual('0000')

  const createTask = await taskFunctions.createTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskName: 'Task Testing',
      taskOwner: createUser.data.body.user[0].id,
      deadline: '2019-11-28 01:53:30'
    }
  })

  let taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task.length).toBe(1)

  const appliedUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo1234',
      email: 'boo1234@boo.boo',
      password: 'password'
    }
  })
  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(4)

  await userFunctions.suspendUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      userId: appliedUser.data.body.user[0].id,
      status: true
    }
  })

  const applyTask = await taskFunctions.applyTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      applicantId: appliedUser.data.body.user[0].id
    }
  })
  expect(applyTask.data.header.statusCode).toEqual('0106')
  done()
})

test('Users should be able to create/apply/accept/submit/confirm a task and create/confirm a meeting after the sign up ', async done => {
  const createUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo12345',
      email: 'boo12345@boo.boo',
      password: 'password'
    }
  })
  const userResponse = await userFunctions.getUsers()
  expect(userResponse.data.body.user.length).toBe(5)

  const signinUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo12345@boo.boo',
      password: 'password'
    }
  })
  expect(signinUser.data.header.statusCode).toEqual('0000')

  const createTask = await taskFunctions.createTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskName: 'Task Testing',
      taskOwner: createUser.data.body.user[0].id,
      deadline: '2019-11-28 01:53:30'
    }
  })

  let taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task.length).toBe(2)

  const appliedUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'Boo123456',
      email: 'boo123456@boo.boo',
      password: 'password'
    }
  })

  const response = await userFunctions.getUsers()
  expect(response.data.body.user.length).toBe(6)

  const signinAppliedUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo123456@boo.boo',
      password: 'password'
    }
  })
  expect(signinAppliedUser.data.header.statusCode).toEqual('0000')

  const applyTask = await taskFunctions.applyTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      applicantId: appliedUser.data.body.user[0].id
    }
  })
  expect(applyTask.data.header.statusCode).toEqual('0000')

  let taskOwnerSignIn = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo12345@boo.boo',
      password: 'password'
    }
  })
  expect(taskOwnerSignIn.data.header.statusCode).toEqual('0000')

  const acceptApplicant = await taskFunctions.acceptApplicant({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      applicantId: appliedUser.data.body.user[0].id
    }
  })
  expect(acceptApplicant.data.header.statusCode).toEqual('0000')

  taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })

  expect(taskResponse.data.body.task[1].accepted_applicant).toBe(
    appliedUser.data.body.user[0].id
  )

  const createMeeting = await meetingFunctions.createMeeting({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      meetingTitle: 'Meeting testing',
      location: 'Maadi',
      date: '2019-08-30',
      organizer: createUser.data.body.user[0].id,
      userTasks: [
        {
          taskId: createTask.data.body.task[0].id,
          attendeeId: appliedUser.data.body.user[0].id
        }
      ]
    }
  })

  expect(createMeeting.data.header.statusCode).toEqual('0000')
  let meetingResponse = await meetingFunctions.getMeeting()
  expect(meetingResponse.data.body.meeting.length).toBe(1)

  const acceptedApplicantSignin = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo123456@boo.boo',
      password: 'password'
    }
  })
  expect(acceptedApplicantSignin.data.header.statusCode).toEqual('0000')

  const confirmAttending = await meetingFunctions.confirmAttending({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      meetingId: createMeeting.data.body.meeting[0].meeting_id,
      attendeeId: appliedUser.data.body.user[0].id,
      confirmed: true
    }
  })

  expect(confirmAttending.data.header.statusCode).toEqual('0000')
  meetingResponse = await meetingFunctions.getMeeting()
  expect(meetingResponse.data.body.meeting[0].confirmed).toBe(true)

  const submitTask = await taskFunctions.submitTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      acceptedApplicant: appliedUser.data.body.user[0].id,
      submission: 'Strongest Avenger'
    }
  })
  expect(submitTask.data.header.statusCode).toEqual('0000')

  taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task[1].submission).toBe('Strongest Avenger')

  const taskOwnerConfirmSignIn = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo12345@boo.boo',
      password: 'password'
    }
  })
  expect(taskOwnerConfirmSignIn.data.header.statusCode).toEqual('0000')

  const confirmTask = await taskFunctions.confirmTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      confirmed: true
    }
  })
  expect(confirmTask.data.header.statusCode).toEqual('0000')
  taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task[1].confirmed).toBe(true)

  done()
})

test('User should be able to create and edit a task/Meeting', async done => {
  const createUser = await userFunctions.createUser({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      username: 'boo1234567',
      email: 'boo1234567@boo.boo',
      password: 'password'
    }
  })
  const userResponse = await userFunctions.getUsers()
  expect(userResponse.data.body.user.length).toBe(7)

  const signinUser = await userFunctions.signin({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      email: 'boo1234567@boo.boo',
      password: 'password'
    }
  })
  expect(signinUser.data.header.statusCode).toEqual('0000')

  const createTask = await taskFunctions.createTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskName: 'Task Testing',
      taskOwner: createUser.data.body.user[0].id,
      deadline: '2019-11-28 01:53:30'
    }
  })

  let taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task.length).toBe(3)

  await taskFunctions.editTask({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      taskId: createTask.data.body.task[0].id,
      dataToEdit: [['taskName', 'Core System']]
    }
  })
  taskResponse = await taskFunctions.viewTaskList({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      page: 0,
      limit: 5
    }
  })
  expect(taskResponse.data.body.task[2].task_name).toBe('Core System')

  const createMeeting = await meetingFunctions.createMeeting({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      meetingTitle: 'Meeting testing',
      location: 'Maadi',
      date: '2019-08-30',
      organizer: createUser.data.body.user[0].id,
      userTasks: [
        {
          taskId: createTask.data.body.task[0].id,
          attendeeId: createUser.data.body.user[0].id
        }
      ]
    }
  })

  expect(createMeeting.data.header.statusCode).toEqual('0000')
  let meetingResponse = await meetingFunctions.getMeeting()
  expect(meetingResponse.data.body.meeting.length).toBe(2)

  await meetingFunctions.editMeeting({
    header: {
      channel: 'web',
      timestamp: '2019-07-30 01:53:30',
      requestId: 'A-123'
    },
    body: {
      meetingId: createMeeting.data.body.meeting[0].meeting_id,
      dataToEdit: [['meeting_title', 'Core System Testing']]
    }
  })
  meetingResponse = await meetingFunctions.getMeeting()
  expect(meetingResponse.data.body.meeting[1].meeting_title).toBe(
    'Core System Testing'
  )

  done()
})
