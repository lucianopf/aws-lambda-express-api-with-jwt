# Generic AWS RESTful API with JWT auth with Express using Lambda and API Gateway

Bootstrap of a generic API with auth via JWT using Express 4.0 and uploaded directly via ClaudiaJS to an AWS Lambda project.

The main goal of this project is to serve as an entrypoint to developers build a REST API using AWS Lambda functions and API Gateway with the lowest effort possible.


## Requirements

- Node, npm, git and an AWS Account.

## Installation

- Clone the repo: `git clone https://github.com/lucianopf/aws-lambda-express-api-with-jwt.git`
- Enter into the project directory: `cd epress-generic-api-with-jwt`
- Install dependencies: `npm install`
- Setup your AWS credentials:

Create the credentials file: .aws/credentials:
```     
[claudia]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_ACCESS_SECRET
```
- Generate the Claudia proxy handler: `./node_modules/.bin/claudia generate-serverless-express-proxy --express-module server`
- Make the 1st upload: `./node_modules/.bin/claudia create --handler lambda.handler --deploy-proxy-api --region us-east-1`

## Usage

-   As soon as the application has been updated you should update at AWS using the following command: `npm run update` 
-   The CLI response has the url endpoint so it can be tested via CURL, Postman...
-   By default the `/api`, `/api/login` and `/api/singup` are the only endpoints without Authorization header.
-   All other paths must have Authorization header with the following format "Bearer <Token>".
-   The token can be aquired by sending a POST request to `/api/login` with the username and password at the body (x-www-form-urlencoded).
-   A default User can register sending a POST to `/api/singup` with the required attributes. (Default attibutes are name, username and password)

## Definition

The following section will explain in depth the application structure.

### Models

There are the default models located at `app/models/default` folder. 
The express application watches for files in this folder and create READ, WRITE, LIST and DELETE routes served with a JWT Auth middleware.

There are also custom models that are not routed by default, so it can be used as special models, such as User, which has login, sign up and doesn't require Auth.

### Routes

There's also the default router located at `app/routes/default.js` which is responsible for all routings at the application.

The file is separated in four sections of definitions:
1.  Variable
2.  Middleware
3.  Custom routes
4.  Default routes

The custom routes must be manually inserted at custom routes section in default.js and must export a function that have a router as parameter and a return object.

## Observations
There are a few observations.

The first one is that I couldn’t add keys.js and claudia.json to .gitignore because it wont upload to AWS via ClaudiaJS, so you must be careful to ignore commits to those files to avoid secrets leaks.

The other one is that there's a particular behavior with mongoose at a Lambda function that makes it unable to keep connection alive, so I had to implement middlewares to connect and disconnect to the database as soon as the route is called.


[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
