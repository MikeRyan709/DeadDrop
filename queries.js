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

module.exports = {
  createUserUsingStack,
};


