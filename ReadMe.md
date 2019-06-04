# API

### Database
Install MongoDB for your OS from [here](https://docs.mongodb.com/manual/installation/) and launch it

Restore the mongodb dump
```sh
mongorestore --gzip --archive="src/dumps/real-estate***.gz"
```
Also we recommend to use [MongoDB Compass](https://www.mongodb.com/products/compass) for better experience

### Launch
Install dependencies
```sh
npm i
```
and start the api
```sh
npm start
```
