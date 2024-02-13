import React from 'react';

const FavoriteButton = ({userId, restaurantId, isFavorited, onToggle}) => {
    const handleClick = () => {
        fetch(`/users/${userId}/favorites/${restaurantId}`, {
            method: isFavorited ? 'DELETE' : 'POST',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update favorite');
            }
            //Check if the response has content
            return response.status === 204 ? null : response.json();
        })
        .then(data => {
            onToggle(); //Call the onToggle callback to refresh the list or UI
        })
        .catch(error => console.error('Error updating favorite:', error));
    };

    return (
        <button onClick={handleClick}>
            {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
    );
};

export default FavoriteButton;