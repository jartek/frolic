const { App } = require('@slack/bolt')

const questions = [
  {
    text: 'Question text',
    image_url: 'https://resources.premierleague.com/photos/2020/03/13/ea2ae5c3-f75b-4681-b9d0-d7ef0126b0e9/Statement_Graphic_PL_FA_EFL_Lilac.png?width=930&height=620'
  }
]

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

app.command('/frolic', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack()

  try {
    await say({
      blocks: [{
        type: 'image',
        image_url: questions[0].image_url,
        alt_text: questions[0].text
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: questions[0].text
        }
      }]
    })
  } catch (error) {
    console.error(error)
  }
})

app.message('*', async ({ message, say }) => {
  await say('You\'re right!')
});

(async () => {
  await app.start(process.env.PORT || 3000)
})()
