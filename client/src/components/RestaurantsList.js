import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//So cuisine is the only thing that actually filters on the webpage. Any idea why neighborhood and visited don't work?
//how do i add other filters to the query string? /
//each filter now works separately, but for example if I hit "visited" and then try to search for a neighborhood it won't show up
//I think the issue is that the query string is being overwritten each time a new filter is added. I need to append to the query string instead of overwriting it
//I think I need to use the URLSearchParams object to append to the query string
//how do i code this?
//I think I need to create a new URLSearchParams object and then use the append method to add to the query string
//can you show me how this works in code?
//yeah but can you show me
//Please use URLSearchParams object to append to the query string in the fetchRestaurants function 
//I'm not sure how to do this


const RestaurantsList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [cuisine, setCuisine] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [visited, setVisited] = useState(false);

    const fetchRestaurants = () => {
        //Initialize URLParams object
        const params = new URLSearchParams();

        //Append parameters if they exist
        if (cuisine) params.append('cuisine', cuisine);
        if (neighborhood) params.append('neighborhood', neighborhood);
        
        //Check if visited has been set (including false expicitly)
        if(visited !== '') params.append('visited', visited)

        //Construct the query string with parameters
        const queryString = params.toString();
        const queryURL = `/restaurants?${queryString}`;

        fetch(queryURL)
        .then(response => response.json())
        .then(data => setRestaurants(data));
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
            </div>
            <ul>
                {restaurants.map(restaurant => (
                    <li key={restaurant.id}>{restaurant.name} - {restaurant.cuisine} - {restaurant.neighborhood}</li>
                ))}
            </ul>
            <Link to='/restaurants/new'>Add New Restaurant</Link>
        </div>
    );
};

export default RestaurantsList;