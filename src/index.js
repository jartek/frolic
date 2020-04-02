const { App, LogLevel } = require('@slack/bolt')

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG
})

const quizId = 1

let currentQuestionForUser
let score = 0

const CRICKET_QUESTIONS =[{
  quiz_id: quizId,
  question_id: 101,
  trigger_question_id: 102,
  question: 'Who has the most number of ducks in the IPL?',
  image_url: '',
  answers: ['harbhajansingh', 'parthivpatel'],
  answer_explanation: ''
}, {
  quiz_id: quizId,
  question_id: 101,
  trigger_question_id: 102,
  question: 'Who has the most number of ducks in the IPL?',
  image_url: '',
  answers: ['harbhajansingh', 'parthivpatel'],
  answer_explanation: ''
}]

const FOOTBALL_QUESTIONS = [{
  quiz_id: quizId,
  question_id: 1,
  trigger_question_id: null,
  question: 'How many clubs based in London played in the first FA premier League in season 1992-93?',
  image_url: '',
  answers: ['6', 'six'],
  answer_explanation: 'The London based clubs were Queens Park Rangers, Tottenham Hotspur, Arsenal, Chelsea, Wimbledon and Crystal Palace.'
}, {
  quiz_id: quizId,
  question_id: 2,
  trigger_question_id: null,
  question: '10 From which country does the excellent attacking midfielder Adam Lallana hail?',
  image_url: 'https://tmssl.akamaized.net//images/foto/normal/adam-lallana-fc-liverpool-1582122503-31995.jpg',
  answers: ['england'],
  answer_explanation: 'With 9 goals and 9 Fantasy assists, Lallana became a key player in the 2013-14 Southampton squad. The club played fluent and fun to watch football and showcased a few other young English talents such as Jay Rodriguez, James Ward-Prowse, Nathaniel Clyne and Luke Shaw. In the summer of 2014 Lallana was transferred from Southampton to Liverpool along with teammates Dejan Lovren and Rickie Lambert.'
}, {
  quiz_id: quizId,
  question_id: 3,
  trigger_question_id: null,
  question: 'Who scored the first ‘perfect hat-trick’ (left foot, right foot, and header) in the Premier League?',
  image_url: '',
  answers: ['jimmyfloydhasselbaink', 'hasselbaink'],
  answer_explanation: ''
}, {
  quiz_id: quizId,
  question_id: 4,
  trigger_question_id: null,
  question: 'Kevin Phillips won the Golden Boot in 1999/2000, who was the next English player to do so?',
  image_url: '',
  answers: ['harrykane', 'kane'],
  answer_explanation: ''
}, {
  quiz_id: quizId,
  question_id: 5,
  trigger_question_id: null,
  question: 'Which team embarrassingly recorded the fewest points ever in a Premier League season?',
  image_url: '',
  answers: ['derbycounty', 'derby'],
  answer_explanation: ''
}, {
  quiz_id: quizId,
  question_id: 6,
  trigger_question_id: null,
  question: 'Who scored the goal that enabled the Republic of Ireland to beat Italy at the 1994 World Cup finals?',
  image_url: '',
  answers: ['rayhoughton', 'houghton'],
  answer_explanation: ''
}]

const imageTemplate = (question) => {
  return {
    type: 'image',
    image_url: question.image_url,
    alt_text: question.question
  }
}

const textQuestionTemplate = (question) => {
  return {
    type: 'section',
    text: {
      type: 'plain_text',
      text: question.question,
      emoji: true
    }
  }
}

const findQuestion = (questionId) => {
  return FOOTBALL_QUESTIONS.find(question => question.question_id === questionId)
}

const buildQuestionBlock = (questionToBeAsked) => {
  const questionTemplate = { blocks: [] }

  if (questionToBeAsked.image_url.length > 0) {
    questionTemplate.blocks.push(imageTemplate(questionToBeAsked))
  }

  questionTemplate.blocks.push(textQuestionTemplate(questionToBeAsked))

  return questionTemplate
}

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

  console.log(action.text)
  currentQuestionForUser = findQuestion(FOOTBALL_QUESTIONS[0].question_id)

  await say(buildQuestionBlock(currentQuestionForUser))
})

app.message(new RegExp(/.*/), async ({ message, say }) => {
  const answer = message.text.toLowerCase().trim()
  // Check if answer is in list of valid question answers
  if (currentQuestionForUser.answers.includes(answer)) {
    score = score + 1
  }
  // Find the next question
  if (currentQuestionForUser.trigger_question_id !== null) {
    const nextQuestion = findQuestion(currentQuestionForUser.trigger_question_id)
    currentQuestionForUser = nextQuestion
    await say(buildQuestionBlock(nextQuestion))
  } else {
    await say(`Your score is ${score}`)
  }
})

;(async () => {
  await app.start(process.env.PORT || 3000)
})()
