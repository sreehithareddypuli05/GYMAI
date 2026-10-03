# GymAI Phase 5 — Beginner MediaPipe Pose Training

Implemented inside the existing workout flow. There is no separate pose-check page.

## Behavior

- Beginner + supported exercise: AI form check is required to complete the set.
- Beginner + unsupported exercise: normal set completion.
- Intermediate: no pose UI.
- Advanced: no pose UI.
- No raw camera video is uploaded or stored.

## Supported pose exercise types

- squat
- pushup
- lunge
- bicep_curl
- shoulder_press

## Browser architecture

Camera → MediaPipe Pose Landmarker → body landmarks → joint angles → movement state → reps/form feedback.

MediaPipe is loaded from the official package CDN at runtime so the project does not need a large WASM/model bundle in the repository. Production camera use requires HTTPS (localhost is allowed by browsers).

## Backend

`POST /api/workouts/pose-session` stores summarized metrics only:

- exercise
- pose type
- reps
- form score
- feedback
- timestamp

The endpoint requires a Beginner profile and a pose-supported exercise.
