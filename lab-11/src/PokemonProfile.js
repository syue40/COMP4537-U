import Pokemon from './Pokemon'
import React, { useEffect, useState } from 'react'
function PokemonProfile(pokemon) {
    useEffect(() => {
        console.log(pokemon)
    }, [])

    return (
        <div>
            <h1 class="flex justify-center mt-5 mb-10">
                Page Number: 
            </h1>
            <div className="pokemon-list">

            </div>
        </div>
  )
}

export default PokemonProfile