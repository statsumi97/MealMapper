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
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover p-10">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold mb-4">My Dining Memories</h2>
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by restaurant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <button onClick={fetchExperiences} className="btn ml-2">Search</button>
                </div>
                {isLoading && <p>Loading experiences...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="space-y-4">
                    {experiences.map(experience => (
                        <div key={experience.id} className="bg-white bg-opacity-80 rounded-lg p-4 shadow-lg">
                            <p>{experience.story}</p>
                            <p>Visited on: {experience.visit_date}</p>
                            {experience.image_url && <img src={experience.image_url} alt="Experience" className="mt-2 max-w-xs rounded-lg" />}
                            <div className="flex justify-end space-x-2 mt-4">
                                <button onClick={() => editExperience(experience.id)} className="btn">Edit</button>
                                <button onClick={() => deleteExperience(experience.id)} className="btn btn-error">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => navigate('/experiences/new')} className="btn btn-primary mt-4">Share New Memory</button>
                <button onClick={() => navigate('/home')} className="btn btn-secondary mt-4 ml-2">Back to Home</button>
            </div>
        </div>
    );
};

export default ViewExperiences;