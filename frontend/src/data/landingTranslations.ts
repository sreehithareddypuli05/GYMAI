export type LandingLanguage = 'en' | 'es' | 'hi' | 'te'

export const landingCopy: Record<LandingLanguage, {
  heroTitle: string
  heroLead: string
  startTraining: string
  seeHowItWorks: string
  personalizedWorkouts: string
  adaptiveTraining: string
  movementFeedback: string
  scrollToExplore: string
}> = {
  en: {
    heroTitle: 'TRAIN WITH PURPOSE.',
    heroLead: 'GymAI combines smart planning, movement guidance and progress tracking to turn your fitness goal into a routine you can actually follow.',
    startTraining: 'START TRAINING',
    seeHowItWorks: 'SEE HOW IT WORKS',
    personalizedWorkouts: 'Personalized workouts',
    adaptiveTraining: 'Adaptive training',
    movementFeedback: 'Movement feedback',
    scrollToExplore: 'SCROLL TO EXPLORE',
  },
  es: {
    heroTitle: 'ENTRENA CON PROPOSITO.',
    heroLead: 'GymAI combina planificacion inteligente, guia de movimiento y seguimiento del progreso para convertir tu objetivo de fitness en una rutina que puedes seguir.',
    startTraining: 'EMPEZAR A ENTRENAR',
    seeHowItWorks: 'MIRA COMO FUNCIONA',
    personalizedWorkouts: 'Entrenamientos personalizados',
    adaptiveTraining: 'Entrenamiento adaptable',
    movementFeedback: 'Comentarios sobre el movimiento',
    scrollToExplore: 'DESPLAZATE PARA EXPLORAR',
  },
  hi: {
    heroTitle: 'उद्देश्य के साथ ट्रेन करें।',
    heroLead: 'GymAI स्मार्ट प्लानिंग, मूवमेंट गाइडेंस और प्रगति ट्रैकिंग को जोड़कर आपके फिटनेस लक्ष्य को ऐसी दिनचर्या में बदलता है जिसे आप अपना सकें।',
    startTraining: 'ट्रेनिंग शुरू करें',
    seeHowItWorks: 'देखें यह कैसे काम करता है',
    personalizedWorkouts: 'व्यक्तिगत वर्कआउट',
    adaptiveTraining: 'अनुकूल ट्रेनिंग',
    movementFeedback: 'मूवमेंट फीडबैक',
    scrollToExplore: 'एक्सप्लोर करने के लिए स्क्रॉल करें',
  },
  te: {
    heroTitle: 'లక్ష్యంతో శిక్షణ పొందండి.',
    heroLead: 'GymAI స్మార్ట్ ప్లానింగ్, కదలిక మార్గదర్శకత్వం మరియు పురోగతి ట్రాకింగ్‌ను కలిపి మీ ఫిట్‌నెస్ లక్ష్యాన్ని మీరు కొనసాగించగల పద్ధతిగా మారుస్తుంది.',
    startTraining: 'శిక్షణ ప్రారంభించండి',
    seeHowItWorks: 'ఇది ఎలా పనిచేస్తుందో చూడండి',
    personalizedWorkouts: 'వ్యక్తిగత వర్కౌట్లు',
    adaptiveTraining: 'అనుకూల శిక్షణ',
    movementFeedback: 'కదలిక ఫీడ్‌బ్యాక్',
    scrollToExplore: 'చూడటానికి స్క్రోల్ చేయండి',
  },
}
