import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cuisine, setCuisine] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [visited, setVisited] = useState('');
    const [randomRestaurant, setRandomRestaurant] = useState('');
    const navigate = useNavigate();
    //Add a state for the search term
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRestaurants = () => {
        //Initialize URLParams object
        const params = new URLSearchParams({cuisine, neighborhood, visited: visited.toString()});
        if (searchTerm) params.append('search', searchTerm);

        //Append parameters if they exist
        if (cuisine) params.append('cuisine', cuisine);
        if (neighborhood) params.append('neighborhood', neighborhood);
        
        //Only append 'visited' if it has a value of 'true' or 'false'
        if (visited === 'true' || visited === 'false') {
            params.append('visited', visited);
        }

        //Construct the query string with parameters
        const queryString = params.toString();
        const queryURL = `/restaurants?${params.toString()}`;

        fetch(queryURL)
        .then(response => response.json())
        .then(data => setRestaurants(data));
    };

    const fetchRandomRestaurant = () => {
        const params = new URLSearchParams();
        if (cuisine) params.append('cuisine', cuisine);
        if (neighborhood) params.append('neighborhood', neighborhood);
        if (visited !== '') {
            //Visited can be true, false, or null
            params.append('visited', visited);
        }

        const queryURL = `/restaurants/random?${params.toString()}`;

        console.log('Fetching restaurants with URL:', queryURL);
        fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            setRandomRestaurant(data);
            alert(`You should try: ${data.name} - ${data.cuisine} - ${data.neighborhood}!`)
        }).catch(error => {
            console.error('Error fetching random restaurant', error);
            alert('No matching restaurant for the selected filters')
        });
    }

    const deleteRestaurant = (restaurantId) => {
        fetch(`/restaurants/${restaurantId}`, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                //Remove the restaurant from the state to update the UI
                setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
                alert('Restaurant deleted successfully');
            } else {
                alert('Error deleting restaurant');
            }
        }).catch(error => {
            console.error('Error deleting restaurant', error);
            alert('Error deleting restaurant');
        })
    };

    const editRestaurant = (restaurantId) => {
        navigate(`/restaurants/edit/${restaurantId}`);
    };

    useEffect(() => {
        fetchRestaurants();
    }, [cuisine, neighborhood, visited]); //re-fetch when filters change

    return (
        <div>
            <h2>Restaurants</h2>
            <div>
                <input
                    type='text'
                    placeholder='Cuisine'
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                />
                <input
                    type='text'
                    placeholder='Neighborhood'
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                />
                <select
                    value={visited}
                    onChange={(e) => setVisited(e.target.value)}
                >
                    <option value=''>Visited Status</option>
                    <option value='true'>Visited</option>
                    <option value='false'>Not Visited</option>
                </select>
                <button onClick={fetchRestaurants}>Filter</button>
                <button onClick={fetchRandomRestaurant}>Randomize</button>
                <input
                    type='text'
                    placeholder='Search restaurants...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchRestaurants}>Search</button>
            </div>
            {randomRestaurant && (
                <div>
                    <h3>Random Pick</h3>
                    <p>{randomRestaurant.name} - {randomRestaurant.cuisine} - {randomRestaurant.neighborhood}</p>
                </div>
            )}
            <ul>
                {restaurants.map(restaurant => (
                    <li key={restaurant.id}>{restaurant.name} - {restaurant.cuisine} - {restaurant.neighborhood}
                        <button onClick={() => deleteRestaurant(restaurant.id)}>Delete</button>
                        <button onClick={() => editRestaurant(restaurant.id)}>Edit</button>
                    </li>
                ))}
            </ul>
            <Link to='/restaurants/new'>Add New Restaurant</Link>
            <Link to='/experiences'>See Past Memories</Link>
            <Link to='/experiences/new'>Share New Memory</Link>
        </div>
    );
};

export default RestaurantsList;