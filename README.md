# GymAI — Training Intelligence

GymAI is a personalized fitness tracking and training platform designed to help users build consistent workout habits, track their progress, and receive workouts based on their fitness profile.

The application combines a modern React frontend with a FastAPI backend to provide authentication, user profiles, personalized workout generation, workout tracking, dashboard analytics, history, progress insights, and account settings.

---

## Features

### Authentication

GymAI provides a complete authentication system.

- User registration
- User login
- JWT-based authentication
- Persistent login using local storage
- Protected API routes
- Current user profile retrieval
- Logout functionality
- Password update support

---

## User Profile

Users can create and manage their fitness profile.

The profile includes:

- Full name
- Email
- Avatar
- Fitness level
- Fitness goal
- Training frequency
- Available equipment
- Age
- Height
- Weight
- Profile completion status

The profile information is used to personalize the user's workout experience.

---

## Personalized Workouts

GymAI generates workouts based on the user's profile.

Workout selection considers:

- Fitness level
- Training goal
- Available equipment
- Exercise difficulty
- Target muscle groups

Supported fitness levels:

- Beginner
- Intermediate
- Advanced

Supported goals:

- Build Muscle
- Gain Strength
- Lose Fat
- Improve Endurance
- General Fitness

If the user has not selected equipment, GymAI can fall back to bodyweight exercises.

Each personalized workout includes:

- Workout name
- Training focus
- Difficulty
- Estimated duration
- Selected exercises

---

## Workout Tracking

Completed workouts are stored in the backend.

Each workout session records:

- Workout ID
- Workout name
- Training focus
- Duration
- Number of exercises
- Completion date and time

This real workout data powers the Dashboard, History, and Progress pages.

---

## Dashboard

The GymAI dashboard provides a quick overview of the user's training activity.

Metrics include:

- Current streak
- Longest streak
- Workouts completed this week
- Total workouts
- Training time this week
- Weekly activity
- Recent workouts

The dashboard updates using real workout session data stored in the database.

---

## Workout History

The History page displays completed workouts in chronological order.

Users can view:

- Workout name
- Completion date
- Workout duration
- Number of exercises
- Workout completion information

The data is fetched from the backend rather than using static mock data.

---

## Progress Analytics

The Progress page provides analytics based on completed workout sessions.

Currently tracked metrics include:

### Completion Rate

Calculated based on:

- User's training frequency
- Number of completed workouts
- Time since account creation

### Current Streak

Shows the number of consecutive training days.

### Longest Streak

Shows the user's longest consecutive workout streak.

### Sessions Per Week

Calculates the user's average number of completed workouts per week.

### Training Time

Displays the total training minutes for recent weeks.

### Workout Frequency

Shows the number of completed workout sessions each week.

### Training Consistency

Calculates how consistently the user has trained across the week.

### Workout Focus Distribution

Shows how completed workouts are distributed across training focuses.

All analytics are generated from real `WorkoutSession` data.

---

## Settings

The Settings page allows users to manage their account preferences.

Current functionality includes:

- Theme preferences
- Password update
- Logout

The notification button has been removed from the main navigation to keep the interface focused.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- Password hashing

---

## Database

The application uses SQLAlchemy models for storing:

- Users
- User profiles
- Workout sessions

Main models:

```text
User
│
├── Authentication information
├── Fitness profile
├── Age
├── Height
├── Weight
├── Equipment
└── Workout Sessions