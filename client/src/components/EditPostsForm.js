import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditPostsForm = () => {
    const { experienceId } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState('');
    const [experience, setExperience] = useState({
        restaurant_id: '',
        visit_date: '',
        image_url: '',
        story: '',
    });

    useEffect(() => {
        fetch(`/experiences/${experienceId}`)
        .then(response => response.json())
        .then(data => {
            setExperience(data);
        })
        .catch(error => {console.error('Error fetching experience details', error);});
    }, [experienceId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setExperience(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files.length === 0) return; // Exit if no file selected
    
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', 'yt1lmdwp'); // Use your Cloudinary upload preset
    
        fetch('https://api.cloudinary.com/v1_1/dwbgeypis/image/upload', { // Replace with your Cloudinary cloud name
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                // Update temporary state instead of main state
                setImage(data.secure_url);
            }
        })
        .catch(error => console.error('Error uploading image:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Now update the experience with the image URL right before submitting
        const updatedExperience = {
            ...experience,
            image_url: image, // Use the temporary state
        };
    
        fetch(`/experiences/${experienceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedExperience),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            return response.json();
        })
        .then(data => {
            alert('Post updated successfully');
            navigate('/experiences');
        })
        .catch(error => {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        });
    };

    return (
        <div className="min-h-screen bg-y2k-bg bg-cover flex justify-center items-center p-4">
            <div className="w-full max-w-xl bg-white bg-opacity-95 p-8 rounded-lg shadow-2xl space-y-6 transition ease-in-out duration-150">
            <h2 className="text-3xl font-bold mb-6 text-center font-heading text-y2k-purple">Edit Post</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        id="restaurant_id"
                        name="restaurant_id"
                        type="text"
                        value={experience.restaurant_id}
                        onChange={handleChange}
                        placeholder="Restaurant ID"
                        className="input input-bordered w-full focus:border-y2k-purple focus:ring focus:ring-y2k-purple focus:ring-opacity-50"
                    />
                    <input
                        id="visit_date"
                        name="visit_date"
                        type="date"
                        value={experience.visit_date}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full focus:border-y2k-purple focus:ring focus:ring-y2k-purple focus:ring-opacity-50 font-body"
                    />
                    <input
                        id="image_url"
                        name="image_url"
                        type="text"
                        value={experience.image_url}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="textarea textarea-bordered w-full focus:border-y2k-purple focus:ring focus:ring-y2k-purple focus:ring-opacity-50 font-body"
                    />
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="textarea textarea-bordered w-full focus:border-y2k-purple focus:ring focus:ring-y2k-purple focus:ring-opacity-50 font-body"
                    />
                    <textarea
                        id="story"
                        name="story"
                        value={experience.story}
                        onChange={handleChange}
                        placeholder="Story"
                        className="textarea textarea-bordered w-full focus:border-y2k-purple focus:ring focus:ring-y2k-purple focus:ring-opacity-50 font-body"
                    ></textarea>
                    <button type="submit" className="btn bg-y2k-pink hover:bg-y2k-red focus:ring-y2k-blue focus:ring-opacity-50 w-full transition ease-in-out duration-150">Update Post</button>
                </form>
                <Link to="/home" className="text-gray hover:text-y2k-green transition ease-in-out duration-150">Back to Home</Link>
            </div>
        </div>
    );
};

export default EditPostsForm;