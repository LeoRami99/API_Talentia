# README

This project is an ExpressJS API built with TypeScript and Sequelize.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up the database by running `npm run db:migrate`
4. Start the server with `npm start`

## Project Structure

- `src/controllers`: Contains the controller files for each model
- `src/models`: Contains the Sequelize model files
- `src/routes`: Contains the route files for each model
- `src/app.ts`: Sets up the Express app
- `src/config.ts`: Contains the configuration for the app
- `src/server.ts`: Starts the server
- `src/tsconfig.json`: TypeScript configuration file
- `src/package.json`: Contains project dependencies and scripts

## Available Scripts

- `npm start`: Starts the server
- `npm run db:migrate`: Runs Sequelize migrations to set up the database
- `npm run db:seed`: Seeds the database with initial data (if applicable)
- `npm run build`: Compiles TypeScript files to JavaScript
- `npm run lint`: Runs ESLint to check for linting errors
- `npm run test`: Runs tests (if applicable)