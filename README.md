# youtrack-app

This is an application made for the YouTrack platform from JetBrains. It has a single page that displays all the projects that the user has access to and has a toggle button that persists a boolean value on the backend. It also has search functionality for the projects. The page uses the RingUI library for the toggle button.

## Getting started

#### Clone the repository

```bash
git clone git@github.com:Harry-258/unity-analysis-tool.git
cd youtrack-app
```

### Install the dependencies

```bash
npm install
```

### Uploading and running the app on YouTrack

To test the app, you need to build it and upload it to your YouTrack server.

```bash
npm run build
npx youtrack-app upload dist --host <host> --token <permanent-token>   
```

Where ```<host>``` is the base url of your server and ```<permanent-token>``` is the token for uploading your app to the server. To find out how to create your permanent token, go [here](https://www.jetbrains.com/help/youtrack/devportal/Manage-Permanent-Token.html).

Example:

```bash
npm run build
npx youtrack-app upload dist --host https://test.youtrack.cloud --token perm-...   
```

### Run the tests

The project contains a few simple tests made with vitest.

```bash
npm run test
```

## Future improvements:

This project was done over the course of 2 days as part of a challenge. With more time, these are the improvements that could be made:
- Make use of more RingUI components. I was only able to use the toggle button because I couldn't get the library to work in time.
- Test the frontend component. Right now, only the utility methods used to call YouTrack's API are tested.
- Extend the `User` entity with a `flag` property instead of `AppGlobalStorage` to store the backend flag. This would imply persisting changes per user instead of globally.
