import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserPreferencesForm = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    // State for each form field
    const [preferredCuisines, setPreferredCuisines] = useState('');
    const [preferredNeighborhoods, setPreferredNeighborhoods] = useState('');
    const [visitationStatus, setVisitationStatus] = useState(false);

    useEffect(() => {
        // Fetch existing preferences to populate the form fields for editing
        fetch(`/users/${userId}/preferences`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                setPreferredCuisines(data.preferred_cuisines || '');
                setPreferredNeighborhoods(data.preferred_neighborhoods || '');
                setVisitationStatus(data.visitation_status !== undefined ? data.visitation_status : false);
            }
        })
        .catch(error => console.error('Error fetching user preferences', error));
    }, [userId]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (type === 'checkbox') {
            setVisitationStatus(checked);
        } else {
            name === 'preferredCuisines' ? setPreferredCuisines(value) :
            setPreferredNeighborhoods(value);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const preferences = {
            preferred_cuisines: preferredCuisines,
            preferred_neighborhoods: preferredNeighborhoods,
            visitation_status: visitationStatus,
        };

        const method = 'POST'; // Or determine dynamically as needed

        console.log("Saving preferences with payload:", preferences);
        fetch(`/users/${userId}/preferences`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        })
        .then(response => response.json())
        .then(data => {
            alert('Preferences saved successfully');
            // navigate(`/users/${userId}`); // Redirect to user profile page after submission
        })
        .catch(error => {
            console.error('Error updating preferences:', error);
            alert('Failed to save preferences. Please try again.');
        });
    };

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor='preferredCuisines'>Preferred Cuisines:</label>
            <input
                id='preferredCuisines'
                name='preferredCuisines'
                type='text'
                value={preferredCuisines}
                onChange={handleChange}
            />
            <label htmlFor='preferredNeighborhoods'>Preferred Neighborhoods:</label>
            <input
                id='preferredNeighborhoods'
                name='preferredNeighborhoods'
                type='text'
                value={preferredNeighborhoods}
                onChange={handleChange}
            />
            <label htmlFor='visitationStatus'>Visitation Status:</label>
            <input
                id='visitationStatus'
                name='visitationStatus'
                type='checkbox'
                checked={visitationStatus}
                onChange={handleChange}
            />
            <button type='submit'>Save Preferences</button>
        </form>
        <div>
            <h3>Current Preferences</h3>
            <p>Preferred Cuisines: {preferredCuisines}</p>
            <p>Preferred Neighborhoods: {preferredNeighborhoods}</p>
            <p>Visitation Status: {visitationStatus ? 'Yes' : 'No'}</p>
        </div>
        <button onClick={() => navigate('/home')}>Back to Home</button>
    </div>
    );
};

export default UserPreferencesForm;