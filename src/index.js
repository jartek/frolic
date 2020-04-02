const { App } = require('@slack/bolt');
debugger
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('app_home_opened', ({ event, say }) => {
  say(`Hello world, <@${event.user}>!`);
});

app.command('/frolic', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say("Should this start?");
});

(async () => {
  await app.start(process.env.PORT || 3000);
})();
