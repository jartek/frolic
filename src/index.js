const { App } = require('@slack/bolt')

const questions = [
  {
    text: '',
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
    await app.client.views.publish({
      token: process.env.SLACK_BOT_TOKEN,
      view: {
        type: 'home',
        callback_id: 'home_view',
        user_id: command.user_id,
        blocks: [
          {
            type: 'image',
            title: {
              type: 'plain_text',
              text: 'Example Image',
              emoji: true
            },
            image_url: questions[0],
            alt_text: 'Example Image'
          }
        ]
      }
    })
  } catch (error) {
    console.error(error)
  }
});

(async () => {
  await app.start(process.env.PORT || 3000)
})()
