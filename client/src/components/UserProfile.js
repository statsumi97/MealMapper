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
        <div className="bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] min-h-screen bg-cover p-10">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-y2k-pink mb-4">User Profile</h2>
                {userProfile && (
                    <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg space-y-4">
                        <p>Username: {userProfile.user.username}</p>
                        <p>Email: {userProfile.user.email}</p>
                        <h3 className="text-2xl">Favorite Restaurants</h3>
                        <ul className="list-disc pl-5">
                            {favoriteRestaurants.map(restaurant => (
                                <li key={restaurant.id} className="text-y2k-pink">
                                    {restaurant.name}
                                    <FavoriteButton userId={userId} restaurantId={restaurant.id} isFavorited={true} />
                                </li>
                            ))}
                        </ul>
                        <h3 className="text-2xl">Memories</h3>
                        <ul className="list-disc pl-5">
                            {userProfile.experiences.map(experience => (
                                <li key={experience.id} className="text-y2k-pink">
                                    <p>{experience.story}</p>
                                    <p>Visited on: {experience.visit_date}</p>
                                    {experience.image_url && <img src={experience.image_url} alt="Experience" className="max-w-xs mt-2 rounded-lg" />}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <button onClick={() => navigate('/experiences/new')} className="btn btn-y2k-pink mt-4">Share New Memory</button>
                <button onClick={() => navigate('/home')} className="btn btn-y2k-pink mt-4 ml-2">Back to Home</button>
            </div>
        </div>
    );
};


export default UserProfile;