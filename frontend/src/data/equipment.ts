export type EquipmentLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export interface EquipmentItem { id: string; name: string; description: string; image: string; amazonQuery: string; flipkartQuery: string }

const img = (q: string) => `https://images.unsplash.com/${q}`

export const equipmentByLevel: Record<EquipmentLevel, EquipmentItem[]> = {
  Beginner: [
    { id:'yoga-mat', name:'Yoga Mat', description:'A stable surface for mobility, core work and floor exercises.', image:img('photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85'), amazonQuery:'yoga mat fitness', flipkartQuery:'yoga mat fitness' },
    { id:'resistance-bands', name:'Resistance Bands', description:'Compact resistance for warm-ups, mobility and strength work.', image:img('photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=900&q=85'), amazonQuery:'resistance bands gym', flipkartQuery:'resistance bands gym' },
    { id:'light-dumbbells', name:'Light Dumbbells', description:'Simple load progression for beginner strength sessions.', image:img('photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85'), amazonQuery:'light dumbbells', flipkartQuery:'light dumbbells' },
    { id:'skipping-rope', name:'Skipping Rope', description:'An accessible option for conditioning and coordination.', image:img('photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&w=900&q=85'), amazonQuery:'skipping rope fitness', flipkartQuery:'skipping rope fitness' },
  ],
  Intermediate: [
    { id:'adjustable-dumbbells', name:'Adjustable Dumbbells', description:'Flexible loading for progressive resistance training at home.', image:img('photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85'), amazonQuery:'adjustable dumbbells', flipkartQuery:'adjustable dumbbells' },
    { id:'kettlebell', name:'Kettlebell', description:'Useful for swings, carries, squats and full-body strength work.', image:img('photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=85'), amazonQuery:'kettlebell', flipkartQuery:'kettlebell' },
    { id:'weight-bench', name:'Adjustable Weight Bench', description:'Adds pressing and supported strength variations to sessions.', image:img('photo-1586401100295-7a8096fd231a?auto=format&fit=crop&w=900&q=85'), amazonQuery:'adjustable weight bench', flipkartQuery:'adjustable weight bench' },
    { id:'pull-up-bar', name:'Pull-Up Bar', description:'A compact setup for pulling, hanging and core progressions.', image:img('photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85'), amazonQuery:'pull up bar', flipkartQuery:'pull up bar' },
  ],
  Advanced: [
    { id:'olympic-barbell', name:'Olympic Barbell', description:'A foundational tool for heavier compound strength training.', image:img('photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85'), amazonQuery:'olympic barbell', flipkartQuery:'olympic barbell' },
    { id:'power-rack', name:'Power Rack', description:'A stable rack system for squats, presses and advanced barbell work.', image:img('photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85'), amazonQuery:'power rack gym', flipkartQuery:'power rack gym' },
    { id:'weight-plates', name:'Olympic Weight Plates', description:'Progressive loading for barbell strength and hypertrophy sessions.', image:img('photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85'), amazonQuery:'olympic weight plates', flipkartQuery:'olympic weight plates' },
    { id:'cable-machine', name:'Cable Machine', description:'Versatile resistance for controlled isolation and functional movements.', image:img('photo-1598971639058-999f9d0f6e08?auto=format&fit=crop&w=900&q=85'), amazonQuery:'cable crossover machine gym', flipkartQuery:'cable crossover machine gym' },
  ],
}

export function shoppingUrl(store: 'amazon' | 'flipkart', query: string) {
  return store === 'amazon' ? `https://www.amazon.in/s?k=${encodeURIComponent(query)}` : `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
}
