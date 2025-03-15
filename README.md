# EduManage Server

Welcome to the EduManage server repository! This server is built using Node.js with Express, and it is designed to work with the EduManage client application.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [License](#license)

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone https://github.com/irshad-shajahan/edu-manage-tw-server.git
cd edu-manage-tw-server
npm install
```

## Scripts

- `npm start` - Starts the server.
- `npm run dev` - Runs both the client and server. Make sure to navigate to the client directory and install its dependencies as well.

## Dependencies

This project uses the following Node.js packages:

- **express** - Web framework for Node.js
- **mongoose** - MongoDB object modeling tool
- **express-validator** - Validation middleware for Express.js
- **jsonwebtoken** - Library to generate and verify JSON Web Tokens (JWT)
- **passport** - Authentication middleware
- **bcrypt** - Password hashing library

## Usage

### Starting the Server

To start the server, run:

```bash
npm start
```

This will start the server on the port specified in your environment variables.

### Running Both Client and Server

To run both the client and server simultaneously, use:

```bash
npm run dev
```

Ensure that you have navigated to the client directory and installed its dependencies as well before running this command.
