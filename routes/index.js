var express = require('express');
var router = express.Router();
const { responderTeam } = require('../lib/responderTeam')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;
