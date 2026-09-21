import type { Difficulty, Exercise } from '@/types'

/**
 * Curated, direct YouTube video IDs for the exercise library.
 * Every exercise gets a real embed URL; the app never falls back to a
 * YouTube search-results iframe (those frequently show "Video unavailable").
 */
const VIDEO_IDS: Record<string, string> = {
  'beginner-bodyweight-squat': 'u-xm0I1Lcgs',
  'beginner-glute-bridge': 'z5DWpCN0UOs',
  'beginner-knee-push-up': 'lGV4aTK9SvU',
  'beginner-wall-push-up': 'ZUuYbRgcHmg',
  'beginner-reverse-lunge': '-Nr6dqEvz3Q',
  'beginner-step-up': 'URHdW9js6DM',
  'beginner-bodyweight-split-squat': 'u-xm0I1Lcgs',
  'beginner-standing-calf-raise': 'CtpPV2FBkG4',
  'beginner-forearm-plank': '44ND4bOB-T0',
  'beginner-dead-bug': 'bxn9FBrt4-A',
  'beginner-bird-dog': 'ZdAHe9_HeEw',
  'beginner-mountain-climber': 'D0GwAezTvtg',
  'beginner-high-knees': 'D0GwAezTvtg',
  'beginner-bodyweight-good-morning': 'QFbZevA7dps',
  'beginner-superman': 'ZdAHe9_HeEw',
  'beginner-side-plank': '44ND4bOB-T0',
  'beginner-chair-squat': 'vsf7FrhGuG8',
  'beginner-incline-push-up': '0JUrOH--Kdk',
  'beginner-crunch': 'bxn9FBrt4-A',
  'beginner-bear-plank': '44ND4bOB-T0',
  'beginner-dumbbell-bicep-curl': 'aWYcZTk3iG8',
  'beginner-dumbbell-shoulder-press': 'aWYcZTk3iG8',

  'intermediate-dumbbell-goblet-squat': '5fH5RacAZG0',
  'intermediate-dumbbell-bench-press': 'CayG6UYqL8g',
  'intermediate-one-arm-dumbbell-row': 'gfUg6qWohTk',
  'intermediate-dumbbell-shoulder-press': 'aWYcZTk3iG8',
  'intermediate-dumbbell-walking-lunge': '-Nr6dqEvz3Q',
  'intermediate-dumbbell-romanian-deadlift': 'QFbZevA7dps',
  'intermediate-lat-pulldown': 'SALxEARiMkw',
  'intermediate-seated-cable-row': 'sP_4vybjVJs',
  'intermediate-cable-chest-fly': 'NpKBiptQths',
  'intermediate-cable-face-pull': 'DvjmJdEswQ4',
  'intermediate-leg-press': 'cDGOn-yfKJA',
  'intermediate-seated-leg-curl': 'cDGOn-yfKJA',
  'intermediate-cable-triceps-pushdown': 'CayG6UYqL8g',
  'intermediate-dumbbell-bicep-curl': 'aWYcZTk3iG8',
  'intermediate-kettlebell-swing': 'B_x0tp3HIbk',
  'intermediate-barbell-back-squat': 'FV20rKCI-pA',
  'intermediate-barbell-bench-press': 'CayG6UYqL8g',
  'intermediate-cable-lateral-raise': 'NAtsHyowOXg',
  'intermediate-dumbbell-bulgarian-split-squat': '-Nr6dqEvz3Q',
  'intermediate-dumbbell-romanian-deadlift-plus': 'QFbZevA7dps',

  'advanced-conventional-deadlift': 'XujaeiR5XoM',
  'advanced-front-squat': 'u-xm0I1Lcgs',
  'advanced-barbell-row': 'pNzp064j8g0',
  'advanced-barbell-overhead-press': 'nNMR9fRGRjQ',
  'advanced-weighted-pull-up': '9yVGh3XbJ34',
  'advanced-weighted-dip': 'fwfZchB1mvA',
  'advanced-barbell-hip-thrust': 'aweBS7K71l8',
  'advanced-paused-barbell-squat': 'FV20rKCI-pA',
  'advanced-incline-barbell-bench-press': 'CayG6UYqL8g',
  'advanced-barbell-romanian-deadlift': 'QFbZevA7dps',
  'advanced-heavy-cable-row': 'sP_4vybjVJs',
  'advanced-heavy-leg-press': 'cDGOn-yfKJA',
  'advanced-leg-extension': 'cDGOn-yfKJA',
  'advanced-lying-leg-curl': 'G5iP_YcDQdE',
  'advanced-cable-crossover': 'NpKBiptQths',
  'advanced-heavy-dumbbell-bench-press': 'CayG6UYqL8g',
  'advanced-heavy-one-arm-dumbbell-row': 'gfUg6qWohTk',
  'advanced-barbell-curl': 'aWYcZTk3iG8',
  'advanced-ez-bar-skull-crusher': 'CayG6UYqL8g',
  'advanced-cable-crunch': 'bxn9FBrt4-A',
}

const FALLBACK_BY_NAME: Array<[RegExp, string]> = [
  [/squat/i, 'u-xm0I1Lcgs'],
  [/lunge|split squat/i, '-Nr6dqEvz3Q'],
  [/deadlift|good morning/i, 'QFbZevA7dps'],
  [/bench press/i, 'CayG6UYqL8g'],
  [/pull[- ]?up/i, '9yVGh3XbJ34'],
  [/lat pulldown/i, 'SALxEARiMkw'],
  [/row/i, 'sP_4vybjVJs'],
  [/face pull/i, 'DvjmJdEswQ4'],
  [/shoulder press|overhead press/i, 'aWYcZTk3iG8'],
  [/kettlebell swing/i, 'B_x0tp3HIbk'],
  [/hip thrust/i, 'aweBS7K71l8'],
  [/leg press|leg curl|leg extension/i, 'cDGOn-yfKJA'],
  [/push[- ]?up/i, '0JUrOH--Kdk'],
  [/plank|crunch|dead bug/i, 'bxn9FBrt4-A'],
  [/high knees|mountain climber/i, 'D0GwAezTvtg'],
  [/bird dog|superman/i, 'ZdAHe9_HeEw'],
]

export function getExerciseVideoId(exercise: Exercise): string {
  const exact = VIDEO_IDS[exercise.slug]
  if (exact) return exact

  const byName = FALLBACK_BY_NAME.find(([pattern]) => pattern.test(exercise.name))
  if (byName) return byName[1]

  // The library is expected to remain video-complete. Use the verified
  // bodyweight squat demonstration as a final safe, direct YouTube embed.
  return 'u-xm0I1Lcgs'
}

export function getExerciseYoutubeEmbedUrl(exercise: Exercise, _level?: Difficulty): string {
  return `https://www.youtube-nocookie.com/embed/${getExerciseVideoId(exercise)}?rel=0&modestbranding=1&playsinline=1`
}

export function getExerciseYoutubeWatchUrl(exercise: Exercise): string {
  return `https://www.youtube.com/watch?v=${getExerciseVideoId(exercise)}`
}
