const Pool = require("pg").Pool;

const pool = new Pool({
  user: "agent",
  host: "localhost",
  database: "deadDrop",
  password: "password",
  port: 5432,
});

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

const stack = new Stack();

const createUserUsingStack = async (request, response) => {
  let agentid, structureid, data;
  data = request.body.data;
  agentid = request.body.agentid;
  structureid = request.body.structureid;

  const element = { agentid, structureid, data }
  const elementPositionInStack = stack.push(element)
  console.log("Added element to stack at position:", elementPositionInStack)

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

const queue = new Queue();

const createUserUsingQueue = async (request, response) => {
  let agentid, structureid, data;
  data = request.body.data;
  agentid = request.body.agentid;
  structureid = request.body.structureid;

  const element = { agentid, structureid, data }
  const elementPositionInQueue = queue.push(element)
  console.log("Added element to queue at position:", elementPositionInQueue)

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

const getStackMessageById = (request, response) => {
  const structureid = parseInt(request.params.structureid)

  pool.query('SELECT * FROM stacks WHERE structureid = $1 ORDER BY messageid DESC LIMIT 1',[structureid], (error, results) => {
    if (error){
      throw error
    }
    response.status(200).json(results.rows)
  });
};

const getQueueMessageById = (request, response) => {
  const structureid = parseInt(request.params.structureid)

  pool.query['SELECT * FROM queue WHERE structureid = $1 ORDER BY messageid ASC LIMIT 1',[structureid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  }]
}

module.exports = {
  createUserUsingStack,
  createUserUsingQueue,
  getStackMessageById,
  getQueueMessageById 
};


