import axios from 'axios'
import React, { useEffect, useState } from 'react'
function PokemonProfile(pokemon) {
    const [currentPokemon, setCurrentPokemon] = useState("")
    var matches = []
    const [pokemons, setPokemonList] = useState({
        "base": {
            "Attack": 0,
            "Defense": 0,
            "HP": 0,
            "Sp. Attack": 0,
            "Sp. Defense": 0
        },
        "id": 0,
        "name": {
            "english": "",
        },
        "type": []
    })
    const getThreeDigitId = (id) => {
        var stringId = (window.location.pathname).substring(3)
        matches = stringId.match(/(\d+)/);
        if(id){
            if (id < 10) return `00${id}`
            if (id < 100) return `0${id}`
            console.log(id);
            return id
        } else {
            if (matches[0] < 10) return `00${matches[0]}`
            if (matches[0] < 100) return `0${matches[0]}`
            return matches[0]
        }
        
      }
    useEffect(() => {
        axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json')
            .then(res => res.data)
            .then(data => {
                if(!pokemon.pokemon){

                    var stringId = (window.location.pathname).substring(3)
                    matches = stringId.match(/(\d+)/);
                    console.log(matches[0])
                    data = (data.filter(item => item.id.toString() === matches[0].toString()))
                } else {
                    data = (data.filter(item => item.id.toString() === pokemon.pokemon.toString()))
                }
                
                return data
            })
            .then(res => {
            console.log(res[0])
            setPokemonList(res[0])
            })
    }, [])

    return (
        <div>
            <div >
                <h1 class="flex bg-black text-white text-xl p-5 content-center justify-center">{pokemons.name.english}</h1>
            </div>
            <div>
            {
                pokemon.pokemon ? <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${getThreeDigitId(pokemon.pokemon)}.png`} /> :
                <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${getThreeDigitId(matches[0])}.png`} />
            }
            
            <ul class="content-center m-5">
                <li>HP: {pokemons.base.HP}</li>
                <li>Attack: {pokemons.base.Attack}</li>
                <li>Defense: {pokemons.base.Defense}</li>
                <li>Sp. Attack: {pokemons.base["Sp. Attack"]}</li>
                <li>Sp. Defense: {pokemons.base["Sp. Defense"]}</li>
                <li>Speed: {pokemons.base.Speed}</li>
                <li>Type(s): {pokemons.type.map(index => index+" ")}</li>
            </ul>
            </div>
            <div class="">
                
            </div>
        </div>
  )
}

export default PokemonProfile