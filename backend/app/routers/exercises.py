from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

REAL_EXERCISE_IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/'

# The open Free Exercise DB provides photographic movement references.
# We use a small set of verified real-photo paths plus sensible aliases.
REAL_IMAGE_ALIASES = {
    'beginner-bodyweight-squat': 'Bodyweight_Squat/0.jpg',
    'beginner-dead-bug': 'Dead_Bug/0.jpg',
    'beginner-superman': 'Superman/0.jpg',
    'intermediate-dumbbell-bench-press': 'Dumbbell_Bench_Press/0.jpg',
    'intermediate-dumbbell-shoulder-press': 'Dumbbell_Shoulder_Press/0.jpg',
    'intermediate-leg-press': 'Leg_Press/0.jpg',
    'intermediate-seated-leg-curl': 'Seated_Leg_Curl/0.jpg',
    'intermediate-dumbbell-bicep-curl': 'Dumbbell_Bicep_Curl/0.jpg',
    'advanced-barbell-curl': 'Barbell_Curl/0.jpg',
    'advanced-barbell-hip-thrust': 'Barbell_Hip_Thrust/0.jpg',
}

# Safe real-photo fallbacks by movement family. These are used only when a
# specific exercise does not have a matching photo in the external dataset.
REAL_FALLBACK_IMAGES = {
    'Legs': 'Bodyweight_Squat',
    'Chest': 'Dumbbell_Bench_Press',
    'Back': 'Bent_Over_Barbell_Row',
    'Shoulders': 'Dumbbell_Shoulder_Press',
    'Arms': 'Dumbbell_Bicep_Curl',
    'Core': 'Dead_Bug',
    'Full Body': 'Bodyweight_Squat',
}

def _photo_candidates(row):
    # The Free Exercise DB uses directory names derived from exercise names.
    # We provide aliases for common GymAI naming variants so the UI can try
    # the closest real photographic movement reference before using local art.
    import re
    base = re.sub(r'[^A-Za-z0-9]+', '_', row.name).strip('_')
    candidates = [base]
    for prefix in ('Heavy_', 'Bodyweight_', 'Paused_', 'Weighted_'):
        if base.startswith(prefix):
            candidates.append(base[len(prefix):])
    aliases = {
        'Knee_Push_Up': ['Push-Up', 'Pushups', 'Push-Ups'],
        'Wall_Push_Up': ['Push-Up', 'Pushups', 'Push-Ups'],
        'Reverse_Lunge': ['Lunge'],
        'Step_Up': ['Step-Up'],
        'Standing_Calf_Raise': ['Calf_Raise', 'Standing_Calf_Raise'],
        'Forearm_Plank': ['Plank'],
        'Side_Plank': ['Side_Plank', 'Plank'],
        'Mountain_Climber': ['Mountain_Climbers'],
        'High_Knees': ['High_Knees', 'High_Knee'],
        'Crunch': ['Crunch', 'Ab_Crunch'],
        'Dumbbell_Goblet_Squat': ['Goblet_Squat'],
        'One_Arm_Dumbbell_Row': ['One_Arm_Dumbbell_Row', 'Dumbbell_Row'],
        'Dumbbell_Walking_Lunge': ['Walking_Lunge', 'Dumbbell_Lunge'],
        'Dumbbell_Romanian_Deadlift': ['Romanian_Deadlift', 'Dumbbell_Deadlift'],
        'Lat_Pulldown': ['Wide_Grip_Lat_Pulldown', 'Close-Grip_Front_Lat_Pulldown'],
        'Seated_Cable_Row': ['Seated_Cable_Row', 'Cable_Row'],
        'Cable_Chest_Fly': ['Cable_Crossover', 'Cable_Fly'],
        'Cable_Face_Pull': ['Face_Pull'],
        'Cable_Triceps_Pushdown': ['Triceps_Pushdown'],
        'Dumbbell_Bicep_Curl': ['Dumbbell_Curl'],
        'Kettlebell_Swing': ['One-Arm_Kettlebell_Swings', 'Kettlebell_Swing'],
        'Barbell_Back_Squat': ['Barbell_Squat', 'Squat'],
        'Barbell_Bench_Press': ['Bench_Press', 'Barbell_Bench_Press'],
        'Cable_Lateral_Raise': ['Cable_Lateral_Raise', 'Side_Lateral_Raise'],
        'Dumbbell_Bulgarian_Split_Squat': ['Bulgarian_Split_Squat', 'Dumbbell_Split_Squat'],
        'Conventional_Deadlift': ['Deadlift', 'Barbell_Deadlift'],
        'Front_Squat': ['Barbell_Front_Squat', 'Squat'],
        'Barbell_Row': ['Bent_Over_Barbell_Row', 'Barbell_Row'],
        'Barbell_Overhead_Press': ['Standing_Military_Press', 'Military_Press'],
        'Weighted_Pull_Up': ['Pullups', 'Pull-Up'],
        'Weighted_Dip': ['Dips', 'Dip'],
        'Paused_Barbell_Squat': ['Squat', 'Barbell_Squat'],
        'Incline_Barbell_Bench_Press': ['Incline_Bench_Press', 'Bench_Press'],
        'Barbell_Romanian_Deadlift': ['Romanian_Deadlift', 'Barbell_Deadlift'],
        'Heavy_Cable_Row': ['Cable_Row', 'Seated_Cable_Row'],
        'Heavy_Leg_Press': ['Leg_Press'],
        'Leg_Extension': ['Leg_Extension'],
        'Lying_Leg_Curl': ['Lying_Leg_Curl'],
        'Cable_Crossover': ['Cable_Crossover'],
        'Heavy_Dumbbell_Bench_Press': ['Dumbbell_Bench_Press'],
        'Heavy_One_Arm_Dumbbell_Row': ['One_Arm_Dumbbell_Row', 'Dumbbell_Row'],
        'EZ_Bar_Skull_Crusher': ['EZ-Bar_Skullcrusher', 'Skullcrusher'],
        'Cable_Crunch': ['Cable_Crunch', 'Crunch'],
    }
    candidates.extend(aliases.get(base, []))
    fallback = REAL_FALLBACK_IMAGES.get(row.muscle_group, 'Bodyweight_Squat')
    candidates.append(fallback)
    # Preserve order and remove duplicates.
    candidates = list(dict.fromkeys(candidates))
    return [REAL_EXERCISE_IMAGE_BASE + f'{candidate}/0.jpg' for candidate in candidates], [REAL_EXERCISE_IMAGE_BASE + f'{candidate}/1.jpg' for candidate in candidates]

