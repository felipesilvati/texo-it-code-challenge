# Frontend - ReactJS Application

This project is bootstrapped with [Next.js](https://nextjs.org/) using [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), designed to showcase the nominees and winners of the Golden Raspberry Awards in a user-friendly interface.

## Getting Started

First, install the necessary dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

### `yarn dev`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn build`
Builds the app for production to the `.next` folder.

### `yarn start`
Starts the application in production mode. The application should be compiled with `yarn build` first.

### `yarn lint`
Runs the linter for your code and shows any linting errors.

### `yarn test`
Runs the test runner once.

### `yarn test:watch`
Runs the test runner in the interactive watch mode.

## Development Philosophy

- **Functionality First**: The primary focus was on ensuring that the API calls function correctly and that data is accurately rendered in the app, prioritizing functionality to adhere closely to the provided prototypes.
- **Utilizing Ant Design**: The application leverages Ant Design for UI components, chosen for its efficiency and alignment with the project's design requirements.
- **Simplistic UI Approach**: A straightforward UI was intentionally chosen to keep the application user-friendly and closely matched with the design prototypes, ensuring ease of use and clarity.
- **Comprehensive Testing**: With 100% line coverage, tests were written for various scenarios, including loading states, errors, and data filtering, demonstrating a commitment to reliability and quality.
- **Future Considerations**: While the current focus is on functionality and testing, enhancements could include more attention to visual design, incorporation of Storybook for component documentation, snapshot testing, and integration of CI/CD pipelines for automated testing and deployment.
