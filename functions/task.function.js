const axios = require('axios')

const taskFunctions = {
  createTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/createTask/v1'
    )
    return Tasks
  },
  viewTaskList: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/viewTaskList/v1'
    )
    return Tasks
  },
  viewMyTasks: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/viewMyTasks/v1'
    )
    return Tasks
  },
  freezeTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/freezeTask/v1'
    )
    return Tasks
  },
  unfreezeTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/freezeTask/v1'
    )
    return Tasks
  },
  applyTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/applyTask/v1'
    )
    return Tasks
  },
  acceptApplicant: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/acceptApplicant/v1'
    )
    return Tasks
  },
  submitTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/submitTask/v1'
    )
    return Tasks
  },
  confirmTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/confirmTask/v1'
    )
    return Tasks
  },
  editTask: async () => {
    const Tasks = await axios.post(
      'http://localhost:5000/api/tasks/editTask/v1'
    )
    return Tasks
  },
  sortFilteredTasks: async () => {
    const Users = await axios.post(
      'http://localhost:5000/api/tasks/sortFilteredTasks/v1'
    )
    return Tasks
  }
}
module.exports = taskFunctions
