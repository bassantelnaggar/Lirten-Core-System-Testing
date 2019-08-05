const axios = require('axios')

const userFunctions = {
  getUsers: async () => {
    return await axios.post('http://localhost:5000/api/users/get/v1')
  },
  createUser: async newUser => {
    return await axios.post(
      'http://localhost:5000/api/users/signup/v1',
      newUser
    )
  },
  signin: async userInfo => {
    const Users = await axios.post(
      'http://localhost:5000/api/users/signin/v1',
      userInfo
    )
    Users
  },
  suspendUser: async () => {
    const Users = await axios.post(
      'http://localhost:5000/api/users/suspendUser/v1'
    )
    return Users
  },
  unsuspendUser: async () => {
    const Users = await axios.post(
      'http://localhost:5000/api/users/suspendUser/v1'
    )
    return Users
  }
}
module.exports = userFunctions
