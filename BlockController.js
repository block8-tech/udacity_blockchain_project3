const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const {Blockchain} = require('./BlockChain');

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
     * GET Endpoint to retrieve a block by index (height)"
     */
    async getBlockByIndex() {
        //1. Check blockchain height
        //2. Use height in a conditional block
        //3. if within height then retrieve block
        //4. if not, return error message.

        //1.
        const chainHeight = await this.db.getBlockHeight();

        this.app.get("/block/:index", async (req, res) => {

            //2. Get the index value from the req.params.index
            const indx = req.params.index;

            //3.
            if(indx > chainHeight){
                // The HTTP request was for a block that does not exist. ERROR
                const errorMessage = {
                    error: `Block does not exist.`,
                    message: `The blockchain length = ${chainHeight} at the time of your request. You requested block number ${indx} which exceeds the chain length at the time of your request.`
                };
                res.send(JSON.stringify(errorMessage));
                res.end();

            } else if(indx <= chainHeight) {
                const block = await this.db.getBlock(indx).catch(console.log);
                res.send(block);
                res.end();
            }

        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", (req, res) => {
            // Add your code here
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