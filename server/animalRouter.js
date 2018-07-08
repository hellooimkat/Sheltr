const express = require('express');

const router = express.Router();
const axios = require('axios');
const apiKey = require('../api/apiKey');

router.get('/:type', (req, res) => {
  const { type } = req.params;
  let animal;
  if (type === 'Dogs') {
    animal = 'dog';
  } else if (type === 'Cats') {
    animal = 'cat';
  } else if (type === 'Birds') {
    animal = 'bird';
  } else if (type === 'Reptiles') {
    animal = 'reptile';
  } else if (type === 'Small & Furry') {
    animal = 'smallfurry';
  } else if (type === 'Barnyard') {
    animal = 'barnyard';
  } else {
    res.send({ data: null });
  }
  axios({
    method: 'GET',
    url: 'http://api.petfinder.com/pet.find',
    params: {
      key: apiKey,
      format: 'json',
      location: 94158,
      animal,
      output: 'full',
    },
  })
    .then((response) => {
      const pets = [];
      const list = ['name', 'age', 'size', 'breeds', 'description', 'media'];
      response.data.petfinder.pets.pet.forEach((pet) => {
        const petData = {};
        list.forEach((category) => {
          if (pet[category]) {
            if (category !== 'media' && category !== 'breeds') {
              petData[category] = pet[category].$t;
            } else if (category === 'media') {
              petData[category] = pet[category].photos;
            } else if (category === 'breeds') {
              petData[category] = pet[category].breed;
            }
          } else {
            petData[category] = {};
          }
        });
        pets.push(petData);
      });
      console.log(JSON.stringify(pets));
      res.send({ pets });
    })
    .catch(err => console.log(err));
});

module.exports = router;
