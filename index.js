const express = require('express')
const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json())
//const port = 3000

app.get("/", (req, res) => {
    res.send({ hello: "Aus TI NE" });
});

app.post('/dialogflow-fulfillment', (request, response) => {
    const project = request.body.session.split("/")[1];
    console.log(project);
    const functionToCall = require(`./projects/${project}`)
    functionToCall(request, response)
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})