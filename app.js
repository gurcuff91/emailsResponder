import { emailReplyTeam } from './lib/emailsResponder.js';

// Crea eamil processor function
// This function will be used to process the emails and generate the reports
async function emailProcessor(input) {
    const result = await emailReplyTeam.start(input);
    if (result.status === 'FINISHED') {
        return JSON.parse(result.result)
    } else if (result.status === 'BLOCKED') {
        console.log('Workflow is blocked, unable to complete');
    }
}

// Test the email processor function with some sample emails
[
    {
        subject: "Feedback on New Feature",
        body: "Hi Team,\nI love the new feature! It has made my work so much easier.\n\nBest,\nJohn"
    },
    {
        subject: "Bug Report: App Crash",
        body: "Hello,\nThe app crashes when I try to open it. Please fix this ASAP.\n\nThanks,\nSarah"
    },
    {
        subject: "Inquiry about Subscription Plans",
        body: "Hi,\nCan you provide more details about your subscription plans? I'm interested in upgrading.\n\nRegards,\nMike"
    }
].forEach((email) => {
    emailProcessor(email).then((res) => {
        console.log('-------------------------');
        console.log('-- Processing Email... --');
        console.log('-------------------------');
        console.log(`Subject: ${email.subject}`);
        console.log(`Body: ${email.body}`);
        console.log('--------------------------------');
        if (res === undefined) {
            console.log('No response from email processor');
            return;
        }
        console.log('Email processed successfully:');
        console.log('--------------------------------');
        console.log('Categorization:', res.categorization);
        console.log('Reply:', res.reply);
        console.log('****************************************************');
    }
    ).catch((err) => {
        console.log('Error processing email');
        console.log(err);
        console.log('****************************************************');
    });
})

