import "./App.sass"; // Import the styles for the App component
import React, { useState, useEffect } from "react"; // Import the useState and useEffect hooks

/*
useState: A hook that allows you to add state to a functional component. It returns an array with two elements:
  1. The current state value
  2. A function that allows you to update the state value

useEffect: A hook that allows you to perform side effects in a functional component. It takes two arguments:
  1. A function that contains the side effect logic
  2. An array of dependencies that determines when the side effect should run
*/

// The PokemonOfTheDay component fetches a random Pokemon from the PokeAPI and displays its name, number, and image.
const PokemonOfTheDay = () => {
  // Create a state variable to store the Pokemon data
  const [pokemon, setPokemon] = useState({ name: "", number: "", image: "" });

  // Use the useEffect hook to fetch a random Pokemon when the component mounts
  useEffect(() => {
    // Define an async function to fetch a random Pokemon
    const getPokemonOfTheDay = async () => {
      // Generate a seed based on the current date
      const today = new Date(); // Get the current date
      const seed =
        today.getDate() * 10000 + today.getMonth() * 100 + today.getFullYear(); // Combine the day, month, and year into a seed
      const pokemonID = (seed % 1025) + 1; // Generate a random Pokemon ID between 1 and 1025
      const url = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`; // Construct the API URL for the random Pokemon

      // Fetch the random Pokemon data from the PokeAPI
      try {
        const response = await fetch(url); // Make a GET request to the API URL
        const data = await response.json(); // Parse the JSON response
        // Extract the relevant data from the API response and update the state
        setPokemon({
          name: data.name, // Extract the Pokemon name
          number: data.id, // Extract the Pokemon ID
          image: data.sprites.other.home.front_default, // Extract the Pokemon image URL
        });
      } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching Pokemon of the Day:", error);
      }
    };

    // Call the async function to fetch a random Pokemon when the component mounts
    getPokemonOfTheDay();
  }, []); // The empty dependency array ensures that the effect runs only once when the component mounts

  // Render the Pokemon data in the component
  return (
    <div className="POTD-Card">
      <img src={pokemon.image} alt={pokemon.name} />
      <div className="POTD-idName">
        <span className="POTD-id">#{pokemon.number}</span>
        <span className="POTD-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </span>
      </div>
    </div>
  );
};

// The TagPOTD component displays a tagline and the Pokemon of the Day component.
function TagPOTD() {
  return (
    <section className="tag-potd">
      <div className="tagline">
        <div>
          <h1>Explore</h1>
          <h2>the world</h2>
        </div>
        <div>
          <h2> of</h2>
          <h1>Pokemon!</h1>
        </div>
      </div>
      <div className="potd">
        <h3>
          Pokemon of <br /> the Day
        </h3>
        <PokemonOfTheDay />
      </div>
    </section>
  );
}

// The SearchFilter component allows users to search for Pokemon by name, number, or type, and filter by Mega Evolutions and Gigantamax Forms.
function SearchFilter() {
  return (
    <section className="search-filter">
      <div className="search">
        <input type="text" placeholder="Search by Name, #, or Type" />
        <button>Search</button>
      </div>
      <div className="filter">
        <form>
          <input type="checkbox" id="filter-mega" />
          <label htmlFor="filter-mega">Show Mega Evolutions</label>
          <input type="checkbox" id="filter-gigantamax" />
          <label htmlFor="filter-gigantamax">Show Gigantamax Forms</label>
        </form>
      </div>
    </section>
  );
}

// The PokemonCard component displays the details of a single Pokemon, including its name, number, image, and types.
function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <div className="pokemon-ID-Name">
        <span className="pokemon-ID">#{pokemon.id}</span>
        <span className="pokemon-name">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </span>
      </div>
      <img className="pokemon-image" src={pokemon.image} alt={pokemon.name} />
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span key={type.type.name} className={`type ${type.type.name}`}>
            {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}

// The ListPokemonCards component fetches and displays a list of Pokemon cards.
function ListPokemonCards() {
  const [pokemon, setPokemon] = useState([]); // Create a state variable to store the list of Pokemon
  const [loading, setLoading] = useState(false); // Create a state variable to track the loading state
  const [pokemonCount, setPokemonCount] = useState(40); // Create a state variable to track the number of Pokemon to fetch

  // Define an async function to fetch Pokemon data from the PokeAPI
  const fetchPokemon = async (start, count) => {
    // The function takes a start index and a count of Pokemon to fetch
    setLoading(true); // Set the loading state to true
    // Loop through the range of Pokemon IDs to fetch
    for (let id = start; id < count && id <= 1025; id++) {
      // Make a GET request to the PokeAPI to fetch the Pokemon data
      try {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Construct the API URL for the Pokemon
        let data = await response.json(); // Parse the JSON response
        setPokemon((prev) => {
          // Update the state with the new Pokemon data
          const exists = prev.some((p) => p.id === data.id); // Check if the Pokemon already exists in the list
          return exists // If the Pokemon exists, return the previous state
            ? prev // If the Pokemon does not exist, add it to the list
            : [
                // Return a new array with the existing Pokemon and the new Pokemon
                ...prev, // Spread the existing Pokemon
                {
                  // Add the new Pokemon to the array
                  id: data.id, // Extract the Pokemon ID
                  name: data.name, // Extract the Pokemon name
                  image: data.sprites.other.home.front_default, // Extract the Pokemon image URL
                  types: data.types, // Extract the Pokemon types
                },
              ];
        });
      } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error("Error fetching Pokemon:", error);
      }
    }
    setLoading(false); // Set the loading state to false
  };

  // Use the useEffect hook to fetch Pokemon data when the component mounts and when the number of Pokemon to fetch changes
  useEffect(() => {
    fetchPokemon(1, pokemonCount + 1); // Call the fetchPokemon function with the initial range of Pokemon IDs
  }, [pokemonCount]); // The effect runs when the component mounts and when the pokemonCount state changes

  // Use the useEffect hook to implement infinite scrolling
  useEffect(() => {
    // Define a scroll event handler to load more Pokemon when the user scrolls to the bottom of the page
    const handleScroll = () => {
      if (
        // Check if the user has scrolled to the bottom of the page and the loading state is false
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        // Increase the number of Pokemon to fetch by 20
        setPokemonCount((prev) => prev + 20);
      }
    };

    // Add the scroll event listener to the window
    window.addEventListener("scroll", handleScroll);
    // Remove the scroll event listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]); // The effect runs when the loading state changes

  // Render the list of Pokemon cards in the component
  return (
    <section className="pokemon-cards">
      {pokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </section>
  );
}

function Pokedexer() {
  return (
    <>
      <TagPOTD />
      <SearchFilter />
      <ListPokemonCards />
    </>
  );
}

export default Pokedexer;
