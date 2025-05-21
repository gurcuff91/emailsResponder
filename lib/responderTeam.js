import dotenv from 'dotenv';
import { Agent, Task, Team } from 'kaibanjs';

dotenv.config();

const analystAgent = new Agent({
    name: 'analyst',
    role: 'Emails analyst agent',
    background: 'You are a specialist categorizing emails.',
    goal: `Categorize emails.`
})

const responderAgent = new Agent({
    name: 'responder',
    role: 'Emails responder agent',
    background: 'You are a specialist responding emails.',
    goal: `Respond emails.`
})

const resumerAgent = new Agent({
    name: 'resumer',
    role: 'Create JSON resumes',
    background: 'You are a specialist creating JSON resumes.',
    goal: `Create JSON resumes.`
})


const responderTeam = new Team({
    name: 'Email Responder Team',
    agents: [analystAgent, responderAgent, resumerAgent],
    tasks: [
        new Task({
            referenceId: 'categorizationTask',
            description: `Categorize the email according the email subject: {subject} and 
                          email body: {body}, using the following categories: 
                          Sentiment (Positive, Negative, Neutral), 
                          Intent ( Support Request, Feedback, Sales Inquiry) and 
                          Area (Product, Billing, Technical)`,
            expectedOutput: 'A JSON with the following keys: {sentiment: <sentiment>, intent: <intent>, area: <area>}',
            agent: analystAgent,
        }),
        new Task({
            referenceId: 'responderTask',
            description: `Reply to the email: {subject} {body}`,
            expectedOutput: 'Concise and professional email response',
            agent: responderAgent,
        }),
        new Task({
            referenceIid: 'resumeTask',
            dependencies: ['categorizationTask', 'responderTask'],
            description: `Generate a JSON resume with email categorization: {taskResult:task1} and 
                        reply: {taskResult:task2}`,
            expectedOutput: 'A JSON with the following keys: {categorization: <categorization>, reply: <reply>}',
            agent: resumerAgent,
        })
    ],
    env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY }
})

export default responderTeam;