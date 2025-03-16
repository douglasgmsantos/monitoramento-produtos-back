# Amazon Product Price Monitor

## About the Project

This is a web scraping application built with Node.js that monitors Amazon product prices. The system uses Puppeteer for web scraping and includes features like automated monitoring, notifications via WhatsApp (using Venom-bot), and data storage using Firebase.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Puppeteer (for web scraping)
- Firebase Admin (for data storage)
- Venom-bot (for WhatsApp integration)
- Node-cron (for scheduled tasks)
- Twilio (for messaging)

## Prerequisites

- Node.js (v14 or higher)
- Yarn or npm
- Firebase account and credentials
- Environment variables properly configured

## Installation

1. Clone the repository

```bash
git clone [git@github.com:douglasgmsantos/monitoramento-produtos-back.git]
cd monitoramento-produtos-back
```

2. Install dependencies

```bash
yarn install
# or
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory and add the necessary environment variables:

```env
# Add your environment variables here
```

4. Configure Firebase
Place your Firebase admin SDK configuration file in the project root.

## Running the Project

### Development mode

```bash
yarn dev
# or
npm run dev
```

### Production mode

1. Build the project

```bash
yarn build
# or
npm run build
```

2. Start the server

```bash
yarn start
# or
npm start
```

## Project Structure

```

## License
This project is licensed under the MIT License.
