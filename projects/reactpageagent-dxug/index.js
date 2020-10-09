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

  function rhymData(result) {
    let count = 0;
    let str = "";
    return new Promise(resolve => {
      result.data.map(wordObj => {
        console.log(wordObj.word);
        str = str + `${wordObj.word}, `;
        console.log(count === result.data.length - 1);
        if (count === result.data.length - 1) {
          resolve(str);
        }
        count++;
        // agent.end(`${wordObj.word}`);
      });
    });
    // });
  }

  function rhymHandler(agent) {
    const word = agent.parameters.word;
    return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
      .then((result) => {
        return rhymData(result).then(res => {
          agent.add(`Here are the rhyming words for ${word}`);
          agent.add(res);
          console.log("res", res);
        });
      }).catch(err => {
        console.log(err);
        agent.add("Something went wrong");
      });
  }

  let intentMap = new Map();
  intentMap.set('rhymingWord', rhymHandler);
  agent.handleRequest(intentMap);
}



