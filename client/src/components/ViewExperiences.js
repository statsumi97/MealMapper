import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(false); //Add loading state
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const editExperience = (experienceId) => {
        navigate(`/experiences/edit/${experienceId}`);
    };

    useEffect(() => {
        setIsLoading(true); //Set loading to true when the fetch starts
        fetch('experiences')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => { //Simulate a delay
                setExperiences(data);
                setIsLoading(false); //Set loading to false when data is received
            }, 1000); //Delay in milliseconds
        })
        .catch(error => {
            console.error('Error fetching experiences', error);
            setIsLoading(false); //Ensure loading is set to false on error
        });
    }, []);

    const deleteExperience = (experienceId) => {
        fetch(`/experiences/${experienceId}`, {
            method: 'DELETE',
        }).then((response) => {
            if (response.ok) {
                //Remove the experience from the state to update the UI
                setExperiences(experiences.filter(experience => experience.id !== experienceId));
                alert('Post deleted successfully');
            } else {
                alert('Error deleting post');
            }
        }).catch(error => {
            console.error('Error deleting post', error);
            alert('Error deleting post');
        })
    };

    return (
        <div>
            <h2>My Dining Memories</h2>
            {isLoading ? (
                <p>Loading experiences...</p> //Display loading message
            ) : (
            <ul>
                {experiences.map(experience => (
                    <li key={experience.id}>
                        <p>{experience.story}</p>
                        <p>Visited on: {experience.visit_date}</p>
                        {experience.image_url && <img src={experience.image_url} alt='Experience' />}
                        <button onClick={() => editExperience(experience.id)}>Edit</button> 
                        <button onClick={() => deleteExperience(experience.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        )}
            <button onClick={() => navigate('/experiences/new')}>Share New Memory</button>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    );
};

export default ViewExperiences;