# RESTful Web API with Node.js Framework (ExpressJS)

This project exposes a [levelDB](https://github.com/Level/level) blockchain database to a publicly accessible API.
I have built the API on top of the popular NodeJS minimal framework [ExpressJS](https://expressjs.com/). 
#

##How to use this API:

####Install the code
1. Download OR clone this GitHub repository
2. Open a terminal or command-prompt and cd to the directory this repository was saved and type: `npm install`
3. From terminal or command-prompt (remaining in the same directory as above) type: `node app.js`


####Get a block from the database
* Make a `GET` request from a web browser or via a utility of your choice such as [Curl](https://curl.haxx.se/) or [PostMan](https://www.getpostman.com/).
The request endpoint follows the structure: `localhost:8000/block/[block-index]`
<br/>
Example `GET` request that will return the block at index 0: [`localhost:8000/block/0`](localhost:8000/block/0)
<br />

####POST request to insert a new Block to the database

* Make a `POST` request with a single key value pair (the key must be named "body")
<br />
Example `POST` request using [Curl](https://curl.haxx.se/): `curl -d "body=mock%20data" -X POST http://localhost:8000/block`