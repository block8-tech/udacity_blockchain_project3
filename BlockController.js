const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const {Blockchain} = require('./BlockChain');
const {Block} = require('./Block');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.db = new Blockchain();
        this.initializeMockData();
        this.getHome();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    getHome() {
        return this.app.get('/', (req, res, next) => {

            const ms = `<div class="jumbotron">
  <h1 class="display-4">Welcome to RESTful Web API with Node.js Framework</h1>
  <p class="lead">This API is built on top of ExpressJS</p>
  <hr class="my-4">
  <p>For information on how to use this api please visit our GitHub page.</p>
  <p class="lead">
    <a class="btn btn-primary btn-lg" href="https://github.com/block8-tech/udacity_blockchain_project3" role="button">Learn more</a>
  </p>
</div>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
`;
            res.send(ms);
            res.end();
        })
    }



    /**
     * GET Endpoint to retrieve a block by index (height)
     * returns a JSON string
     * Success => returns the block
     * Failure => returns error message
     */
    async getBlockByIndex() {
        //1. Check blockchain height
        //2. Create the endpoint
        //3. Store the request parameter (:index)
        //4. Check the :index value is not greater than the chain height
        //5. Check for incompatible :index request and send error message back
        //6. Deal with any other HTTP request errors


        //1.
        const chainHeight = await this.db.getBlockHeight();

        //2.
        this.app.get("/block/:index", async (req, res) => {

            //store the request url - use in error handling.
            const _req = req.headers.host + req._parsedUrl.pathname;

            //3.
            const indx = req.params.index;

            //4.
            if(indx <= chainHeight) {
                const block = await this.db.getBlock(indx).catch(console.log);
                res.send(block);
                res.end();
            }

            //5.
            if(indx > chainHeight){
                const errorMessage = {
                    error: `Block does not exist.`,
                    message: `The blockchain length = ${chainHeight} at the time of your request. You requested block number ${indx} which exceeds the chain length at the time of your request.`
                };
                res.send(JSON.stringify(errorMessage));
                res.end();
            }

            if(!indx){
                res.send();
                res.end();
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    async postNewBlock() {
        //1. Create the endpoint
        //2. Store the request.body
        //3. Check that there is a body value being passed to the new block.
            // do not accept an empty string '' for newBlock.body
        //4. Add the newBlock to the levelDB database
        //5. Error handle


        //1.
        this.app.post("/block", (req, res) => {

            //2.
            const newBlockBody = req.body.body;

            //3.
            if(newBlockBody === '' || !newBlockBody){
                const errorMessage = {
                    error: 'new block not created!',
                    message: 'You must pass a valid string as the body of the newBlock. You can NOT leave as an empty string.'
                };
                res.send(errorMessage);
                res.end();
            } else {
                //4.
                this.db.addBlock(new Block(newBlockBody))
                    .then(persistedBlock => {
                        res.send(persistedBlock);
                        res.end();
                    })
                    .catch(err => {
                        //5.
                        const errorMessage = {
                            error: 'new block not created!',
                            message: err
                        };
                        res.send(errorMessage);
                        res.end();
                    });
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app)};