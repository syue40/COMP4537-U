import React from 'react'

function City({ z }) {
  console.log(z);
  const { description, name, temperature } = z
  return (
    <div>
      City {name} temperature is {temperature}  and the weather description is {description}
      <hr />
    </div>
  )
}

export default City