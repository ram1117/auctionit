# AuctionIt

## Description

**AuctionIt** is the backend NestJs application for an auction website. Admin users can create items, create auctions for each item and do other CRUD operations. Users can signup, view live auctions and place bids for items.

Applciation uses WebSocket IO to send real time bid values for each auction. Application sends push notifications to users with Firebase FCM.

A cron job is scheduled to run every five minutes to check for ended auctions and update winning bids.

## Live Demo

A live version of the application is hosted [on Render](https://auctionit-vst0.onrender.com/api/v1/auctions/live).

The front-end of the application is hosted [on Vercel](https://auctionit-fe.vercel.app/)

The service is deployed in free tier and may not be available instantly. Please wait a few minutes for the application to start

## Getting Started

### Dependencies

- Need NPM to install the packages needed for the project
- Need Git and Github account to setup and contribute to the project
- Need Docker engine to run Postgres Database in a docker container(Not needed if Postgres is installed locally)

## Installing

Please run the following command to install the npm dependency packages.

```bash
$ npm install
```

Before running the app, you will need to run docker container to use database as a docker image. Run the following command to start the docker postgres image(Docker Desktop or Docker Engine need to be installed for this). If you have postgres installed in your system, you do not need to run the docker.

```bash
$ docker compose up -d
```

Create `.env.development` file at the root of the project and add following keys.

```bash
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<dbname>"
FIREBASE_CONFIG='{
"projectId":"<YOUR_FIREBASE_PROJECT_ID>",
"clientEmail":"<YOUR_FIREBASE_CLIENT_EMAIL>",
"privateKey":"<YOUR_FIREBASE_PRIVATE_KEY"
}'
```

## Running the app

To start the NestJs app, run one of the following commands.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Help

Please raise a Github issue for errors or bugs.

https://github.com/ram1117/auctionit/issues

## Authors

### Ram Kumar Karuppusamy

[@ram1117](https://github.com/ram1117) <br />
[ram kumar karuppusamy](https://www.linkedin.com/in/ram-kumar-karuppusamy/)

## Version History

- 0.1
  - Initial Release

## License

This project is [MIT](./LICENSE) licensed. See the LICENSE.md file for details
