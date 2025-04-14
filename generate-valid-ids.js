const fs = require('fs');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getValidIDs() {
  const searchRes = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=cat');
  const { objectIDs } = await searchRes.json();
  const sample = objectIDs.slice(0, 50); 
  fs.writeFileSync('./public/data/validObjectIDList.json', JSON.stringify({ objectIDs: sample }, null, 2));
  console.log('validObjectIDList.json created.');
}

getValidIDs();
