# vue-carnival is a Vue Attendance system POC

## Summary

vue-carnival is a attendance system POC that makes use of face recognition to identiy the user and appropriately provide the ability to checkin / checkout. The application is built from VUE CLI and kept minimal as possible. Lot of features and enhacements can be done on top of this. Please refer to the docs folder in the repo for more technical infos. Please note that there will be delay in face recognition as all computations happen on the client side.

## Libraries Used

- Face API (https://github.com/justadudewhohacks/face-api.js/) - Is used for face recognition and processing
- uuid - Is used for generating unique ids for records

## Application Flow

## How to Run Locally

There are three parts to running the application locally

- JSON Server that acts as the backend
- Face API models needs for be static hosting
- Vue Frontend application

## Running the backend

Backend is on JSON Server (https://github.com/typicode/json-server). Please refer to the github repo for installing it. The `vue-carnival` repository contains the empty database that needs to be used for the project. The database name is `db.json`

The JSON server can be started as follows once installed:

```
json-server -p 9090 -w db.json
```

## Hosting models for Face API library ( Needed for face recognition)

Simple clone the Gtihub repo (https://github.com/justadudewhohacks/face-api.js/) and host it on static server. During my development, I hosted it on `http-server`(https://github.com/http-party/http-server).

The models are available on the folder named: `weights`

```
hs . --cors -p 8081
```

## Vue Frontend setup

Clone the repo, and run `npm install` to install the dependencies.
You can complate and run the application

```
npm run serve
```

Now you should be able to access the application from the browser using `http://localhost:8080`
