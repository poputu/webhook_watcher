const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const REDIRECT_PORT = process.env.REDIRECT_PORT;
const port = 3099;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let hookUrl;
const requests = [];

// Start the cloudflared tunnel
const tunnel = spawn("cloudflared", [
  "tunnel",
  "--url",
  `http://localhost:${port}`,
]);

tunnel.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

tunnel.stderr.on("data", (data) => {
  const regex = /https:\/\/\S+/g;
  let match = regex.exec(`${data}`);
  if (match) {
    hookUrl = match;
  }
  console.error(`stderr: ${data}`);
});

tunnel.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

app.get("/", (req, res) => {
  let body = `<h3>Link, where listener is running:</h3> ${hookUrl} 
<button onclick="copyHookUrl()" style="margin: 5px">Copy</button>
<h2>List of Previous Requests:</h2><ul>`;
  requests.forEach((request, index) => {
    body += `<li>Request ${index + 1}: ${JSON.stringify(request)}</li>`;
  });
  body += "</ul>";

  // Add a meta refresh tag to reload the page every 5 seconds
  body += '<meta http-equiv="refresh" content="5">';

  // Add a script to copy the hookUrl data to clipboard
  body += `
    <script>
      function copyHookUrl() {
        const el = document.createElement('textarea');
        el.value = '${hookUrl}';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    </script>
  `;

  res.send(body);
});

app.post("/", (req, res) => {
  console.log("New Request: ", req.body);
  requests.push(req.body);

  // Send the request to the other application
  if (REDIRECT_PORT) {
    const http = require("http");
    const request = http.request(
      {
        hostname: "localhost",
        port: REDIRECT_PORT,
        path: "/",
        method: "POST",
        headers: req.headers,
      },
      (response) => {
        console.log("Response from redirect server:", response.statusCode);
      }
    );

    request.write(JSON.stringify(req.body));
    request.end();
  }

  res.send("Request received");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
