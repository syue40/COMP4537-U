const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError
} = require("./errors.js")

const { asyncWrapper } = require("./asyncWrapper.js")

const dotenv = require("dotenv")
dotenv.config();


const userModel = require("./userModel.js")

const app = express()
const port = 5000
var pokeModel = null;
const assignedTokens = [];

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
app.use(express.json())

const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

const jwt = require("jsonwebtoken")
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }

  if(!user.loginToken){
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    assignedTokens.push(token);
    // const refreshToken = jwt.sign({ username: user.username}, process.env.TOKEN_SECRET);

    const updatedUser = await userModel.findOneAndUpdate({ username: username }, {loginToken: token})
    if (updatedUser) {
      res.header('auth-token', token)
      res.send(user)
    } else {
      // res.json({ msg: "Not found", })
      throw new PokemonBadRequest("Error while assigning your token");
    }
  } else {
    const token = user.loginToken
    res.header('auth-token', token)
    res.send(user)
  }
}))

const auth = (req, res, next) => {
  const token = req.query["token"].trim()
  // const token = req.header('auth-token')
  
  if (!token) {
    throw new PokemonBadRequest("Access denied")
  }
  if(!assignedTokens.includes(token)){
    throw new PokemonBadRequest("You are not logged in.")
  } else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET) // nothing happens if token is valid
      next()
    } catch (err) {
      throw new PokemonBadRequest("Invalid token")
    }
  }
}

app.use(auth) // Boom! All routes below this line are protected
app.post('/logout', asyncWrapper(async (req, res) => {
  const header = req.query["token"].trim()
  const index = assignedTokens.indexOf(header);
  if (index > -1) { // only splice array when item is found
    assignedTokens.splice(index, 1); // 2nd parameter means remove one item only
  }
  const updatedUser = await userModel.findOneAndUpdate({ loginToken: header }, {loginToken: null})
    if (updatedUser) {
      res.json({
        msg: "Successfully Logged Out"
      })
    } else {
      res.json({ msg: "Not Currently Logged In." })
      // throw new PokemonBadRequest("Not Currently Logged In.");
    }
  
}))

app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  // try {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
  // } catch (err) { res.json(handleErr(err)) }
}))

app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const { id } = req.params
  const docs = await pokeModel.find({ "id": id })
  if (docs.length != 0) res.json(docs)
  else res.json({ errMsg: "Pokemon not found" })
  // } catch (err) { res.json(handleErr(err)) }
}))

app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  // try {
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
  // } catch (err) { res.json(handleErr(err)) }
}))

app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const docs = await pokeModel.findOneAndRemove({ id: req.params.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    // res.json({ errMsg: "Pokemon not found" })
    throw new PokemonNotFoundError("");
  // } catch (err) { res.json(handleErr(err)) }
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  // console.log(docs);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({ msg: "Not found", })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({  msg: "Not found" })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))

app.get("*", (req, res) => {
  // res.json({
  //   msg: "Improper route. Check API docs plz."
  // })
  throw new PokemonNoSuchRouteError("");
})

app.use(handleErr)
