import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const EditPostsForm = () => {
    const {experienceId} = useParams();
    const navigate = useNavigate();
    const [experience, setExperience] = useState({
        restaurant_id: '',
        visit_date: '',
        image_url: '',
        story: '',
    });

    useEffect(() => {
        //Fetch the experience details to edit
        fetch(`/experiences/${experienceId}`)
        .then(response => response.json())
        .then(data => setExperience(data))
        .catch(error => console.error('Error fetching expereince details', error));
    }, [experienceId]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setExperience(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`/experiences/${experienceId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experience),
        }).then(response => {
            console.log(response)
            if (response.ok) {
                return response.json();
                // alert('Post updated successfully');
                // navigate('/experiences') //navigate back to the experience list
            } else {
                throw new Error('Server responded with an error!')
                alert('Failed to update post');
            }
        })
        .then(data => {
            console.log(data);
            alert('Post updated successfully');
            navigate('/experiences')
        })
        .catch(error => {
            console.error('Error updating post', error);
            alert('Failed to update post')
        });
    };

    return (
        <div>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <input
                    id='restaurant_id'
                    name='restaurant_id'
                    type='text'
                    value={experience.restaurant_id}
                    onChange={handleChange}
                    placeholder='Restaurant Name'
                />
                <input
                    id='visit_date'
                    name='visit_date'
                    type='date'
                    value={experience.visit_date}
                    onChange={handleChange}
                    placeholder='Visit Date'
                />
                <input
                    id='image_url'
                    name='image_url'
                    type='text'
                    value={experience.image_url}
                    onChange={handleChange}
                    placeholder='Image URL'
                />
                <textarea
                    id='story'
                    name='story'
                    value={experience.story}
                    onChange={handleChange}
                    placeholder='Edit your post here'
                />
                <button type='submit'>Update Post</button>
            </form>
        </div>
    )
}

export default EditPostsForm;