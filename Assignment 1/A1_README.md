# Assignment 1
### Name: Sean Yue
### UID: A01228440

This application loads content from a JSON file hosted on Github containing all Pokemon plus their attributes.
The file then uses a Pokemon Schema to create Pokemon objects in our NoSQL database.

The application contains the following routes:
- ```/api/v1/pokemons?count=<number>&after=<number>```
    - this is a ```GET``` request
    - this route will select all the pokemons *after* an id number of a pokemon (ie. id: 143 --> after=143 fetches all Pokemon with ids after 143)
    - this route will limit the selection to *count* number of Pokemons (ie. count=2, limits the total selection of Pokemon to 2)
    - note this request can be made with/without the count and after parameters. It can also include one or the other. If no params are supplied it will return all the pokemon.
- ```/api/v1/pokemon```
    - this is a ```POST``` request
    - this route will create a new pokemon
    - ISSUE: while the unique id of a pokemon is validated locally, when the db is hosted on Mongo Atlas it no longer verifies whether an id is unique before adding a pokemon
- ```/api/v1/pokemon/:id```
    - this is a ```GET``` request
    - this route will get a pokemon by their ID (ie. Bulbasaur has ID of 1)
- ```/api/v1/pokemonImage/:id```
    - this is a ```GET``` request
    - this route will return a pokemon's image URL which is associated with their ID
- ```/api/v1/pokemon/:id```
    - this is a ```PATCH``` request
    - this will patch a Pokemon document or a part of the document with new details
- ```/api/v1/pokemon/:id```
    - this is a ```PUT``` request
    - this request will upsert a whole Pokemon document
- ```/api/v1/pokemon/:id```
    - this is a ```DELETE``` request
    - this will delete a Pokemon if it is found
