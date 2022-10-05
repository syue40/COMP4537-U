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

    var possibleTypes = []
    const { Schema } = mongoose;
    const pokemonSchema = new Schema({
        "id": String,
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

// const possibleTypes = ["Normal", "Fighting", "Flying", "Poison", 
//                          "Ground", "Rock", "Bug", "Ghost", "Steel", 
//                          "Fire", "Water", "Grass", "Electric", "Psychic", 
//                          "Ice", "Dragon", "Dark", "Fairy"]
