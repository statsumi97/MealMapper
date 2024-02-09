import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(false); //Add loading state
    const [error, setError] = useState(''); //Add an error state
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');
    const [searchTerm, setSearchTerm] = useState('');

    const editExperience = (experienceId) => {
        navigate(`/experiences/edit/${experienceId}`);
    };

    useEffect(() => {
        fetchExperiences();
    }, [searchTerm]); //Re-fetch when search term changes

    const deleteExperience = (experienceId) => {
        fetch(`/experiences/${experienceId}`, {
            method: 'DELETE',
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            setExperiences(experiences.filter(experience => experience.id !== experienceId));
            alert('Post deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting post', error);
            alert('Error deleting post. Please try again later.'); //Display a user-friendly error message
        });
    };

    const fetchExperiences = () => {
        setIsLoading(true);
        setError('');
        const queryParams = searchTerm ? `?restaurantName=${searchTerm}` : '';
        fetch(`/experiences${queryParams}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTimeout(() => { //Simulate a delay
                    setExperiences(data);
                    setIsLoading(false); //Set loading to false when data is received
                }, 500); //Delay in milliseconds
            })
            .catch(error => {
                console.error('Error fetching experiences', error);
                setError('Failed to load posts. Please try again later.');
                setIsLoading(false);
            });
    };

    return (
        <div>
            <h2>My Dining Memories</h2>
            <input
                type='text'
                placeholder='Search by restaurant...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={fetchExperiences}>Search</button>
            {isLoading ? <p>Loading experiences...</p> : null}
            {error && <p style={{color: 'red'}}>{error}</p>}
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
            <button onClick={() => navigate('/experiences/new')}>Share New Memory</button>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    );
};

export default ViewExperiences;