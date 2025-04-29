# Contributing to UseTheForm

🎉 First off, **thank you** for taking the time to contribute — your help is what keeps this project growing! 🎉

We welcome all contributions, whether you're fixing bugs, adding new features, improving documentation, or simply spreading the word. Let's build something great together.

## Prerequisites

Before getting started, make sure you have the following tools installed:

- **Node.js** (v20.19.0 is recommended)
  Make sure you have Node.js installed. You can manage multiple versions of Node.js using [nvm](https://github.com/nvm-sh/nvm).

- **Corepack** (which comes bundled with Node.js v16.9 and later)
  Corepack allows you to manage Yarn versions per project without requiring a global installation of Yarn.

## 🚀 Getting Started

1. **Fork** the repository and **clone** it to your local machine:
   ```bash
   git clone https://github.com/your-username/usetheform.git
   ```

2. **Enable Yarn via Corepack** (required for newer versions of Node.js):

   If you don’t have Yarn installed globally, just enable it with:
   ```bash
   corepack enable
   ```

   > 💡 `corepack` comes bundled with Node.js (v16.10+), and helps manage Yarn versions.

3. **Install dependencies**:
   ```bash
   yarn
   ```

4. **Create a new branch** from `master` with a meaningful name:
   ```bash
   git checkout -b your-feature-or-fix-name
   ```

## ✅ Development Checklist

Before submitting your pull request, please make sure to:

- ✅ **Run tests** to ensure everything works as expected:
  ```bash
  yarn test
  ```

- ✅ **Write unit tests** for your changes where applicable.

- ✅ **Lint your code** for formatting and style issues:
  ```bash
  yarn lint
  ```

- ✅ **Build the project** to verify that everything compiles:
  ```bash
  yarn build
  ```

- ✅ **Push your branch** to your forked repo:
  ```bash
  git push -u origin your-feature-or-fix-name
  ```

- ✅ **Open a Pull Request** against the `master` branch in the main repository.
  - Use a **clear title** and **brief description** of your changes.

## 🧑‍💻 Code Style

UseTheForm follows consistent styling via **ESLint** and **Prettier**.

👉 We recommend enabling their plugins in your code editor for real-time feedback.

Run manually:

```bash
yarn lint
```

## 📄 License

By contributing to this project, you agree to license your work under the [MIT License](../LICENSE.md), in line with the rest of the repository.