import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

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

    const actualUserId = localStorage.getItem('user_id');

    //Fetch user's favorites and determine whether each restaurant in the list is a favorite
    const userId = localStorage.getItem('user_id');
    const [userFavorites, setUserFavorites] = useState([]);
    
    const fetchUserFavorites = () => {
      fetch(`/users/${userId}/favorites`)
        .then(response => response.json())
        .then(data => {
          const favoriteIds = data.map(favorite => favorite.id);
          setUserFavorites(favoriteIds);
        })
        .catch(error => console.error('Error fetching user favorites', error));
    };

    useEffect(() => {
      fetchUserFavorites();
    }, []);

    return (
        <div className="min-h-screen bg-y2k-bg bg-cover p-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-y2k-pink mb-4">Restaurants</h2>
            <div className="inline-block bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="input input-bordered input-y2k-pink w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="Neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="input input-bordered input-y2k-pink w-full max-w-xs"
                />
                <select
                  value={visited}
                  onChange={(e) => setVisited(e.target.value)}
                  className="select select-bordered select-y2k-pink w-full max-w-xs"
                >
                  <option value="">Visited Status</option>
                  <option value="true">Visited</option>
                  <option value="false">Not Visited</option>
                </select>
                <button onClick={fetchRestaurants} className="btn btn-y2k-pink">Filter</button>
                <button onClick={fetchRandomRestaurant} className="btn btn-y2k-pink">Randomize</button>
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-y2k-pink w-full max-w-xs"
                />
                <button onClick={fetchRestaurants} className="btn btn-y2k-pink">Search</button>
              </div>
              {randomRestaurant && (
                <div className="text-y2k-pink">
                  <h3>Random Pick</h3>
                  <p>{randomRestaurant.name} - {randomRestaurant.cuisine} - {randomRestaurant.neighborhood}</p>
                </div>
              )}
            </div>
          </div>
          <ul className="space-y-4">
            {restaurants.map(restaurant => (
              <li key={restaurant.id} className="bg-white bg-opacity-80 rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <span>
                    {restaurant.name} - {restaurant.cuisine} - {restaurant.neighborhood}
                  </span>
                  <div className="flex items-center gap-2">
                    <FavoriteButton
                      userId={userId}
                      restaurantId={restaurant.id}
                      isFavorited={userFavorites.includes(restaurant.id)}
                      onToggle={fetchUserFavorites}
                    />
                    <button onClick={() => deleteRestaurant(restaurant.id)} className="btn btn-error btn-xs">Delete</button>
                    <button onClick={() => editRestaurant(restaurant.id)} className="btn btn-info btn-xs">Edit</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center gap-4">
            <Link to='/restaurants/new' className="btn btn-y2k-pink">Add New Restaurant</Link>
            <Link to='/experiences' className="btn btn-y2k-pink">See Past Memories</Link>
            <Link to='/experiences/new' className="btn btn-y2k-pink">Share New Memory</Link>
            <Link to={`/users/${actualUserId}`} className="btn btn-y2k-pink">My Profile</Link>
            <Link to={`/users/${userId}/preferences`} className="btn btn-y2k-pink">View/Edit Preferences</Link>
          </div>
        </div>
      );
    };

export default RestaurantsList;