## Title
MealMapper


## Description:
MealMapper is a user-friendly webpage that allows users to log, filter, and randomly select restaurants based on their preferences, while also providing a platform to share memories and experiences related to their dining adventures.


## User Stories:
1. A user can create an account for a personalized experience.
2. A user can log in to their account to have access to their saved data.
3. A user can log restaurants they've visited to keep track of their dining experiences.
4. A user can filter restaurants based on cuisine, neighborhood, and visitation status to narrow down their choices.
5. A user can use a randomizer feature to select a restaurant based on their filters when they are feeling indecisive.
6. A user can share their dining experiences by uploading photos and stories to keep a food diary.
7. A user can see other users' experiences at the same restaurant to get a sense of what to expect.
8. A user can edit and delete their posts to manage their content.


## React Tree:
<img width="702" alt="Screen Shot 2024-01-29 at 7 10 15 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/2f77142b-b4a4-4f13-9d16-06ef30150784">


## Schema:
<img width="701" alt="Screen Shot 2024-01-29 at 7 37 31 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/b6166c9c-1a49-4973-b32a-940319f1a6fd">


## API Routes:
User Routes
1. POST --> /users --> Register a new user
2. POST --> /users/login --> Login an existing user
3. POST --> /users/logout --> Logout the current user


Restaurant Routes
1. GET --> /restaurants --> Get all restaurants
2. POST --> /restaurants --> Add a new restaurant
3. GET --> /restaurant/<int:id> --> Get a specific restaurant
4. PATCH --> /restaurant/<int:id> --> Update a specific restaurant
5. DELETE --> /restaurant/<int:id> --> Delete a specific restaurant
6. GET --> /restaurants/random --> Get a random restaurant based on filters


User Experience Routes
1. POST --> /user_experience --> Add a restaurant to a user's visited list
2. DELETE --> /user_experience --> Remove a restaurant from a user's visited list
3. GET --> /user_experience/memories --> Get all memories for a specific restaurant
4. POST --> /user_experience/memories --> Add a new memory for a specific restaurant
5. GET --> /user_experience/memories --> Get a specific memory
6. PATCH --> /user_experience/memories --> Update a specific memory
7. DELETE --> /user_experience/memories --> Delete a specific memory


## Stretch Goals:
1. Implement a recommendation system:
Create a recommendation system that suggests restaurants based on a user's friends list and where their friends have recently logged.
2. Integrate with external APIs:
Integrate with external APIs such as Google Maps for displaying restaurant locations, or Yelp for additional restaurant details and reviews.
3. Implement real-time updates:
Implement real-time updates that would allow users to see updates from other users in real-time, making the application more interactive.


## Trello:
<img width="1178" alt="Screen Shot 2024-01-29 at 8 05 51 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/e1e9e888-c97e-4111-9ad2-a79f5b0a4185">


## Wireframe:
<img width="540" alt="Screen Shot 2024-01-29 at 8 25 45 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/e657a3f3-530d-4486-8898-870bd851182a">
<img width="510" alt="Screen Shot 2024-01-29 at 8 25 53 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/f5613819-22ce-4311-90e8-7f8503383c8e">
<img width="607" alt="Screen Shot 2024-01-29 at 8 26 01 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/3711ab63-ef90-4f72-9004-573da13b04f9">
<img width="466" alt="Screen Shot 2024-01-29 at 8 26 06 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/8f03b2d3-e61d-4cd2-a6a9-c6a6ae2991cb">
<img width="212" alt="Screen Shot 2024-01-29 at 8 28 13 PM" src="https://github.com/statsumi97/Phase-5-Project/assets/147007475/1471b630-7db1-4ad6-83b3-a32981d4b014">
