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
    return await axios.post(
      'http://localhost:5000/api/users/signin/v1',
      userInfo
    )
  },
  suspendUser: async data => {
    return await axios.post(
      'http://localhost:5000/api/users/suspendUser/v1',
      data
    )
  },
  unsuspendUser: async data => {
    return await axios.post(
      'http://localhost:5000/api/users/suspendUser/v1',
      data
    )
  }
}
module.exports = userFunctions
