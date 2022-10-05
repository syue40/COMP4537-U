# Assignment 1
### Name: Sean Yue
### UID: A01228440

This application loads content from a JSON file hosted on Github containing all Pokemon plus their attributes.
The file then uses a Pokemon Schema to create Pokemon objects in our NoSQL database.

The application contains the following routes:
- /api/v1/pokemons?count=<number>&after=<number>
    - this is a GET request
    - this route will select all the pokemons *after* an id number of a pokemon (ie. id: 143 --> after=143 fetches all Pokemon with ids after 143)
    - this route will limit the selection to *count* number of Pokemons (ie. count=2, limits the total selection of Pokemon to 2)
    - note this request can be made with/without the count and after parameters. It can also include one or the other. If no params are supplied it will return all the pokemon.
- /api/v1/pokemon
    - this is a POST request
    - this route will create a new pokemon