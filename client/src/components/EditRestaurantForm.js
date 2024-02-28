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
        <div className="min-h-screen bg-y2k-bg bg-cover flex items-center justify-center p-4">
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl space-y-4 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-y2k-purple">Edit Restaurant</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={restaurant.name}
                        onChange={handleChange}
                        placeholder="Restaurant Name"
                        className="input input-bordered w-full focus:border-y2k-purple focus:ring-2 focus:ring-y2k-purple hover:border-y2k-purple"
                    />
                    <input
                        id="cuisine"
                        name="cuisine"
                        type="text"
                        value={restaurant.cuisine}
                        onChange={handleChange}
                        placeholder="Cuisine"
                        className="input input-bordered w-full focus:border-y2k-blue focus:ring-2 focus:ring-y2k-blue hover:border-y2k-blue"
                    />
                    <input
                        id="neighborhood"
                        name="neighborhood"
                        type="text"
                        value={restaurant.neighborhood}
                        onChange={handleChange}
                        placeholder="Neighborhood"
                        className="input input-bordered w-full focus:border-y2k-green focus:ring-2 focus:ring-y2k-green hover:border-y2k-green"
                    />
                    <label className="flex items-center space-x-2">
                    <span className="text-gray">Visited:</span>
                        <input
                            id="visited"
                            name="visited"
                            type="checkbox"
                            checked={restaurant.visited}
                            onChange={handleChange}
                            className="checkbox checkbox-primary bg-white border-y2k-pink focus:border-y2k-pink hover:bg-y2k-pink"
                        />
                    </label>
                    <button 
                        type="submit" 
                        className="btn w-full bg-y2k-pink hover:bg-y2k-red focus:ring-2 focus:ring-y2k-blue focus:ring-offset-2 transition duration-150 ease-in-out"
                            >Update Restaurant</button>
                </form>
                <Link to="/home" className="inline-block align-baseline font-bold text-sm text-gray hover:text-y2k-green">
                            Back to Home
                        </Link>
            </div>
        </div>
    );
};

export default EditRestaurantForm;

