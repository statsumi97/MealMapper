import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetch(`/experiences/${userId}`)
        .then(response => response.json())
        .then(data => setExperiences(data))
        .catch(error => console.error('Error fetching experiences', error));
    }, []);

    return (
        <div>
            <h2>My Dining Memories</h2>
            <ul>
                {experiences.map(experience => (
                    <li key={experience.id}>
                        <p>{experience.story}</p>
                        <p>Visited on: {experience.visit_date}</p>
                        {experience.image_url && <img src={experience.image_url} alt='Experience' />} 
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/experiences/new')}>Share New Memory</button>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    );
};

export default ViewExperiences;