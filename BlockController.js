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
        this.getBlockByIndex();
        this.postNewBlock();
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
            } else {
                //6.
                res.send(`ERROR: error with your HTTP GET request: ${_req}`);
                res.end();
                throw new Error(`ERROR: error with your HTTP GET request: ${_req}`);
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