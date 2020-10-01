'use strict';
const functions = require('firebase-functions');

const rpn = require('request-promise-native');
const hostAPI = 'https://api.datamuse.com/';

const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');



module.exports = (request, response) => {
  const agent = new WebhookClient({ request, response });

  function welcome(agent) {
    agent.add('Welcome to my agent');
  }

  // function rhymingWordHandler(agent) {
  //   const word = agent.parameters.word;
  //   agent.add(`Here are the rhyming words for ${word}`);
  //   axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
  //     .then((result) => {
  //       result.data.map(wordObj => {
  //         agent.add(wordObj.word)
  //       });
  //     }).catch(err => {
  //       console.log(err);
  //     });
  // }

  function rhymingWordHandler(agent) {

    return new Promise((resolve, reject) => {
      // get parameters given by user in Dialogflow
      const param1 = agent.parameters.word;
      // and so on...

      console.log(`Parameters from Dialogflow: ${param1}`); // testing

      // If necessary, format the parameters passed by Dialogflow to fit the API query string.
      // Then construct the URL used to query the API.

      var myUrl = `${hostAPI}words?rel_rhy=${param1}`;
      console.log('The URL is ' + myUrl); // testing

      // Make the HTTP request with request-promise-native
      // https://www.npmjs.com/package/request-promise

      var options = {
        uri: myUrl,
        headers: {
          'User-Agent': 'Request-Promise-Native'
        },
        json: true
      };

      // All handling of returned JSON data goes under .then and before .catch
      rpn(options)
        .then((json) => {

          var result = result.data.map(wordObj => {
            // the answer passed to Dialogflow goes here 

            // Make a string out of the returned JSON object
            var myStringData = JSON.stringify(json);
            console.log(`This data was returned: ${myStringData}`); // testing

            // Make an array out of the stringified JSON
            var myArray = JSON.parse(myStringData);
            console.log(`This is my array: ${myArray}`); // testing

            // Code for parsing myArray goes here, for example:

            if (condition) {
              // For example, the returned JSON does not contain the data the user wants
              result = agent.add('Sorry, could not find any results.');
              resolve(result); // Promise resolved
            }
            else {
              // If the desired data is found:
              var output = wordObj.word; // put the data here
              result = agent.add(`Here are the results of your search: ${output}`);
              resolve(result); // Promise resolved
            }
            return;
          });
        }) // .then end
        .catch(() => { // if .then fails
          console.log('Promise rejected');
          let rejectMessage = agent.add('Sorry, an error occurred.');
          reject(rejectMessage); // Promise rejected
        });	// .catch end
    }); // Promise end



    // const word = agent.parameters.word;
    // agent.add(`Here are the rhyming words for ${word}`)
    // axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
    //   .then((result) => {
    //     console.log(result.data);
    //     result.data.map(wordObj => {
    //       console.log(wordObj.word);
    //       agent.add(JSON.stringify(wordObj.word));
    //       // agent.add(JSON.stringify(wordObj.word));
    //       return;
    //       // agent.end(`${wordObj.word}`);
    //     });
    //   });


  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('rhymingWord', rhymingWordHandler);
  agent.handleRequest(intentMap);
}
//  .catch (err) {
//  next(err);
// };



// function rhymingWordHandler(agent) {
//  const word = agent.parameters.word;
//  agent.add(`Here are the rhyming words for ${word}`);
//  return axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
//   .then((result) => {
//    console.log(result.data);
//    result.data.map(wordObj => {
//     console.log(wordObj.word);
//     agent.add(wordObj.word);
//    });
//   });
//  // agent.add('intent called: ' + word);
// }