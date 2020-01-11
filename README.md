# Amistad

A fullstack react and firebase social networking application

## Project Overview

Connectivity is Life. Your NETWORK is your NET WORTH. These and many more are slogans that exemplify the premium we as humans have put on social connection, and the advantages it affords. This is also reflected in the success stories of the social apps that we have come to love. Hence the birth of Amistad.

Amistad is a social connecting platform that allows people to share their thought (screams), react to (like/unlike), and comment on them.

It was developed using Google Firebase cloud functions (along side authentication, storage and Firestore database) as the backend, and React + Material-UI for the frontend.

### Required Features

1. Users can sign up.
2. Users can login.
3. Users can post scream.
4. Users can like/unlike screams, both theirs and others.
5. Users can view scream details, showing comments and likes statistics.
6. Users can get notifications when other users interact with their screams.
7. Users can upload a profile picture and edit their details.
8. Users can view the profile page of other users showing their screams

### Possible Enhancements

1. Immediate notification of activity on user's scream.
2. Chat/Direct Messaging Functionality.
3. Having only specific friends see your screams.
4. Pagination of screams and comments

### Hosted App

The app is hosted on Google Firebase here: [Amistad](https://amistad-9f94a.firebaseapp.com/)

### API Endpoints.

##### Base URL

The project API base is hosted here on [Amistad-API](https://us-central1-amistad-9f94a.cloudfunctions.net/api)

| S/N | Verb   | Endpoint                    | Description                       |
| --: | ------ | --------------------------- | --------------------------------- |
|   1 | Post   | /signup                     | Create a user account             |
|   2 | Post   | /login                      | Sign in a user                    |
|   8 | Post   | /user                       | Add user                          |
|   5 | Get    | /user                       | Get details of authenticated user |
|   5 | Get    | /user/:handle               | Get details of user with handle   |
|   5 | Post   | /users/image                | Upload profile image              |
|   3 | Get    | /screams                    | Get all screams                   |
|   4 | Post   | /screams                    | Post a scream                     |
|   7 | Post   | /screams/:screamId/comments | Comment on a scream               |
|   5 | Get    | /screams/:screamId          | Get a specific scream             |
|   8 | Get    | /screams/:screamId/like     | Add like to screams               |
|   9 | Get    | /screams/:screamId/unlike   | Remove like from screams          |
|   6 | Delete | /screams/:screamId          | Delete scream                     |
|   5 | Post   | /notification               | Mark notifications as read        |

### How To Set Up Locally

1. Clone repo by opening a terminal and running `git clone https://github.com/darasimiolaifa/amistad.git`
2. Change into the project directory by running `cd amistad`
3. Change into the functions directory by running `cd functions`
4. Run `npm install`
5. Change into the client folder by running `cd ../amistad-client`
6. Run `npm install`
7. Still in the client folder, run `npm start`.
8. The project should launch in your browser at `localhost:3000`

### Author

Darasimi Olaifa
