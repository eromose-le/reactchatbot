/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Include nodejs request-promise-native package as dependency
// because async API calls require the use of Promises
const rpn = require('request-promise-native');
const hostAPI = 'https://my.api.here/'; // root URL of the API
const { WebhookClient } = require('dialogflow-fulfillment');

exports.googleCloudSearch = (req, res) => {
    const agent = new WebhookClient({ request: req, response: res }); // Dialogflow agent
    console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers)); // testing
    console.log('Dialogflow Request body: ' + JSON.stringify(req.body)); // testing

    // Default welcome intent
    function welcome(agent) {
        agent.add('Welcome to my chatbot!');
    }

    // Default fallback intent
    function fallback(agent) {
        agent.add('Sorry, I don\'t understand.');
    }

    // Default conversation end
    function endConversation(agent) {
        agent.add('Thank you and have a nice day!');
    }

    // Function for passing data to the myapi.search intent in Dialogflow
    function searchMyApi(agent) {
        return new Promise((resolve, reject) => {
            // get parameters given by user in Dialogflow
            const param1 = agent.parameters.param1;
            const param2 = agent.parameters.param2;
            // and so on...

            console.log(`Parameters from Dialogflow: ${param1}, ${param2}`); // testing

            // If necessary, format the parameters passed by Dialogflow to fit the API query string.
            // Then construct the URL used to query the API.

            var myUrl = `${hostAPI}?parameter_1=${param1}&parameter_2=${param2}`;
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

                    var result = ''; // the answer passed to Dialogflow goes here 

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
                        var output = ''; // put the data here
                        result = agent.add(`Here are the results of your search: ${output}`);
                        resolve(result); // Promise resolved
                    }
                }) // .then end
                .catch(() => { // if .then fails
                    console.log('Promise rejected');
                    let rejectMessage = agent.add('Sorry, an error occurred.');
                    reject(rejectMessage); // Promise rejected
                });	// .catch end
        }); // Promise end
    } // searchMyApi end

    // Mapping functions to Dialogflow intents
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('End Conversation', endConversation);
    intentMap.set('myapi.search', searchMyApi);
    agent.handleRequest(intentMap);

}; // exports end