//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");

/**
 * Class Definition for the REST API
 */
class BlockAPI {

    /**
     * Constructor that allows initialize the class 
     */
    constructor() {
    	// create the express application instance.
		this.app = express();
		// setup the port.
		this.initExpress();
		// setup the middleware - body-parser in our case for incoming req bodies.
		this.initExpressMiddleWare();
		//setup the Controllers - i.e. the route endpoints (found in BlockControllers.js).
		this.initControllers();
		// start the REST API by calling the express app.listen() method on port 8000.
		this.start();
	}

    /**
     * Initilization of the Express framework
     */
	initExpress() {
		// set the server port using the express .set() method
		this.app.set("port", process.env.PORT || 8000);
	}

    /**
     * Initialization of the middleware modules
     */
	initExpressMiddleWare() {
		// these middleware allow us to "automatically" parser request bodies
		// and have easy access to these from the req.body property.
		// urlencoded see -> ( https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions )
		// json see -> ( https://www.npmjs.com/package/body-parser#bodyparserjsonoptions )
		this.app.use(bodyParser.urlencoded({extended:true}));
		this.app.use(bodyParser.json());
	}

    /**
     * Initilization of all the controllers
     */
	initControllers() {
		// require the Controller function that accepts the express app as a parameter.
		// this will give us access to the route endpoints.

		/**
			We will have to configure the BlockController.js file to
		 	be able to interact with our instance of levelDB.
		 	In a previous tutorial we created a file called LevelSandbox.js
		 	and we used this file to configure and connect to a levelDB database:

		 	const level = require('level'); <- requiring the level module (npm install level --save)
		 	const chainDB = './chaindata'; <- the path and name of our levelDB

		 	In this tutorial / review I will be using the same method by copying over the
		 	LevelSandbox.js file into this projects code base - I will then use the predefined
		 	methods to interact to the database via the RESTful API (app.js, BlockController.js)
		 */
		require("./BlockController.js")(this.app);
	}

    /**
     * Starting the REST Api application
     */
	start() {
		// self = this to access the instance of BlockAPI inside the .listen callback
		let self = this;
		// set the port using express method .get()
		// we set the port in the initExpress method above with this.app.set("port", 8000)
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}

}

// init a new instance of the RESTFul API - so we can access the api.
new BlockAPI();