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

1. To redirect requests to another application, you'll need to set the `REDIRECT_PORT` environment variable. 
This can be done by adding the variable to your system environment variables or by setting it in your IDE's run configuration, 
depending on your development environment. Once the variable is set, the application will 
automatically redirect requests to the specified port.

2. Start the server by running the following command:

    -Run `node app.js`

3. Open your browser and navigate to `http://localhost:3099`. You should see a message saying "Link, where listener is running:" followed by a link. This is the link where your webhook listener is running.

4. Use provided link as the webhook URL when setting up a webhook on any service.

5. When a webhook is sent to your listener, the payload will be displayed on the webpage.

## License

This project is licensed under the MIT License