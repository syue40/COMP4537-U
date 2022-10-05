const express = require('express')
const mongoose = require('mongoose')
const https = require('https')

const app = express()
const port = 5000
app.listen(port, async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test')
        mongoose.connection.db.dropDatabase();
    } catch(eror) {
        console.log('db error');
    }
    console.log(`Example app listening on port ${port}`)

    await https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json", async (res) => {
        var chunks = "";
        res.on("data", function(chunk){
            chunks = chunks.concat(chunk);
        });
        res.on("end", function(){
            possibleTypes = JSON.parse(chunks);
            // console.log(possibleTypes)
        })
    })

    https.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (res){
        var chunks = "";
        res.on("data", function(chunk){
            chunks = chunks.concat(chunk);
        });
        res.on("end", function(){
            const arr = JSON.parse(chunks);
            // console.log(arr)
            pokemonModel.insertMany(arr).then(
                console.log("Success!")
            ).catch(function(error){
                console.log(error);
            });
        })
    })
    
})

app.get('/api/v1/pokemons', function(req, res) {
    pokemonModel.find({id: {$gte: parseInt(req.query.after)} }).limit(parseInt(req.query.count))
      .then(docs => {
        // console.log(docs)
        res.json(docs)
      })
      .catch(err => {
        console.error(err)
        res.json({ msg: "db reading .. err.  Check with server devs" })
      })
  })

var possibleTypes = []
const { Schema } = mongoose;
const pokemonSchema = new Schema({
    "id": Number,
    "name": {
        "english": String,
        "japanese": String,
        "chinese": String,
        "french": String
    },
    "type": {
        type: [String],
        enum: possibleTypes
    },
    "base": {
        "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Sp. Attack": Number,
        "Sp. Defense": Number,
        "Speed": Number
    }
});
const pokemonModel = mongoose.model('pokemons', pokemonSchema);