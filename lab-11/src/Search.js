import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function Search({ types, checkedState, setCheckedState }) {
  var currentTypes = checkedState.types_array;
  const handleClearFilters = () => {
    setHealthValue([20, 37]);
    setAttackValue([20, 37]);
  }

  const handleButtonClick = () => {
    console.log(healthValue)
    console.log(attackValue)
    console.log(currentTypes)
    setCheckedState({"types_array": currentTypes, "health_range": healthValue, "attack_range": attackValue});
  }

  const onChangeHandle = (type) => {
    console.log(type)
    const index = types.current.indexOf(type);
    currentTypes[index] === true ? currentTypes[index] = false : currentTypes[index] = true

    console.log(currentTypes)
  }

  // const [newCheckedState, setNewCheckedState] = React.useState([])
  const [healthValue, setHealthValue] = React.useState([20, 37]);
  const [attackValue, setAttackValue] = React.useState([20, 37]);

  const handleHealthChange = (event, newValue) => {
    setHealthValue(newValue);
  };

  const handleAttackChange = (event, newValue) => {
    setAttackValue(newValue);
  };

  return (
    <div>
      <h1 class="flex justify-center text-xl font-bold bg-black text-white p-3">Search Filters</h1>
      <div class="flex justify-center">
        <div class="mr-5">
          <h1 class="mt-3">Health Filter</h1>
          <div class="flex mt-4">
            <div class="mr-3">{healthValue[0]}</div>
              <Box sx={{ width: 300 }}>
                <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={healthValue}
                  onChange={handleHealthChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            <div class="ml-3">{healthValue[1]}</div>
          </div>
          <h1 class="mt-3">Attack Filter</h1>
          <div class="flex mt-4">
            <div class="mr-3">{attackValue[0]}</div>
              <Box sx={{ width: 300 }}>
                <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={attackValue}
                  onChange={handleAttackChange}
                  valueLabelDisplay="auto"
                />
              </Box>
            <div class="ml-3">{attackValue[1]}</div>
          </div>
        </div>
        <div class="w-1/4 m-4">
          <div class="grid grid-cols-3 gap-2">
            {
              types.current.map(type => {
                return (
                  <span class="" key={type}>
                    <input type="checkbox" name="pokeTypes" value={type} id={type} onChange={() => { onChangeHandle(type) }} />
                    <label class="ml-2" htmlFor={type}>{type}</label>
                    <br />
                  </span>
                )
              })
            }
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
          
          <button class="bg-black hover:bg-gray-600 active:bg-gray-500 text-white p-5 m-4" onClick={handleButtonClick}>
            Submit
          </button>
          <button class="bg-black hover:bg-gray-600 active:bg-gray-500 text-white p-5 m-4" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
    </div>
  )
}

export default Search