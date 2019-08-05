const axios = require('axios')

const meetingFunctions = {
  createMeeting: async () => {
    const Meetings = await axios.post(
      'http://localhost:5000/api/meetings/createMeeting/v1'
    )
    return Meetings
  },
  editMeeting: async () => {
    const Meetings = await axios.post(
      'http://localhost:5000/api/meetings/editMeeting/v1'
    )
    return Meetings
  },
  confirmAttending: async () => {
    const Meetings = await axios.post(
      'http://localhost:5000/api/meetings/confirmAttending/v1'
    )
    return Meetings
  }
}
module.exports = meetingFunctions
