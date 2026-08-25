# GymAI Phase 2 — Exercise Intelligence

## Completed
- Added a real SQLAlchemy `Exercise` model.
- Added 60 seeded exercises: 20 Beginner, 20 Intermediate, 20 Advanced.
- Added exercise metadata for goals, equipment, cues, common mistakes, and pose support.
- Added FastAPI exercise endpoints under `/api/exercises`.
- Added backend-served visual exercise guides under `/media/exercises/`.
- Added 60 local 3-step movement-guide SVG assets.
- Replaced frontend mock exercise loading with real API loading.
- Updated exercise cards and detail modal to show visual guidance and common mistakes.
- Added pose-support metadata for beginner movements that will later be connected to MediaPipe.
- Added equipment filtering including `None` and `Full Gym`.

## Architecture
Frontend Exercise Library -> exerciseService -> FastAPI `/api/exercises` -> SQLAlchemy -> seeded SQLite/PostgreSQL database.

Exercise images are served by FastAPI and referenced by API responses, so the UI is not hardcoded to mock exercise data.

## Next Phase
Phase 3: personalization engine using age, weight, goal, fitness level, equipment, and training frequency to generate user-specific workouts from this exercise database.
