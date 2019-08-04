const axios = require('axios')

const functions = {
  getUsers: async () => {
    const Users = await axios.post('http://localhost:5000/api/users/get/v1')
    return Users
  }
}
module.exports = functions
