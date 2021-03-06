# RESTful Web API with Node.js Framework (ExpressJS)

This project exposes a [levelDB](https://github.com/Level/level) blockchain database to a publicly accessible API.
I have built the API on top of the popular NodeJS minimal framework [ExpressJS](https://expressjs.com/). 


## How to use this API:

#### Install the code
1. Download OR clone this GitHub repository
2. Open a terminal or command-prompt and navigate to the directory where this repository was saved and type: `npm install`
3. From terminal or command-prompt (remaining in the same directory as above) type: `node app.js`


#### Get a block from the database
* Make a `GET` request from a web browser or via a utility of your choice such as [Curl](https://curl.haxx.se/) or [PostMan](https://www.getpostman.com/).
The request endpoint follows the structure: `localhost:8000/block/[block-index]`
* Example `GET` request that will return the block at index 0 using curl:  `curl localhost:8000/block/0`


#### Insert a new Block to the database

* Make a `POST` request with a single key value pair (the key must be named "body")
* Example `POST` request using curl: `curl -d "body=mock%20data" -X POST http://localhost:8000/block`

<br/>

#### Errors 

* If you send a `POST` request without the correct body data (key = body), then you will receive an error message and your new block will NOT be created.

<br/>

Enjoy!
