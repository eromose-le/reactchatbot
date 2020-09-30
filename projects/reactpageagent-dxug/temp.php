const express = require('express')
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const app = express()
app.use(bodyParser.json())
//const port = 3000

app.get("/", (req, res) => {
    res.send({ hello: "Aus TI NE" });
});

app.post('/dialogflow-fulfillment', asyncHandler(async (request, response, next) => {
    try {
        const project = await request.body.session.split("/")[1];
        console.log(project);
        const functionToCall = require(`./projects/${project}`)
        functionToCall(request, response)
    }
    catch (error) {
        next(error);
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`)
})