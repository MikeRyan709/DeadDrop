const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries');
let path = require('path')


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post('/stacks/save', db.createUserUsingStack);
app.post('/queue/save', db.createUserUsingQueue);

app.get('/readstack', db.getStackMessageById);
app.get('/readqueue', db.getQueueMessageById);

app.get('/old', (request, response) => {
    response.json({messageid: "It works"});

    
});

app.listen(port, () => {
    console.log (`running on ${port}`);
})
