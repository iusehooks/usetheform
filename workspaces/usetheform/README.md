# Usetheform

Usetheform is a form library for React that simplifies form handling with minimal boilerplate. This repository includes the core library and provides detailed instructions on how to set up, build, and contribute.

## Prerequisites

Before getting started, make sure you have the following tools installed:

- **Node.js** (v20.19.0 is recommended)
  Make sure you have Node.js installed. You can manage multiple versions of Node.js using [nvm](https://github.com/nvm-sh/nvm).

- **Corepack** (which comes bundled with Node.js v16.9 and later)
  Corepack allows you to manage Yarn versions per project without requiring a global installation of Yarn.

## Getting Started

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/iusehooks/usetheform.git
cd usetheform
```

### 2. Enable Corepack

Corepack is automatically bundled with Node.js (v16.9 and above). To ensure you are using the correct version of Yarn for the project, run:

```bash
corepack enable
```

This will enable Corepack, ensuring that the version of Yarn specified in the `.yarn/releases` directory is used for the project.

### 3. Install Dependencies

Once Corepack is enabled, you can install the project dependencies using Yarn. Since Corepack will automatically use the version specified in the project (inside `.yarn/releases`), no global Yarn installation is required.

```bash
yarn install
```

This will install all the dependencies defined in the `package.json`.

### 4. Running the Development Server

After the dependencies are installed, you can run the development server to see the project in action:

```bash
yarn start
```

The development server will start, and you can open the project in your browser at `http://localhost:3000`.

### 5. Running Tests

To run tests for the project, use the following command:

```bash
yarn test
```

This will run the unit tests and linting checks.

### 6. Build the Project

To build the project for production, run:

```bash
yarn build
```

This will create an optimized version of the application in the `build` directory.

## Versioning

The project uses Yarn's version management system with the version specified in `.yarn/releases`. When you need to ensure the project uses the correct version of Yarn, Corepack will handle that for you.
