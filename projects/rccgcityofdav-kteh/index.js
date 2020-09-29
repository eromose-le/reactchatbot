const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');


module.exports = (request, response) => {
  const agent = new WebhookClient({ request, response });

  //-----------------------------------------------------------------------------------
  // QueryTheSpreadSheet Table
  // -----------------------------------------------------------------------------------
  function getTestimonyData() {
    return axios.get('https://sheetdb.io/api/v1/t4kthfdyj7r1a');
  }

  function rccgtestimony(agent) {
    const name = agent.parameters.name;
    return getTestimonyData().then(res => {
      res.data.map(person => {
        if (person.Name === name)
          agent.add(`Here are the details for ${name}. Email: ${person.Email}, Testimony: ${person.Testimony}`);
      });
    });
  }

  function getPrayerData() {
    return axios.get('https://sheetdb.io/api/v1/73szfn20zzxa9');
  }

  function rccgprayer(agent) {
    const name = agent.parameters.name;
    return getPrayerData().then(res => {
      res.data.map(person => {
        if (person.Name === name)
          agent.add(`Here are the details for ${name}. Phone: ${person.Phone}, Prayer: ${person.Prayer}`);
      });
    });
  }


  // -----------------------------------------------------------------------------------
  // PostTheSpreedSheet Table
  // -----------------------------------------------------------------------------------
  // 1.5Yes(follow-back intent) => Testimony
  function saveTestimonyHandler(agent) {
    const { name, email, testimony } = agent.parameters;

    const data = [{
      Name: name,
      Email: email,
      Testimony: testimony
    }];
    // fetch api from spreadsheet
    axios.post('https://sheet.best/api/sheets/87f2494d-ed85-4205-9eba-68cfe74908f8', data);
  }


  // 1.6Yes(follow-back intent) => Prayer
  function savePrayerHandler(agent) {
    const { name, phone, prayer } = agent.parameters;

    const data = [{
      Name: name,
      Phone: phone,
      Prayer: prayer
    }];
    // fetch api from spreadsheet
    axios.post('https://sheet.best/api/sheets/56721aa2-eb09-4782-856f-c3dd3d6e59a0', data);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', rccgtestimony);
  intentMap.set('Default Welcome Intent', rccgprayer);
  // intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('1.5Yes', saveTestimonyHandler);
  intentMap.set('1.6Yes', savePrayerHandler);
  agent.handleRequest(intentMap);
}