import express from 'express';
import responderTeam from '../lib/responderTeam.js';
import { createAutoresponderTeam } from '../lib/autoresponderTeam.js';
import { getClient, getAuthUrl, isAuthenticated, createToken, revokeToken } from '../lib/oauth.js';
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  var authenticated = isAuthenticated();

  if (!authenticated) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.hostname || 'localhost';
    const authRedirectUrl = `${protocol}://${host}`;
    const client = getClient(authRedirectUrl);
    const authUrl = getAuthUrl(client);

    if (req.query.code) {
      await createToken(client, req.query.code);
      authenticated = isAuthenticated();
      return res.redirect(301, '/');
    }
    return res.render('index', { authenticated, authUrl });
  }
  res.render('index', { authenticated });
});

// Process email endpoint
router.post('/process-email', async (req, res) => {
  console.log(req.body);
  const result = await responderTeam.start(req.body);
  if (result.status === 'FINISHED') {
    const resultData = JSON.parse(result.result);
    res.render('email', resultData);
  } else if (result.status === 'BLOCKED') {
    console.log('Workflow is blocked, unable to complete');
    res.send('ERROR: Workflow is blocked, unable to complete')
  }
})

router.get('/autorespond-email', async (req, res) => {
  const autoResponderTeam = await createAutoresponderTeam();
  const result = await autoResponderTeam.start();
  console.log('AUTORESPOND-RESULT:', result.result);
  res.sendStatus(204)
})

router.get('/revoke', (req, res) => {
  revokeToken();
  res.sendStatus(200);
});

export default router;
