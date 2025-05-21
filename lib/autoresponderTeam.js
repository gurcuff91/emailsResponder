import { Agent, Team, Task } from 'kaibanjs';
import { createEmailSearchTool, createEmailSendTool } from './tools.js';
import dotenv from 'dotenv';

dotenv.config();

export async function createAutoresponderTeam() {
    const emailSearchAgent = new Agent({
        name: 'emailSearchAgent',
        role: 'Search agent',
        background: 'You are a specialist searching for emails.',
        goal: `Search for emails.`,
        tools: [await createEmailSearchTool()]
    })

    const emailResponderAgent = new Agent({
        name: 'emailResponderAgent',
        role: 'Responder agent',
        background: 'You are a specialist responding to emails.',
        goal: `Respond to emails.`
    })

    const emailSenderAgent = new Agent({
        name: 'emailSenderAgent',
        role: 'Email Response Sender',
        background: 'You are a specialist at sending email responses.',
        goal: 'Send email responses to users.',
        tools: [await createEmailSendTool()]
    });

    const autoResponderTeam = new Team({
        name: 'autoEmailResponderTeam',
        description: 'A team of agents that can automatically respond to emails.',
        agents: [emailSearchAgent, emailResponderAgent, emailSenderAgent],
        tasks: [
            new Task({
                name: 'emailSearchTask',
                description: 'Search for the latest unread email.',
                expectedOutput: `
                A JSON object with the following information:
                 - Email id (id)
                 - Email subject (subject)
                 - Email body [only plain text] (body)
                 - Email sender [only email address] (sender)
            
                Example:
                {
                    "id": "1234567890",
                    "subject": "Hello, world!",
                    "body": "This is a test email.",
                    "sender": "test@example.com"
                }
            
                if you don't find any email, return an empty object:
                {}
                `,
                agent: emailSearchAgent,
            }),
            new Task({
                name: 'emailResponderTask',
                description: `Generate a response to the email based on the email subject and email body.`,
                expectedOutput: `
                A JSON with the following information:
                 - Response (response) [only plain text]
            
                Example:
                {
                    "response": "Thank you for your feedback. We will review it and get back to you soon."
                }`,
                agent: emailResponderAgent,
            }),
            new Task({
                name: 'emailSendTask',
                description: 'Send an email response to a user.',
                expectedOutput: `
                A JSON with the following information:
                 - Status (status) [success, failed]
                 - Message ID (messageId)
            
                Example:
                {
                    "status": "success",
                    "messageId": "1234567890"
                }
                `,
                agent: emailSenderAgent
            })
        ],
        env: { OPENAI_API_KEY: process.env.OPENAI_API_KEY },
        logLevel: 'info'
    })

    return autoResponderTeam;
}