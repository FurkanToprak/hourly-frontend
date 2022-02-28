# hourly frontend

# Installation
- `npm install`

# Local Development
- `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Testing
- `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# Building
- `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Style Guide

## Styling in React
Good code minimizes navigation within the codebase. Modern webapps explode in complexity when it comes to styling. Follow some simple rules:
- All text should be a component from Texts.tsx
- Theme styling belongs in Theme.ts
- App-wide styling (e.g. font families, etc.) belong in `css` files that are loaded in `App.tsx`
- Component-wide styling belongs in the same file as a separate JSON object at the bottom of the file. Look at `components/Title.tsx` for an example. 

# Docs

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
