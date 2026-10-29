const { google } = require('googleapis');

// Creates a Google Calendar event with a Google Meet link and returns the link.
module.exports = async ({ summary, start, attendees = [], minutes = 30 }) => {
  const oauth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  const calendar = google.calendar({ version: 'v3', auth: oauth });
  const startDate = new Date(start);
  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: new Date(startDate.getTime() + minutes * 60000).toISOString() },
      attendees: attendees.map(email => ({ email })),
      conferenceData: { createRequest: { requestId: `mentor-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    },
  });
  return data.hangoutLink;
};
