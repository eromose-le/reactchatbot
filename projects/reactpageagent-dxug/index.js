'use strict';
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var serviceAccount = require("../../reactpageagent-dxug-firebase-adminsdk-26f6q-e1563ff30f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reactpageagent-dxug.firebaseio.com"
});

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

module.exports = (request, response) => {
  const agent = new WebhookClient({ request, response });

  function rhymingWordHandler(agent) {
    const word = agent.parameters.word;
    agent.add(`Here are the rhyming words for ${word}`);
    axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
      .then((result) => {
        console.log(result.data);
        result.data.map(wordObj => {
          console.log(wordObj.word);
          return agent.add(JSON.stringify(wordObj.word)).join(" & ");
          // agent.end(`${wordObj.word}`);
        });
      });
  }

  let intentMap = new Map();
  intentMap.set('rhymingWord', rhymingWordHandler);
  agent.handleRequest(intentMap);
}



