const Pool = require("pg").Pool;

// setting up a database to run on node.js

const pool = new Pool({
  user: "agent",
  host: "localhost",
  database: "deadDrop",
  password: "password",
  port: 5432,
});

// setting up a class function for stack

class Stack {
  constructor() {
    this.items = [];
    this.count = 0;
  }

  push(element) {
    this.items[this.count] = element;
    console.log(`added to ${this.count}`);
    this.count += 1;

    return this.count - 1;
  }
}

// Creating a stack to connect to the database

const stack = new Stack();

const createUserUsingStack = async (request, response) => {
  let agentid, structureid, data;
  data = request.body.data;
  agentid = request.body.agentid;
  structureid = request.body.structureid;

  const element = { agentid, structureid, data }
  const elementPositionInStack = stack.push(element)
  console.log("Added element to stack at position:", elementPositionInStack)

  // ceating a query and setting up error function
  pool.query(
    "INSERT INTO stacks (agentid, structureid, data) VALUES ($1, $2, $3)",
    [agentid, structureid, data],
    (error, result) => {
      if (error) {
        response.status(500).send(error);
      }
      else {
        response.status(201).json("user successfully created");
      }
    }
  );
};

// setting up a class for queue

class Queue {
  constructor() {
    this.items = [];
    this.count = 0;
  }

  push(element) {
    this.items[this.count] = element;
    console.log(`added to ${this.count}`);
    this.count += 1;

    return this.count - 1;
  }
}

// Creating a queue to connect to the database

const queue = new Queue();

const createUserUsingQueue = async (request, response) => {
  let agentid, structureid, data;
  data = request.body.data;
  agentid = request.body.agentid;
  structureid = request.body.structureid;

  const element = { agentid, structureid, data }
  const elementPositionInQueue = queue.push(element)
  console.log("Added element to queue at position:", elementPositionInQueue)

  // creating a query and setting up error function

  pool.query(
    "INSERT INTO queue (agentid, structureid, data) VALUES ($1, $2, $3)",
    [agentid, structureid, data],
    (error, result) => {
      if (error) {
        response.status(500).send(error);
      }
      else {
        response.status(201).json("user successfully created");
      }
    }
  );
};

// creating a function to get messageid from stacks and setting up error function
const getStackMessageById = async (request, response) => {
  const structureid = parseInt(request.body.structureid)


  pool.query('SELECT * FROM stacks WHERE structureid = $1 ORDER BY messageid DES LIMIT 1', [structureid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  });
}

const deleteStackMessageById = (request, response) => {
  const structureid = parseInt(request.params.structureid)
  pool.query('DELETE * FROM stacks WHERE structureid = $1', [structureid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send("message deleted(from stacks)")
  }
  )
}

const getQueueMessageById = async (request, response) => {
  const structureid = parseInt(request.params.structureid)
  pool.query('SELECT * FROM queue WHERE structureid = $1 ORDER BY messageid ASC LIMIT 1', [structureid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  }
  )
}
// setting up a delete function to remove query messageid from queue

const deleteQueueMessageById = (request, response) => {
  const structureid = parseInt(request.params.structureid)
  pool.query('DELETE * FROM queue WHERE structureid = $1', [structureid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send("message deleted(from queue)")
  }
  )
};

module.exports = {
  createUserUsingStack,
  createUserUsingQueue,
  getStackMessageById,
  getQueueMessageById,
  deleteQueueMessageById,
  deleteStackMessageById

}
