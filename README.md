# Webhook Listener

This is a Node.js application that creates a webhook listener and allows you to see the payloads sent to the listener.

## Prerequisites

- Node.js
- `cloudflared` command-line tool

## Installation

1. Install `cloudflared` by running the following command:

   - Run `brew install cloudflared`

2. Clone this repository and navigate to the root directory.

3. Install the required dependencies by running:

   - Run `nvm install`

## Usage

1. Start the server by running the following command:

    -Run `node app.js`

2. Open your browser and navigate to `http://localhost:3099`. You should see a message saying "Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):" followed by a link. This is the link where your webhook listener is running.

3. Use provided link as the webhook URL when setting up a webhook on any service.

4. When a webhook is sent to your listener, the payload will be displayed on the webpage.

5. To view all previous requests, go to the root page at `http://localhost:3099` and scroll down.

## License

This project is licensed under the MIT License