const { App, LogLevel } = require('@slack/bolt')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
})

app.command('/frolic', async ({ command, ack, say }) => {
  await ack()

  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Do you want to frolic?'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            action_id: 'start_frolic',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Yes'
            },
            style: 'primary',
            value: 'yes'
          },
          {
            type: 'button',
            action_id: 'uninterested',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'No'
            },
            style: 'danger',
            value: 'no'
          }
        ]
      }
    ]
  })
})

app.action('start_frolic', async ({ action, ack, say }) => {
  await ack()

  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Select a theme'
        },
        accessory: {
          action_id: 'theme_selected',
          type: 'static_select',
          options: [
            {
              text: {
                type: 'plain_text',
                text: 'Football',
                emoji: true
              },
              value: 'football'
            },
            {
              text: {
                type: 'plain_text',
                text: 'Cricket',
                emoji: true
              },
              value: 'cricket'
            }
          ]
        }
      }
    ]
  })
})

app.action('theme_selected', async ({ action, ack, say }) => {
  await ack()
  console.log(action)
  await say(action.value)
})

;(async () => {
  await app.start(process.env.PORT || 3000)
})()
