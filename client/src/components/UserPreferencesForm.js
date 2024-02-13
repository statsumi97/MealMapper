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
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor='preferredCuisines' className="block text-sm font-medium text-gray-700">Preferred Cuisines:</label>
                        <input
                            id='preferredCuisines'
                            name='preferredCuisines'
                            type='text'
                            value={preferredCuisines}
                            onChange={handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor='preferredNeighborhoods' className="block text-sm font-medium text-gray-700">Preferred Neighborhoods:</label>
                        <input
                            id='preferredNeighborhoods'
                            name='preferredNeighborhoods'
                            type='text'
                            value={preferredNeighborhoods}
                            onChange={handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            id='visitationStatus'
                            name='visitationStatus'
                            type='checkbox'
                            checked={visitationStatus}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <label htmlFor='visitationStatus' className="ml-2 block text-sm text-gray-900">Visitation Status</label>
                    </div>
                    <button type='submit' className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Preferences</button>
                </form>
                <div className="mt-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Current Preferences</h3>
                    <p className="mt-1 text-sm text-gray-600">Preferred Cuisines: {preferredCuisines}</p>
                    <p className="mt-1 text-sm text-gray-600">Preferred Neighborhoods: {preferredNeighborhoods}</p>
                    <p className="mt-1 text-sm text-gray-600">Visitation Status: {visitationStatus ? 'Yes' : 'No'}</p>
                </div>
                <button onClick={() => navigate('/home')} className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Back to Home</button>
            </div>
        </div>
    );
};

export default UserPreferencesForm;