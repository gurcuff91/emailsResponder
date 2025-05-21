import { GmailSearch, GmailSendMessage } from '@langchain/community/tools/gmail';
import { getAuthenticatedClient } from './oauth.js';

async function getAuthForTool() {
    const client = await getAuthenticatedClient();
    return {
        credentials: {
            accessToken: client.credentials.access_token,
        },
        scopes: [client.credentials.scope]
    }
}

export async function createEmailSearchTool() {
    const auth = await getAuthForTool();
    return new GmailSearch(auth);
}

export async function createEmailSendTool() {
    const auth = await getAuthForTool();
    return new GmailSendMessage(auth);
}