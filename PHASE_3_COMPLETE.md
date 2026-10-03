# GymAI Phase 3 — Personalization Engine

## Completed

- Added a backend `RecommendationService`.
- Added `GET /api/workouts/today` for authenticated users.
- Personalized workout selection uses fitness level, goal, equipment, and training frequency.
- No-equipment users receive only no-equipment exercises.
- Intermediate and Advanced profiles cannot save with `No Equipment`.
- Workout exercises come from the backend Exercise database rather than the old frontend mock list.
- Workout response includes real exercise image URLs and pose-support metadata for future MediaPipe integration.
- Existing workout completion endpoint remains connected to the user's authenticated history.

## Important product rule

Age and weight remain part of the user's profile and are persisted, but are not used to judge appearance or rank bodies. The recommendation engine uses training goal, level, equipment and sustainable frequency for exercise selection.

## Next phase

Phase 4: workout execution improvements and real workout-session/exercise-performance persistence, followed by Phase 5 MediaPipe Pose Landmarker for Beginner users only.
