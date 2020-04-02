# Frolic

```mermaid
sequenceDiagram
    User ->> Channel: Type /frolic start
    Channel ->> FrolicApp: Start quiz for all users in the channel
    FrolicApp ->> FrolicApp: Create a quiz room for that org
    FrolicApp ->> User: Ask for a theme?
    User ->> FrolicApp: Select a theme
    FrolicApp ->> User: How many Questions?
    User ->> FrolicApp: 5 questions
    FrolicApp ->> FrolicApp: Select questions for quiz based on params
    FrolicApp ->> Slack: Inform All users that quiz is starting
    Slack ->> FrolicBot: Send messages to everyone
    FrolicBot ->> User: Hey do you want to take part in the quiz (Yes/No)
    User ->> FrolicBot: Selects yes
    FrolicBot ->> FrolicApp: Add him to a "quiz room" for that channel
    FrolicBot ->> User: Quiz is starting in 5 minutes?
    loop Quiz
      FrolicApp ->> FrolicBot: Send Question?
      FrolicBot ->> User: Display the question in the User <> Bot chat
      User ->> FrolicBot: Type Answer
      FrolicBot ->> FrolicApp: Record Answer
    end
    FrolicApp ->> Slack: Display results in the channel
    Slack ->> Channel: Show scores
```
