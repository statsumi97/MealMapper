import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const EditRestaurantForm = () => {
    const {restaurantId} = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState({
        name: '',
        cuisine: '',
        neighborhood: '',
        visited: false,
    });

    useEffect(() => {
        //Fetch the restaurant details to edit
        fetch(`/restaurants/${restaurantId}`)
        .then(response => response.json())
        .then(data => setRestaurant(data))
        .catch(error => console.error('Error fetching restaurant details', error));
    }, [restaurantId]); 

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setRestaurant(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/restaurants/${restaurantId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(restaurant),
        }).then(response => {
            if (response.ok) {
                alert('Restaurant updated successfully');
                navigate('/home') //navigate back to the restaurant list
            } else {
                alert('Failed to update restaurant');
            }
        });
    };

    return (
        <div>
            <h2>Edit Restaurant</h2>
            <form onSubmit={handleSubmit}>
                <input
                    id='name'
                    name='name'
                    type='text'
                    value={restaurant.name}
                    onChange={handleChange}
                    placeholder='Restaurant Name'
                />
                <input
                    id='cuisine'
                    name='cuisine'
                    type='text'
                    value={restaurant.cuisine}
                    onChange={handleChange}
                    placeholder='Cuisine'
                />
                <input
                    id='neighborhood'
                    name='neighborhood'
                    type='text'
                    value={restaurant.neighborhood}
                    onChange={handleChange}
                    placeholder='Neighborhood'
                />
                <label>
                    Visited:
                <input
                    id='visited'
                    name='visited'
                    type='checkbox'
                    checked={restaurant.visited}
                    onChange={handleChange}
                />
                </label>
                <button type='submit'>Update Restaurant</button>
            </form>
        </div>
    )
}

export default EditRestaurantForm;

