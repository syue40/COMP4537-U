const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const app = express()
const port = 5000

//'mongodb+srv://user1:1122@mydatabase.cq9hxg1.mongodb.net/myDatabase?retryWrites=true&w=majority'
//process.env.PORT

function containsAnyLetters(str) {
    // Check if params have any invalid inputs
    return /[a-zA-Z]/.test(str) ;
}

function lengthChecker(res, docs){
    // Check if document returned is empty for when user enters non-existent pokemon ID
    if(docs.length > 0){
        res.json(docs)
    } else {
        console.log("Pokemon not found")
        res.json({ errMsg: "Pokemon not found" })
    }
}

app.listen(process.env.PORT, async () => {
    // Start instance and read data
    try {
        await mongoose.connect('mongodb+srv://testuser:1122@test.kh8lwvb.mongodb.net/?retryWrites=true&w=majority')
        mongoose.connection.db.dropDatabase();
    } catch(err) {
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
            var arr = JSON.parse(chunks);

            arr = arr.map((pokemon) => {
                pokemon.base["Special Attack"] = pokemon.base["Sp. Attack"];
                pokemon.base["Special Defense"] = pokemon.base["Sp. Defense"];
                delete pokemon.base["Sp. Attack"];
                delete pokemon.base["Sp. Defense"];
                return pokemon;
            });
            // console.log(arr)
            pokemonModel.insertMany(arr).then(
                console.log("Successfully populated database!")
            ).catch(function(error){
                console.log(error);
            });
        })
    })
    
})

app.get('/api/v1/pokemons', function(req, res) {
    // gets all Pokemons, has query params for limiting # of Pokemon and for which ID to start from.
    // can work with either after, count, or both
    var after = null
    var count = null
    console.log(req.query);
    if(req.query){
        after = {id: {$gt: parseInt(req.query.after)}}
        count = parseInt(req.query.count)
        if(!req.query.count){count = ""}
        if(!req.query.after){after = {}}
        
        pokemonModel.find(after).limit(count)
            .then(docs => { lengthChecker(res, docs) })
            .catch(err => {
                console.error(err)
                res.json({ msg: "Error reading pokemon query." })
        })
    } else {
        pokemonModel.find({})
            .then(docs => { lengthChecker(res, docs) })
            .catch(err => {
                console.error(err)
                res.json({ msg: "Error returning all pokemon" })
        })
    }
  })

app.get('/api/v1/pokemon/:id', (req, res) => {
    // - gets a Pokemon by their ID
    if(!containsAnyLetters(req.params.id)){
        pokemonModel.find({id: parseInt(req.params.id)})
        .then(doc => {
            lengthChecker(res, doc)
        }).catch(err => {
            console.error(err)
            res.json({ errMsg: "Error returning singular pokemon" })
        })
    } else { res.json({ errMsg: "Cast Error: pass pokemon id between 1 and 811" }) }
    
})

app.get('/api/v1/pokemonImage/:id', (req, res) => {
    // - gets a Pokemon's image URL by their ID
    var pokeId = req.params.id;
    if(!containsAnyLetters(pokeId)){
        pokemonModel.find({id: parseInt(pokeId)})
        .then(doc => {
            if(doc.length > 0){
                if((pokeId).length==1){
                    pokeId = "00" + pokeId
                } else if((pokeId).length==2){
                    pokeId = "0" + pokeId
                }
                res.json({url: `https://github.com/fanzeyi/pokemon.json/blob/master/thumbnails/${pokeId}.png`, name: doc[0].name.english})
            } else {
                console.log("No Pokemons found")
                res.json({ errMsg : "Pokemon not found" })
            }
        }).catch(err => {
            console.error(err)
            res.json({ errMsg: "Error returning singular pokemon" })
        })
    } else { res.json({ errMsg: "Invalid Entry" }) }
}) 

app.use(express.json())
app.post('/api/v1/pokemon', (req, res) => {
    // - creates a new Pokemon
    pokemonModel.create(req.body, function (err) {
        if (err) {
            /* For some reason this error will be thrown when trying to create a duplicate Pokemon locally, but is not thrown on mongo Atlas */
            res.json({errMsg: "Duplicate key or invalid format, please try again."})
        } else {
            res.json({msg: "Added Successfully", body: req.body})
        }
    });
})  

app.delete('/api/v1/pokemon/:id', (req, res) => {
    // - delete a unicorn
    var pokeId = req.params.id
    if(!containsAnyLetters(pokeId)){
        pokemonModel.deleteOne({ id: parseInt(pokeId) }, function (err, result) {
            if (err) {
                res.json({errMsg: "Pokemon not found"})
            } else {
                if(result.deletedCount == 0){
                    res.json({errMsg: "Pokemon not found"})
                } else {
                    res.json({msg: "Deleted Successfully", pokeInfo:{ id:pokeId }})
                }
            }
        });
    } else { 
        res.json({ errMsg: "Invalid Entry" }) 
    }
})

app.patch('/api/v1/pokemon/:id', (req, res) => {
    // - update a pokemon 
    var pokeId = req.params.id
    const { id, ...rest } = req.body;
    if(!containsAnyLetters(pokeId)){
        pokemonModel.updateOne({ id: parseInt(pokeId) }, {$set: { ...rest}}, { runValidators: true }, function (err, res) {
        if (err) console.log(err)
        console.log(res)
        });
        res.json({ msg:"Updated Successfully", pokeInfo:{id: pokeId, ...rest}})
    } else {
        res.json({ errMsg: "Invalid Entry" }) 
    }
})

app.put('/api/v1/pokemon/:id', (req, res) => {
    // upserts a whole pokemon document
    var pokeId = req.params.id
    const { id, ...rest } = req.body;
    if(!containsAnyLetters(pokeId)){
        pokemonModel.findOneAndUpdate({ id: parseInt(pokeId) }, {$set: { ...rest}, }, { runValidators: true, upsert: true, new:true }, function (err) {
        if (err) {
            res.json({ errMsg: "Invalid Entry" })
        } else {
            console.log(res)
            res.json({ msg:"Updated/Created Successfully", pokeInfo:{id: pokeId, ...rest}})
        }
        });
    } else {
        res.json({ errMsg: "Invalid Entry" }) 
    }
}) 

app.get('*', function (req, res) {
    // handles improper routing
    res.json({msg: "Improper route. Check API docs plz."});
})

var possibleTypes = []
var { Schema } = mongoose;
const pokemonSchema = new Schema({
    "id": {
        type: Object,
        unique: true
    },
    "name": {
        "english": { type: String, max: 20 },
        "japanese": { type: String, max: 20 },
        "chinese": { type: String, max: 20 },
        "french": { type: String, max: 20 }
    },
    "type": {
        type: [String],
        enum: possibleTypes
    },
    "base": {
        "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Special Attack": Number,
        "Special Defense": Number,
        "Speed": Number
    }
});
const pokemonModel = mongoose.model('pokemons', pokemonSchema);