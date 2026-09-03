# GymAI UI / Animation Update

This package changes the frontend presentation only. Backend, API/service integration, authentication logic, AI/pose logic, dashboard data/services, workout/exercise/history/progress flows are preserved.

## Requested visual changes
- Orange / black / white theme
- No grid-pattern backgrounds
- No cursor-follow/mouse-follow animation
- AI features now transform through six states:
  1. AI workout generation — full programs from goal, equipment and history
  2. Adaptive workouts — sessions adjust with readiness/load
  3. AI coach — conversational coach grounded in training data via RAG
  4. Personalized recommendations — exercise swaps and progressions
  5. Posture detection — camera/form intelligence
  6. Equipment ideas — substitutions based on available equipment
- Feature visuals use cinematic image swaps, mask sweeps, active-state transformations and scroll/hover transitions.
- Real gym film is placed immediately after the AI feature section.
- Testimonials use a stacked-card carousel interaction inspired by the supplied second reference.
- The six-photo gym gallery keeps the supplied third-reference language: layered cards, left-side mask reveal, grayscale-to-color hover reveal, hover zoom and depth stacking. Cursor-follow movement was removed.
- Login and create-account pages use four animated circular movement photos labeled SQUAT, PLANK, JUMP and PULL, with scaling/rotation/orbit-style transformation.

## Gym video note
The uploaded reference recordings available in the conversation are UI/reference recordings rather than a gym-footage video file. The new gym-film section therefore embeds a real-gym external video provider clip. Replace its iframe URL with your exact licensed/local gym video if you want the supplied footage instead.
