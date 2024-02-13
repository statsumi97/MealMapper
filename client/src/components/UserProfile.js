import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

const UserProfile = () => {
    const { userId } = useParams(); //Passing the user ID in the URL
    const [userProfile, setUserProfile] = useState(null);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/users/${userId}`) 
            .then(response => response.json())
            .then(data => {
                setUserProfile(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user profile', error);
                setIsLoading(false);
            });
    }, [userId]);

    //Fetch user's favorite restaurants
    useEffect(() => {
        fetch(`/users/${userId}/favorites`)
            .then(response => response.json())
            .then(data => {
                setFavoriteRestaurants(data);
            })
            .catch(error => console.error('Error fetching favorite restaurants', error));
    }, [userId]); //This effect depends on userId, so it runs again if userId changes

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h2>User Profile</h2>
            {userProfile && (
                <>
                    <p>Username: {userProfile.user.username}</p>
                    <p>Email: {userProfile.user.email}</p>
                    <h3>Favorite Restaurants</h3>
                    <ul>
                        {favoriteRestaurants.map(restaurant => (
                            <li key={restaurant.id}>
                                {restaurant.name}
                                <FavoriteButton
                                    userId={userId}
                                    restaurantId={restaurant.id}
                                    isFavorited={true}
                                    onToggle={() => {
                                        //Refresh the list of favorite restaurants when one is toggled
                                        setFavoriteRestaurants(favoriteRestaurants.filter(fav => fav.id !== restaurant.id))
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                    <h3>Memories</h3>
                    <ul>
                        {userProfile.experiences.map(experience => (
                            <li key={experience.id}>
                                <p>{experience.story}</p>
                                <p>Visited on: {experience.visit_date}</p>
                                {experience.image_url && <img src={experience.image_url} alt='Experience' />}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <button onClick={() => navigate('/experiences/new')}>Share New Memory</button>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    );
};

export default UserProfile;