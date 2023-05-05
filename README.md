# Node.js Project with Express, Mongoose, Bcrypt, JWT Token, Prettier, ESLint, and Husky.

This is a template for a Node.js project that uses Yarn as the package manager, Express as the web framework, Mongoose as the database ORM, Bcrypt for password hashing, JWT token for authentication, Prettier for code formatting, ESLint for code quality, and Husky for git hooks.

## Installation

To install the dependencies, run the following command:

```sh
yarn
```

## Configuration

To configure the project, create a `.env` file at the root of the project and set the following environment variables:

```sh
PORT=3000
AUTH_SECRET=your_jwt_secret
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name
SALT_WORK_FACTOR=number_of_rounds
```

## Usage

To start the server, run the following command:

```sh
yarn dev
```

## Code Quality

The project uses ESLint for code quality checks. To run the checks, run the following command:

```sh
yarn lint
yarn lint:fix
```

## Git Hooks

The project uses Husky for git hooks. The pre-commit hook runs Prettier and ESLint on staged files. Also, I have set up auto save in VSCode user settings, which helps you to automatically format and lint code on save.
