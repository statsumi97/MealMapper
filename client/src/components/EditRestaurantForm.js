import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';

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
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl space-y-4 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-purple-600">Edit Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={restaurant.name}
                        onChange={handleChange}
                        placeholder="Restaurant Name"
                        className="input input-bordered w-full"
                    />
                    <input
                        id="cuisine"
                        name="cuisine"
                        type="text"
                        value={restaurant.cuisine}
                        onChange={handleChange}
                        placeholder="Cuisine"
                        className="input input-bordered w-full"
                    />
                    <input
                        id="neighborhood"
                        name="neighborhood"
                        type="text"
                        value={restaurant.neighborhood}
                        onChange={handleChange}
                        placeholder="Neighborhood"
                        className="input input-bordered w-full"
                    />
                    <label className="flex items-center space-x-2">
                        <span>Visited:</span>
                        <input
                            id="visited"
                            name="visited"
                            type="checkbox"
                            checked={restaurant.visited}
                            onChange={handleChange}
                            className="checkbox"
                        />
                    </label>
                    <button type="submit" className="btn btn-primary w-full">Update Restaurant</button>
                </form>
                <Link to="/home" className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800">
                            Back to Home
                        </Link>
            </div>
        </div>
    );
};

export default EditRestaurantForm;

