# Devkind Test Authentication System

## Features

- ### Register & login into the system

  The user can use the front-end portion of the web application to register. Then, their data, which are name, email, password and birthdate, and the creation timestamp of the user document, will be stored in MongoDB.
  The user can also use the front-end portion to log in to the system. The ExpressJS server will check whether their email exists in the database to determine whether to grant access or not.

- ### Update their profile/password

  Once the user is registered or logged in, they will be directed to the user profile page, where they can view and update their profile.

- ### In the background, a changelog/activity should be maintained & Must be able to see the changelog

  In this case, I decided that logging to the console may not be enough to preserve the activity logs. So, I persisted these logs into the MongoDB database with the help of the Winston logging package so that they could be stored and viewed when needed.

- ### All the data must be validated & Use sanitisation where required

  In the front-end portion of the web application, I added a minimum amount of user input validation, e.g. validating that their email address follows the xxxx@xxxx.xxxx format. This is because I am aware that this validation and sanitisation on the client side could be easily bypassed, e.g. the user may intercept and modify the request payload, then send it to the server.
  So, I added stricter validation rules at the server with the help of the express-validator package. For instance, it helps with checking the format of the birthdate and the email address.

- ### The user must be at least 18 years old to register into the system

  This verification is also performed at the back-end portion of the application due to similar reasons.
