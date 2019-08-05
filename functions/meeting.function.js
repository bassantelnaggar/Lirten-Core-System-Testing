const axios = require('axios')

const meetingFunctions = {
  getMeeting: async () => {
    return await axios.post('http://localhost:5000/api/meetings/get/v1')
  },
  createMeeting: async data => {
    return await axios.post(
      'http://localhost:5000/api/meetings/createMeeting/v1',
      data
    )
  },
  editMeeting: async data => {
    return await axios.post(
      'http://localhost:5000/api/meetings/editMeeting/v1',
      data
    )
  },
  confirmAttending: async data => {
    return await axios.post(
      'http://localhost:5000/api/meetings/confirmAttending/v1',
      data
    )
  }
}
module.exports = meetingFunctions
