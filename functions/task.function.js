const axios = require('axios')

const taskFunctions = {
  createTask: async taskData => {
    return await axios.post(
      'http://localhost:5000/api/tasks/createTask/v1',
      taskData
    )
  },
  viewTaskList: async getTasks => {
    return await axios.post(
      'http://localhost:5000/api/tasks/viewTaskList/v1',
      getTasks
    )
  },
  viewMyTasks: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/viewMyTasks/v1'
    )
    return Tasks
  },
  applyTask: async data => {
    return await axios.post(
      'http://localhost:5000/api/tasks/applyTask/v1',
      data
    )
  },
  acceptApplicant: async data => {
    return await axios.post(
      'http://localhost:5000/api/tasks/acceptApplicant/v1',
      data
    )
  },
  submitTask: async data => {
    return await axios.post(
      'http://localhost:5000/api/tasks/submitTask/v1',
      data
    )
  },
  confirmTask: async data => {
    return await axios.post(
      'http://localhost:5000/api/tasks/confirmTask/v1',
      data
    )
  },
  editTask: async data => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/editTask/v1',
      data
    )
    return Tasks
  },
  sortFilteredTasks: async data => {
    return await axios.post(
      'http://localhost:5000/api/tasks/sortFilteredTasks/v1',
      data
    )
  }
}
module.exports = taskFunctions
