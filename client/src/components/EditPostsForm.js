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
        <div className="min-h-screen bg-[url('https://64.media.tumblr.com/bcfea4a5e8ad504a317d3945a52a66cd/ef88cccc47cd17c9-77/s75x75_c1/4118951c5afbe9ebec4ba4373180fadbcb463a28.png')] bg-cover flex justify-center items-center p-4">
            <div className="w-full max-w-lg bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-600">Edit Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        id="restaurant_id"
                        name="restaurant_id"
                        type="text"
                        value={experience.restaurant_id}
                        onChange={handleChange}
                        placeholder="Restaurant ID"
                        className="input input-bordered w-full"
                    />
                    <input
                        id="visit_date"
                        name="visit_date"
                        type="date"
                        value={experience.visit_date}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                    <input
                        id="image_url"
                        name="image_url"
                        type="text"
                        value={experience.image_url}
                        onChange={handleChange}
                        placeholder="Image URL"
                        className="input input-bordered w-full"
                    />
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="file:btn file:btn-primary"
                    />
                    <textarea
                        id="story"
                        name="story"
                        value={experience.story}
                        onChange={handleChange}
                        placeholder="Story"
                        className="textarea textarea-bordered w-full"
                    ></textarea>
                    <button type="submit" className="btn btn-primary w-full">Update Post</button>
                </form>
                <Link to="/home" className="inline-block align-baseline font-bold text-sm text-pink-500 hover:text-pink-800">
                            Back to Home
                        </Link>
            </div>
        </div>
    );
};

export default EditPostsForm;