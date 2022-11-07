const mongoose = require("mongoose")
const express = require("express")

const app = express()
const port = 5000
var pokeModel = null;

const start = asyncWrapper(async () => {
  await connectDB();
  const pokeSchema = await getTypes();
  pokeModel = await populatePokemons(pokeSchema);

  app.listen(port, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${port}`);
  })
})
start()