# Stack-Bookstore

Stack Bookstore is my personal project and it is a simple e-commerce bookstore which has functionalities to add books to cart, see the books and checkout the books (payment not configured). Firebase is used for authentication.

## Structure

Stack folder contains the front end react 

Stack-MERN contains backend node js with express and mongo DB

## Installation

To install all the required dependencies use below command inside the stack and stack-MERN

> npm install

To start a mongo daemon in the background 

> mongod --dbpath ./mongo-db-data 

To start the dev server inside the stack-MERN

> npm run dev

To start the react run inside the stack directory

> npm start

## Dependencies

Firebase Authentication has been used for this project so inorder for this to work, firebaseConfig details are needed from your firebase account in stack directory for the api calls

These can be obtained in the firebase console. 

> Create firebase_config.ts inside stack

> // Your web app's Firebase configuration

> Enter your firebase console details inside

> export default const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};


At server side create a credentials.json file which contains the private key of your firebase project in stack-MERN directory.
The details of the credentials.json can be downloaded from firebase

Refer [Initialize SDK in non-google_environments](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)