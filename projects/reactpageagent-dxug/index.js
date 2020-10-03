'use strict';
const functions = require('firebase-functions');

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');



module.exports = (request, response) => {
  const agent = new WebhookClient({ request, response });

  function welcome(agent) {
    agent.add('Welcome to my agent');
  }

  function rhymingWordHandler(agent) {
    const word = agent.parameters.word;
    agent.add(`Here are the rhyming words for ${word}`)
    axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
      .then((result) => {
        console.log(result.data);
        result.data.map(wordObj => {
          console.log(wordObj.word);
          agent.add(JSON.stringify(wordObj.word));
          return;
          // agent.end(`${wordObj.word}`);
        });
      });
  };

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('rhymingWord', rhymingWordHandler);
  agent.handleRequest(intentMap);
}



