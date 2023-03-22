const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const port = 3099

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let hookUrl
const requests = [];

// Start the cloudflared tunnel
const tunnel = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${port}`]);

tunnel.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

tunnel.stderr.on('data', data => {
  const regex = /https:\/\/\S+/g;
  let match = regex.exec(`${data}`)
  if (match) {
    hookUrl = match
  }
  console.error(`stderr: ${data}`);
});

tunnel.on('close', code => {
  console.log(`child process exited with code ${code}`);
});

app.get('/', (req, res) => {
  let body ='<h3>Link, where listener is running:</h3>'+ hookUrl + '<h2>List of Previous Requests:</h2><ul>';
  requests.forEach((request, index) => {
    body += `<li>Request ${index + 1}: ${JSON.stringify(request)}</li>`;
  });
  body += '</ul>';
  res.send(body);
});

app.post('/', (req, res) => {
  console.log("New Request: ", req.body)
  requests.push(req.body);
  res.send('Request received');
});

app.listen(port, () => {
  console.log('Server is running on port 3099');
});