router = APIRouter(prefix='/api/exercises', tags=['exercises'])

def serialize(row, request):
    candidates0, candidates1 = _photo_candidates(row)
    primary = REAL_EXERCISE_IMAGE_BASE + REAL_IMAGE_ALIASES[row.slug] if row.slug in REAL_IMAGE_ALIASES else candidates0[0]
    image_candidates = [primary] + [url for url in candidates0 if url != primary]
    return schemas.ExerciseOut(id=row.id,slug=row.slug,name=row.name,muscle_group=row.muscle_group,equipment=row.equipment,difficulty=row.difficulty,sets=row.sets,reps=row.reps,rest_seconds=row.rest_seconds,description=row.description,cues=row.cues or [],common_mistakes=row.common_mistakes or [],goal_tags=row.goal_tags or [],image_url=primary,image_urls=image_candidates,pose_supported=row.pose_supported,pose_type=row.pose_type)

@router.get('',response_model=list[schemas.ExerciseOut])
def list_exercises(request:Request,db:Session=Depends(get_db),q:str|None=Query(None,max_length=100),muscle_group:str|None=None,equipment:str|None=None,difficulty:str|None=None,goal:str|None=None,limit:int=Query(100,ge=1,le=200)):
    stmt=select(models.Exercise).order_by(models.Exercise.difficulty,models.Exercise.name)
    if q: stmt=stmt.where(models.Exercise.name.ilike(f'%{q}%'))
    if muscle_group and muscle_group!='All': stmt=stmt.where(models.Exercise.muscle_group==muscle_group)
    if equipment and equipment!='All': stmt=stmt.where(models.Exercise.equipment==equipment)
    if difficulty and difficulty!='All': stmt=stmt.where(models.Exercise.difficulty==difficulty)
    rows=db.execute(stmt.limit(limit)).scalars().all()
    if goal and goal!='All': rows=[r for r in rows if goal in (r.goal_tags or [])]
    return [serialize(r,request) for r in rows]

@router.get('/{exercise_id}',response_model=schemas.ExerciseOut)
def get_exercise(exercise_id:str,request:Request,db:Session=Depends(get_db)):
    row=db.get(models.Exercise,exercise_id)
    if not row: raise HTTPException(404,'Exercise not found')
    return serialize(row,request)
