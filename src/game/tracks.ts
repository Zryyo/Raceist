import { CircuitDefinition } from '../types/game';

/**
 * 24-circuit calendar (parody names, real layouts)
 * Each track has meticulously shaped geometric racing lines, authentic sectors,
 * high-speed DRS zones, kerb placement, and realistic target lap times.
 */
export const CIRCUITS: CircuitDefinition[] = [
  // 1. BAHRAIN
  {
    id: 'bahrain',
    name: 'Sakhir Sandbox Speedway',
    location: 'Sakhir, Bahrain',
    countryCode: 'BH',
    flag: '🇧🇭',
    lengthKm: 5.412,
    roadWidth: 76,
    targetLapTime: 52.0,
    difficulty: 'PRO',
    characteristics: ['Desert Night Race', 'Turn 1 Hairpin', 'Downhill Turn 10', 'Heavy Braking Zones'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 1000, y: 1400 },
      { x: 650, y: 1400 },
      // T1/T2/T3 complex
      { x: 420, y: 1370, kerbSide: 'right', speedGuide: 75 },
      { x: 450, y: 1250, kerbSide: 'left', speedGuide: 120 },
      { x: 570, y: 1210, speedGuide: 220 },
      // Run to Turn 4
      { x: 820, y: 1140, speedGuide: 280 },
      { x: 1040, y: 1080, speedGuide: 300 },
      { x: 1150, y: 1000, kerbSide: 'right', speedGuide: 130 },
      // High-speed sweepers T5-T7
      { x: 1080, y: 860, kerbSide: 'left', speedGuide: 240 },
      { x: 990, y: 760, kerbSide: 'right', speedGuide: 220 },
      { x: 880, y: 700, kerbSide: 'left', speedGuide: 235 },
      // Turn 8 Hairpin
      { x: 740, y: 690, kerbSide: 'right', speedGuide: 75 },
      { x: 700, y: 600, speedGuide: 140 },
      // Tricky downhill T9/T10
      { x: 780, y: 480, speedGuide: 210 },
      { x: 840, y: 390, kerbSide: 'left', speedGuide: 80 },
      // Back straight into T11
      { x: 1050, y: 410, speedGuide: 280 },
      { x: 1320, y: 450, speedGuide: 310 },
      { x: 1540, y: 520, kerbSide: 'left', speedGuide: 190 },
      // Turn 12 & 13
      { x: 1720, y: 660, speedGuide: 270 },
      { x: 1840, y: 850, kerbSide: 'right', speedGuide: 140 },
      // Straight to final Turn 14/15
      { x: 1800, y: 1080, speedGuide: 280 },
      { x: 1780, y: 1260, speedGuide: 295 },
      { x: 1710, y: 1370, kerbSide: 'right', speedGuide: 120 },
      { x: 1560, y: 1400, speedGuide: 240 }
    ],
    sectors: { s1EndIdx: 8, s2EndIdx: 17 },
    drsZone: { detectIdx: 22, startIdx: 23, endIdx: 2 },
    brakeMarkers: [
      { x: 550, y: 1440, distance: '100m', angle: 0 },
      { x: 950, y: 1110, distance: '100m', angle: 0 }
    ]
  },

  // 2. JEDDAH
  {
    id: 'jeddah',
    name: 'Jeddah Wall-Kisser Circuit',
    location: 'Jeddah, Saudi Arabia',
    countryCode: 'SA',
    flag: '🇸🇦',
    lengthKm: 6.174,
    roadWidth: 72,
    targetLapTime: 54.0,
    difficulty: 'EXTREME',
    characteristics: ['Fastest Street Track', 'Blind Sweepers', 'Close Concrete Barriers', 'Triple DRS Zones'],
    start: { x: 1400, y: 1420, angle: Math.PI },
    points: [
      { x: 1400, y: 1420 },
      { x: 1000, y: 1420 },
      { x: 680, y: 1410 },
      // T1/T2 chicane
      { x: 480, y: 1380, kerbSide: 'left', speedGuide: 110 },
      { x: 440, y: 1280, kerbSide: 'right', speedGuide: 115 },
      // Rhythmic high-speed curves
      { x: 500, y: 1160, kerbSide: 'left', speedGuide: 250 },
      { x: 580, y: 1040, kerbSide: 'right', speedGuide: 260 },
      { x: 620, y: 900, kerbSide: 'left', speedGuide: 275 },
      { x: 610, y: 760, speedGuide: 290 },
      // Turn 13 banked hairpin
      { x: 560, y: 600, speedGuide: 240 },
      { x: 540, y: 460, kerbSide: 'left', speedGuide: 170 },
      { x: 610, y: 350, kerbSide: 'left', speedGuide: 155 },
      { x: 740, y: 340, kerbSide: 'left', speedGuide: 180 },
      // Super fast return sweepers T14-T21
      { x: 920, y: 400, speedGuide: 280 },
      { x: 1120, y: 480, speedGuide: 310 },
      { x: 1340, y: 560, speedGuide: 320 },
      { x: 1560, y: 640, speedGuide: 315 },
      { x: 1750, y: 720, kerbSide: 'right', speedGuide: 270 },
      { x: 1900, y: 840, kerbSide: 'left', speedGuide: 285 },
      { x: 1980, y: 1000, speedGuide: 320 },
      { x: 1990, y: 1180, speedGuide: 330 },
      // Turn 27 final hairpin
      { x: 1920, y: 1330, kerbSide: 'left', speedGuide: 120 },
      { x: 1800, y: 1400, kerbSide: 'left', speedGuide: 160 },
      { x: 1620, y: 1420, speedGuide: 280 }
    ],
    sectors: { s1EndIdx: 8, s2EndIdx: 16 },
    drsZone: { detectIdx: 19, startIdx: 21, endIdx: 2 },
    brakeMarkers: [
      { x: 580, y: 1440, distance: '100m', angle: 0 },
      { x: 1970, y: 1250, distance: '100m', angle: Math.PI / 2 }
    ]
  },

  // 3. ALBERT PARK (MELBOURNE)
  {
    id: 'albert_park',
    name: "Albert's Parking Lot",
    location: 'Melbourne, Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    lengthKm: 5.278,
    roadWidth: 76,
    targetLapTime: 49.0,
    difficulty: 'PRO',
    characteristics: ['Lakeside Setting', 'Turn 9/10 Flat-Out Chicane', 'Rapid Direction Changes'],
    start: { x: 1400, y: 1380, angle: Math.PI },
    points: [
      { x: 1400, y: 1380 },
      { x: 1050, y: 1380 },
      { x: 760, y: 1370 },
      // T1/T2 chicane
      { x: 580, y: 1320, kerbSide: 'right', speedGuide: 140 },
      { x: 490, y: 1230, kerbSide: 'left', speedGuide: 160 },
      // Run to Turn 3
      { x: 480, y: 1070, speedGuide: 270 },
      { x: 460, y: 900, speedGuide: 290 },
      { x: 490, y: 770, kerbSide: 'right', speedGuide: 110 },
      // T4/T5
      { x: 590, y: 740, kerbSide: 'left', speedGuide: 140 },
      { x: 740, y: 760, speedGuide: 230 },
      // T6/T7
      { x: 920, y: 760, kerbSide: 'right', speedGuide: 170 },
      { x: 1100, y: 730, speedGuide: 280 },
      // Lakeside DRS curve into T9/10
      { x: 1340, y: 670, speedGuide: 320 },
      { x: 1560, y: 590, speedGuide: 330 },
      // T9/T10 flat-out chicane
      { x: 1720, y: 530, kerbSide: 'left', speedGuide: 245 },
      { x: 1840, y: 550, kerbSide: 'right', speedGuide: 235 },
      // T11/T12 high-speed left-right
      { x: 1920, y: 690, speedGuide: 270 },
      { x: 1930, y: 880, kerbSide: 'left', speedGuide: 195 },
      { x: 1880, y: 1040, kerbSide: 'right', speedGuide: 180 },
      // T13/T14 onto main straight
      { x: 1820, y: 1200, speedGuide: 230 },
      { x: 1720, y: 1310, kerbSide: 'left', speedGuide: 125 },
      { x: 1580, y: 1370, speedGuide: 220 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 14 },
    drsZone: { detectIdx: 11, startIdx: 12, endIdx: 14 },
    brakeMarkers: [{ x: 670, y: 1400, distance: '100m', angle: 0 }]
  },

  // 4. SUZUKA
  {
    id: 'suzuka',
    name: 'Snoozuka Figure-Eight',
    location: 'Mie Prefecture, Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    lengthKm: 5.807,
    roadWidth: 74,
    targetLapTime: 58.0,
    difficulty: 'CHAMPION',
    characteristics: ['Flowing S-Curves', 'Degner 1 & 2', '130R Flat-Out Sweeper', 'Casio Chicane'],
    start: { x: 1550, y: 1350, angle: Math.PI },
    points: [
      { x: 1550, y: 1350 },
      { x: 1220, y: 1350 },
      { x: 950, y: 1350 },
      { x: 770, y: 1310, kerbSide: 'right', speedGuide: 240 },
      { x: 650, y: 1210, kerbSide: 'right', speedGuide: 170 },
      { x: 620, y: 1070, kerbSide: 'left', speedGuide: 210 },
      { x: 540, y: 950, kerbSide: 'right', speedGuide: 200 },
      { x: 590, y: 830, kerbSide: 'left', speedGuide: 195 },
      { x: 530, y: 720, kerbSide: 'right', speedGuide: 190 },
      { x: 440, y: 640, kerbSide: 'left', speedGuide: 220 },
      { x: 370, y: 530, speedGuide: 235 },
      { x: 420, y: 420, kerbSide: 'right', speedGuide: 240 },
      { x: 530, y: 380, speedGuide: 230 },
      { x: 630, y: 410, kerbSide: 'right', speedGuide: 140 },
      { x: 720, y: 520, speedGuide: 220 },
      { x: 820, y: 650, speedGuide: 240 },
      { x: 890, y: 770, kerbSide: 'left', speedGuide: 75 },
      { x: 980, y: 740, kerbSide: 'left', speedGuide: 90 },
      { x: 1120, y: 670, speedGuide: 250 },
      { x: 1320, y: 610, speedGuide: 275 },
      { x: 1540, y: 560, kerbSide: 'left', speedGuide: 185 },
      { x: 1690, y: 590, kerbSide: 'left', speedGuide: 175 },
      { x: 1780, y: 730, speedGuide: 290 },
      { x: 1850, y: 920, speedGuide: 320 },
      { x: 1890, y: 1120, speedGuide: 335 },
      { x: 1850, y: 1250, kerbSide: 'left', speedGuide: 295 },
      { x: 1740, y: 1310, kerbSide: 'right', speedGuide: 95 },
      { x: 1660, y: 1350, kerbSide: 'left', speedGuide: 115 }
    ],
    sectors: { s1EndIdx: 9, s2EndIdx: 19 },
    drsZone: { detectIdx: 20, startIdx: 21, endIdx: 24 },
    brakeMarkers: [
      { x: 1870, y: 1200, distance: '100m', angle: Math.PI / 2 },
      { x: 820, y: 720, distance: '100m', angle: Math.PI / 4 }
    ]
  },

  // 5. SHANGHAI
  {
    id: 'shanghai',
    name: 'Shang-High Octane Circuit',
    location: 'Shanghai, China',
    countryCode: 'CN',
    flag: '🇨🇳',
    lengthKm: 5.451,
    roadWidth: 76,
    targetLapTime: 56.0,
    difficulty: 'PRO',
    characteristics: ['Endless Turn 1 Snail', '1.2km Back Straight', 'Tight Hairpin Turn 14'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 950, y: 1400 },
      { x: 620, y: 1400 },
      // Snail Corner T1-T4 (Tightening 270° spiral)
      { x: 420, y: 1350, kerbSide: 'right', speedGuide: 160 },
      { x: 380, y: 1220, kerbSide: 'right', speedGuide: 120 },
      { x: 460, y: 1130, kerbSide: 'right', speedGuide: 90 },
      { x: 570, y: 1170, kerbSide: 'right', speedGuide: 80 },
      { x: 570, y: 1280, kerbSide: 'left', speedGuide: 120 },
      { x: 690, y: 1280, speedGuide: 180 },
      // Turn 6 Hairpin
      { x: 840, y: 1240, kerbSide: 'right', speedGuide: 95 },
      // High-speed sweepers T7 & T8
      { x: 920, y: 1090, speedGuide: 240 },
      { x: 1040, y: 960, kerbSide: 'left', speedGuide: 260 },
      { x: 1180, y: 880, kerbSide: 'right', speedGuide: 250 },
      // T9/T10 chicane
      { x: 1150, y: 740, kerbSide: 'left', speedGuide: 150 },
      { x: 1190, y: 620, kerbSide: 'right', speedGuide: 140 },
      // Turn 11/12 leading to massive straight
      { x: 1280, y: 530, speedGuide: 190 },
      { x: 1440, y: 470, speedGuide: 230 },
      // 1.2km Back Straight (Highest top speed in China)
      { x: 1680, y: 460, speedGuide: 310 },
      { x: 1920, y: 470, speedGuide: 335 },
      { x: 2150, y: 490, speedGuide: 345 },
      // Turn 14 heavy braking hairpin
      { x: 2260, y: 580, kerbSide: 'right', speedGuide: 70 },
      { x: 2190, y: 720, speedGuide: 160 },
      // Turn 16 onto main straight
      { x: 2020, y: 920, speedGuide: 230 },
      { x: 1880, y: 1180, speedGuide: 280 },
      { x: 1720, y: 1350, kerbSide: 'left', speedGuide: 160 },
      { x: 1560, y: 1400, speedGuide: 240 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 16, startIdx: 17, endIdx: 19 },
    brakeMarkers: [{ x: 2080, y: 490, distance: '100m', angle: 0 }]
  },

  // 6. MIAMI
  {
    id: 'miami',
    name: 'Fake Marina Autodrome',
    location: 'Miami, USA',
    countryCode: 'US',
    flag: '🇺🇸',
    lengthKm: 5.412,
    roadWidth: 74,
    targetLapTime: 53.0,
    difficulty: 'PRO',
    characteristics: ['Hard Rock Stadium', 'Technical Marina Chicane', '1.2km Blast to Turn 17'],
    start: { x: 1400, y: 1400, angle: Math.PI },
    points: [
      { x: 1400, y: 1400 },
      { x: 1000, y: 1400 },
      { x: 680, y: 1400 },
      // T1 right hander
      { x: 490, y: 1360, kerbSide: 'right', speedGuide: 120 },
      // Complex around stadium T2-T5
      { x: 420, y: 1230, kerbSide: 'left', speedGuide: 210 },
      { x: 450, y: 1080, kerbSide: 'right', speedGuide: 230 },
      { x: 530, y: 950, kerbSide: 'left', speedGuide: 250 },
      { x: 670, y: 840, speedGuide: 270 },
      // T7 & T8
      { x: 860, y: 760, kerbSide: 'left', speedGuide: 140 },
      { x: 1040, y: 740, speedGuide: 240 },
      // T11/T12/T13 technical overpass
      { x: 1220, y: 720, kerbSide: 'left', speedGuide: 110 },
      { x: 1240, y: 600, kerbSide: 'right', speedGuide: 90 },
      { x: 1160, y: 520, kerbSide: 'left', speedGuide: 80 },
      { x: 1060, y: 490, kerbSide: 'right', speedGuide: 120 },
      // Massive back straight (T16 run)
      { x: 1180, y: 430, speedGuide: 270 },
      { x: 1460, y: 420, speedGuide: 320 },
      { x: 1780, y: 420, speedGuide: 340 },
      { x: 2060, y: 430, speedGuide: 345 },
      // T17 Hairpin
      { x: 2190, y: 530, kerbSide: 'left', speedGuide: 75 },
      { x: 2120, y: 680, speedGuide: 170 },
      // T18/T19 back onto pit straight
      { x: 1980, y: 880, speedGuide: 260 },
      { x: 1840, y: 1120, speedGuide: 290 },
      { x: 1720, y: 1320, kerbSide: 'left', speedGuide: 170 },
      { x: 1580, y: 1390, speedGuide: 250 }
    ],
    sectors: { s1EndIdx: 8, s2EndIdx: 15 },
    drsZone: { detectIdx: 14, startIdx: 15, endIdx: 18 },
    brakeMarkers: [{ x: 1980, y: 430, distance: '100m', angle: 0 }]
  },

  // 7. IMOLA
  {
    id: 'imola',
    name: 'Autodromo Spaghetti Junction',
    location: 'Imola, Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    lengthKm: 4.909,
    roadWidth: 74,
    targetLapTime: 48.0,
    difficulty: 'CHAMPION',
    characteristics: ['Historic Old-School Circuit', 'Variante Tamburello', 'Acque Minerali', 'Rivazza Crest'],
    start: { x: 1400, y: 1360, angle: Math.PI },
    points: [
      { x: 1400, y: 1360 },
      { x: 1050, y: 1360 },
      { x: 740, y: 1360 },
      // Variante Tamburello (T2/T3/T4)
      { x: 560, y: 1320, kerbSide: 'left', speedGuide: 130 },
      { x: 470, y: 1220, kerbSide: 'right', speedGuide: 140 },
      { x: 520, y: 1100, kerbSide: 'left', speedGuide: 170 },
      // Run to Variante Villeneuve
      { x: 640, y: 980, speedGuide: 280 },
      { x: 770, y: 850, kerbSide: 'left', speedGuide: 160 },
      { x: 760, y: 720, kerbSide: 'right', speedGuide: 150 },
      // Tosa Hairpin
      { x: 670, y: 600, kerbSide: 'left', speedGuide: 85 },
      // Piratella downhill crest
      { x: 780, y: 490, speedGuide: 220 },
      { x: 960, y: 430, kerbSide: 'left', speedGuide: 200 },
      // Acque Minerali downhill plunging double-right
      { x: 1140, y: 470, speedGuide: 260 },
      { x: 1280, y: 550, kerbSide: 'right', speedGuide: 145 },
      { x: 1380, y: 650, kerbSide: 'right', speedGuide: 160 },
      // Variante Alta
      { x: 1480, y: 780, speedGuide: 240 },
      { x: 1580, y: 870, kerbSide: 'right', speedGuide: 115 },
      { x: 1640, y: 960, kerbSide: 'left', speedGuide: 125 },
      // Rivazza 1 & 2
      { x: 1760, y: 1100, speedGuide: 270 },
      { x: 1820, y: 1240, kerbSide: 'left', speedGuide: 130 },
      { x: 1740, y: 1330, kerbSide: 'left', speedGuide: 140 },
      { x: 1580, y: 1360, speedGuide: 260 }
    ],
    sectors: { s1EndIdx: 8, s2EndIdx: 15 },
    drsZone: { detectIdx: 20, startIdx: 21, endIdx: 2 },
    brakeMarkers: [{ x: 640, y: 1380, distance: '100m', angle: 0 }]
  },

  // 8. MONACO
  {
    id: 'monaco',
    name: 'Circuit de Money-co',
    location: 'Monte Carlo, Monaco',
    countryCode: 'MC',
    flag: '🇲🇨',
    lengthKm: 3.337,
    roadWidth: 68,
    targetLapTime: 48.0,
    difficulty: 'EXTREME',
    characteristics: ['Tight Armco Barriers', 'Grand Hotel Hairpin', 'Tunnel Straight', 'Swimming Pool Chicane'],
    start: { x: 1300, y: 1320, angle: Math.PI },
    points: [
      { x: 1300, y: 1320 },
      { x: 1050, y: 1320 },
      { x: 800, y: 1320 },
      { x: 670, y: 1290, kerbSide: 'right', speedGuide: 95 },
      { x: 590, y: 1180, speedGuide: 230 },
      { x: 520, y: 1020, speedGuide: 260 },
      { x: 450, y: 860, kerbSide: 'left', speedGuide: 160 },
      { x: 490, y: 720, kerbSide: 'right', speedGuide: 145 },
      { x: 590, y: 640, kerbSide: 'right', speedGuide: 95 },
      { x: 670, y: 600, kerbSide: 'right', speedGuide: 50 },
      { x: 740, y: 640, kerbSide: 'right', speedGuide: 55 },
      { x: 820, y: 720, kerbSide: 'right', speedGuide: 85 },
      { x: 920, y: 780, kerbSide: 'right', speedGuide: 90 },
      { x: 1110, y: 770, speedGuide: 260 },
      { x: 1350, y: 760, speedGuide: 285 },
      { x: 1580, y: 770, speedGuide: 290 },
      { x: 1720, y: 820, kerbSide: 'left', speedGuide: 80 },
      { x: 1760, y: 920, kerbSide: 'right', speedGuide: 90 },
      { x: 1720, y: 1040, kerbSide: 'left', speedGuide: 160 },
      { x: 1680, y: 1150, kerbSide: 'left', speedGuide: 210 },
      { x: 1740, y: 1220, kerbSide: 'right', speedGuide: 130 },
      { x: 1670, y: 1280, kerbSide: 'right', speedGuide: 70 },
      { x: 1540, y: 1315, kerbSide: 'right', speedGuide: 95 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 16 },
    drsZone: { detectIdx: 12, startIdx: 13, endIdx: 16 },
    brakeMarkers: [
      { x: 750, y: 1350, distance: '100m', angle: 0 },
      { x: 1640, y: 790, distance: '100m', angle: 0 }
    ]
  },

  // 9. MONTREAL (CANADA)
  {
    id: 'montreal',
    name: 'Circuit Groundhog-Villeneuve',
    location: 'Montreal, Canada',
    countryCode: 'CA',
    flag: '🇨🇦',
    lengthKm: 4.361,
    roadWidth: 74,
    targetLapTime: 47.0,
    difficulty: 'PRO',
    characteristics: ['Wall of Champions', 'Casino Straight 340km/h', 'Heavy Curb Hopping Chicanes'],
    start: { x: 1350, y: 1380, angle: Math.PI },
    points: [
      { x: 1350, y: 1380 },
      { x: 950, y: 1380 },
      { x: 620, y: 1380 },
      // T1/T2 Senna chicane & hairpin
      { x: 440, y: 1340, kerbSide: 'left', speedGuide: 110 },
      { x: 390, y: 1220, kerbSide: 'right', speedGuide: 75 },
      { x: 490, y: 1160, kerbSide: 'right', speedGuide: 120 },
      // Chicanes T3/T4
      { x: 670, y: 1140, speedGuide: 220 },
      { x: 820, y: 1080, kerbSide: 'right', speedGuide: 135 },
      { x: 930, y: 1010, kerbSide: 'left', speedGuide: 145 },
      // T6/T7
      { x: 1100, y: 920, speedGuide: 240 },
      { x: 1160, y: 810, kerbSide: 'left', speedGuide: 120 },
      { x: 1280, y: 760, kerbSide: 'right', speedGuide: 135 },
      // T8/T9
      { x: 1440, y: 700, speedGuide: 250 },
      { x: 1540, y: 620, kerbSide: 'right', speedGuide: 140 },
      { x: 1640, y: 550, kerbSide: 'left', speedGuide: 150 },
      // Hairpin Epingle Turn 10
      { x: 1780, y: 470, speedGuide: 240 },
      { x: 1940, y: 420, kerbSide: 'right', speedGuide: 70 },
      { x: 2020, y: 520, kerbSide: 'right', speedGuide: 90 },
      // Droit du Casino (Monster DRS straight)
      { x: 1960, y: 720, speedGuide: 280 },
      { x: 1880, y: 980, speedGuide: 325 },
      { x: 1790, y: 1220, speedGuide: 345 },
      // Wall of Champions Chicane T13/T14
      { x: 1720, y: 1330, kerbSide: 'right', speedGuide: 125 },
      { x: 1610, y: 1380, kerbSide: 'left', speedGuide: 135 },
      { x: 1480, y: 1380, speedGuide: 250 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 16 },
    drsZone: { detectIdx: 17, startIdx: 18, endIdx: 21 },
    brakeMarkers: [{ x: 1840, y: 1150, distance: '100m', angle: Math.PI / 2 }]
  },

  // 10. BARCELONA
  {
    id: 'barcelona',
    name: 'Circuit de Barcelona-Siesta',
    location: 'Montmeló, Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    lengthKm: 4.657,
    roadWidth: 76,
    targetLapTime: 50.0,
    difficulty: 'INTERMEDIATE',
    characteristics: ['Turn 3 Long High-G Sweeper', 'Turn 9 Campsa Crest', 'Restored Fast Final Corners'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 950, y: 1400 },
      { x: 640, y: 1400 },
      // T1/T2 Elf chicane
      { x: 450, y: 1360, kerbSide: 'right', speedGuide: 130 },
      { x: 420, y: 1240, kerbSide: 'left', speedGuide: 145 },
      // Turn 3 Renault monster sweeper
      { x: 470, y: 1080, kerbSide: 'right', speedGuide: 235 },
      { x: 570, y: 920, kerbSide: 'right', speedGuide: 250 },
      { x: 720, y: 820, speedGuide: 260 },
      // Turn 4 Repsol
      { x: 890, y: 780, kerbSide: 'right', speedGuide: 135 },
      // Turn 5 Seat downhill hairpin
      { x: 870, y: 640, kerbSide: 'left', speedGuide: 90 },
      // T7/T8 uphill chicane
      { x: 970, y: 530, speedGuide: 200 },
      { x: 1090, y: 460, kerbSide: 'left', speedGuide: 160 },
      { x: 1220, y: 440, kerbSide: 'right', speedGuide: 170 },
      // Turn 9 Campsa flat-out blind crest
      { x: 1380, y: 460, kerbSide: 'right', speedGuide: 245 },
      // Back straight into T10 hairpin
      { x: 1590, y: 540, speedGuide: 300 },
      { x: 1770, y: 660, kerbSide: 'left', speedGuide: 90 },
      // T11/T12 sweeping uphill
      { x: 1760, y: 820, speedGuide: 180 },
      { x: 1840, y: 960, kerbSide: 'right', speedGuide: 195 },
      // Fast final Turn 13 & 14 (New configuration)
      { x: 1910, y: 1120, kerbSide: 'right', speedGuide: 240 },
      { x: 1860, y: 1280, kerbSide: 'right', speedGuide: 255 },
      { x: 1680, y: 1380, speedGuide: 280 },
      { x: 1520, y: 1400, speedGuide: 300 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 20, startIdx: 21, endIdx: 2 },
    brakeMarkers: [{ x: 550, y: 1430, distance: '100m', angle: 0 }]
  },

  // 11. RED BULL RING (AUSTRIA)
  {
    id: 'redbull_ring',
    name: 'Red Cow Ring',
    location: 'Styria, Austria',
    countryCode: 'AT',
    flag: '🇦🇹',
    lengthKm: 4.318,
    roadWidth: 76,
    targetLapTime: 44.0,
    difficulty: 'INTERMEDIATE',
    characteristics: ['Alpine Elevation Changes', 'Remus Uphill Hairpin', 'Downhill Sweepers', 'High Speed DRS'],
    start: { x: 1300, y: 1320, angle: Math.PI },
    points: [
      { x: 1300, y: 1320 },
      { x: 950, y: 1320 },
      { x: 650, y: 1320 },
      { x: 480, y: 1280, kerbSide: 'right', speedGuide: 140 },
      { x: 410, y: 1180, speedGuide: 210 },
      { x: 430, y: 980, speedGuide: 280 },
      { x: 480, y: 720, speedGuide: 320 },
      { x: 560, y: 460, speedGuide: 340 },
      { x: 640, y: 320, kerbSide: 'right', speedGuide: 75 },
      { x: 740, y: 340, kerbSide: 'right', speedGuide: 90 },
      { x: 920, y: 450, speedGuide: 270 },
      { x: 1140, y: 580, speedGuide: 310 },
      { x: 1320, y: 690, kerbSide: 'right', speedGuide: 150 },
      { x: 1460, y: 820, kerbSide: 'left', speedGuide: 190 },
      { x: 1540, y: 980, kerbSide: 'left', speedGuide: 185 },
      { x: 1570, y: 1140, kerbSide: 'right', speedGuide: 220 },
      { x: 1510, y: 1270, kerbSide: 'right', speedGuide: 210 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 12 },
    drsZone: { detectIdx: 4, startIdx: 5, endIdx: 8 },
    brakeMarkers: [
      { x: 570, y: 1350, distance: '100m', angle: 0 },
      { x: 540, y: 410, distance: '100m', angle: Math.PI / 2 }
    ]
  },

  // 12. SILVERSTONE (GREAT BRITAIN)
  {
    id: 'silverstone',
    name: 'Silverscone Circuit',
    location: 'Northamptonshire, UK',
    countryCode: 'GB',
    flag: '🇬🇧',
    lengthKm: 5.891,
    roadWidth: 78,
    targetLapTime: 55.0,
    difficulty: 'CHAMPION',
    characteristics: ['Copse Flat-Out Corner', 'Maggotts-Becketts Esses', 'Hangar Straight DRS', 'Stowe Braking'],
    start: { x: 1650, y: 1380, angle: Math.PI },
    points: [
      { x: 1650, y: 1380 },
      { x: 1300, y: 1380 },
      { x: 1050, y: 1370 },
      { x: 880, y: 1330, kerbSide: 'right', speedGuide: 280 },
      { x: 740, y: 1250, kerbSide: 'left', speedGuide: 260 },
      { x: 570, y: 1170, kerbSide: 'right', speedGuide: 90 },
      { x: 450, y: 1040, kerbSide: 'left', speedGuide: 75 },
      { x: 490, y: 880, kerbSide: 'left', speedGuide: 120 },
      { x: 620, y: 780, kerbSide: 'right', speedGuide: 220 },
      { x: 920, y: 720, speedGuide: 290 },
      { x: 1200, y: 660, speedGuide: 310 },
      { x: 1420, y: 600, kerbSide: 'left', speedGuide: 135 },
      { x: 1510, y: 490, kerbSide: 'right', speedGuide: 115 },
      { x: 1410, y: 360, kerbSide: 'right', speedGuide: 135 },
      { x: 1180, y: 310, speedGuide: 230 },
      { x: 920, y: 260, kerbSide: 'right', speedGuide: 280 },
      { x: 700, y: 240, speedGuide: 290 },
      { x: 520, y: 270, kerbSide: 'left', speedGuide: 275 },
      { x: 410, y: 370, kerbSide: 'right', speedGuide: 230 },
      { x: 350, y: 510, kerbSide: 'left', speedGuide: 210 },
      { x: 380, y: 690, speedGuide: 300 },
      { x: 480, y: 870, speedGuide: 325 },
      { x: 620, y: 1050, speedGuide: 340 },
      { x: 840, y: 1160, kerbSide: 'right', speedGuide: 185 },
      { x: 1120, y: 1170, kerbSide: 'left', speedGuide: 105 },
      { x: 1300, y: 1230, kerbSide: 'right', speedGuide: 140 },
      { x: 1540, y: 1290, kerbSide: 'left', speedGuide: 210 },
      { x: 1800, y: 1360, kerbSide: 'right', speedGuide: 250 }
    ],
    sectors: { s1EndIdx: 10, s2EndIdx: 20 },
    drsZone: { detectIdx: 19, startIdx: 21, endIdx: 23 },
    brakeMarkers: [
      { x: 650, y: 1200, distance: '100m', angle: 0 },
      { x: 700, y: 1100, distance: '100m', angle: Math.PI / 4 }
    ]
  },

  // 13. HUNGARORING (HUNGARY)
  {
    id: 'hungaroring',
    name: 'Hungry-o-Ring',
    location: 'Mogyoród, Hungary',
    countryCode: 'HU',
    flag: '🇭🇺',
    lengthKm: 4.381,
    roadWidth: 74,
    targetLapTime: 49.0,
    difficulty: 'PRO',
    characteristics: ['Monaco without Walls', 'Twisting Chicanes', 'High Downforce Rhythm'],
    start: { x: 1300, y: 1360, angle: Math.PI },
    points: [
      { x: 1300, y: 1360 },
      { x: 950, y: 1360 },
      { x: 620, y: 1360 },
      // Turn 1 downhill right
      { x: 440, y: 1320, kerbSide: 'right', speedGuide: 100 },
      // Turn 2 long downhill left
      { x: 400, y: 1200, kerbSide: 'left', speedGuide: 125 },
      // Turn 3 right
      { x: 500, y: 1120, kerbSide: 'right', speedGuide: 210 },
      // Turn 4 blind uphill crest
      { x: 670, y: 1050, kerbSide: 'left', speedGuide: 230 },
      // Turn 5 long carousel
      { x: 840, y: 990, kerbSide: 'right', speedGuide: 135 },
      // Chicane T6/T7
      { x: 870, y: 850, kerbSide: 'right', speedGuide: 95 },
      { x: 820, y: 740, kerbSide: 'left', speedGuide: 105 },
      // T8/T9 flowing section
      { x: 860, y: 620, kerbSide: 'left', speedGuide: 170 },
      { x: 980, y: 550, kerbSide: 'right', speedGuide: 190 },
      // Turn 11 fast right
      { x: 1140, y: 560, kerbSide: 'right', speedGuide: 230 },
      // Turn 12 90° right
      { x: 1320, y: 670, kerbSide: 'right', speedGuide: 120 },
      // Turn 13 180° left
      { x: 1450, y: 840, kerbSide: 'left', speedGuide: 110 },
      { x: 1440, y: 1040, kerbSide: 'left', speedGuide: 125 },
      // Turn 14 final corner onto main straight
      { x: 1540, y: 1220, kerbSide: 'right', speedGuide: 130 },
      { x: 1450, y: 1340, speedGuide: 240 }
    ],
    sectors: { s1EndIdx: 5, s2EndIdx: 12 },
    drsZone: { detectIdx: 15, startIdx: 16, endIdx: 2 },
    brakeMarkers: [{ x: 540, y: 1390, distance: '100m', angle: 0 }]
  },

  // 14. SPA-FRANCORCHAMPS (BELGIUM)
  {
    id: 'spa',
    name: 'Spa & Wellness Retreat',
    location: 'Stavelot, Belgium',
    countryCode: 'BE',
    flag: '🇧🇪',
    lengthKm: 7.004,
    roadWidth: 76,
    targetLapTime: 62.0,
    difficulty: 'PRO',
    characteristics: ['Eau Rouge & Raidillon', 'Kemmel Straight DRS', 'Pouhon Double-Apex', 'Bus Stop Chicane'],
    start: { x: 1700, y: 1480, angle: Math.PI },
    points: [
      { x: 1700, y: 1480 },
      { x: 1350, y: 1480 },
      { x: 1050, y: 1480 },
      { x: 860, y: 1450, kerbSide: 'right', speedGuide: 75 },
      { x: 770, y: 1350, kerbSide: 'right', speedGuide: 85 },
      { x: 870, y: 1230, kerbSide: 'left', speedGuide: 165 },
      { x: 1050, y: 1140, speedGuide: 260 },
      { x: 1240, y: 1020, kerbSide: 'left', speedGuide: 290 },
      { x: 1350, y: 880, kerbSide: 'right', speedGuide: 295 },
      { x: 1320, y: 730, kerbSide: 'left', speedGuide: 305 },
      { x: 1200, y: 550, speedGuide: 330 },
      { x: 1010, y: 400, speedGuide: 345 },
      { x: 800, y: 280, speedGuide: 355 },
      { x: 620, y: 230, kerbSide: 'right', speedGuide: 135 },
      { x: 490, y: 280, kerbSide: 'left', speedGuide: 140 },
      { x: 410, y: 390, kerbSide: 'right', speedGuide: 165 },
      { x: 330, y: 550, kerbSide: 'right', speedGuide: 105 },
      { x: 320, y: 710, kerbSide: 'left', speedGuide: 155 },
      { x: 390, y: 890, kerbSide: 'left', speedGuide: 250 },
      { x: 500, y: 1010, kerbSide: 'left', speedGuide: 265 },
      { x: 670, y: 980, kerbSide: 'right', speedGuide: 185 },
      { x: 870, y: 870, speedGuide: 270 },
      { x: 1150, y: 870, speedGuide: 300 },
      { x: 1480, y: 960, kerbSide: 'left', speedGuide: 310 },
      { x: 1780, y: 1080, speedGuide: 315 },
      { x: 1980, y: 1210, speedGuide: 310 },
      { x: 2060, y: 1320, kerbSide: 'right', speedGuide: 90 },
      { x: 1980, y: 1420, kerbSide: 'left', speedGuide: 105 },
      { x: 1860, y: 1480, kerbSide: 'right', speedGuide: 190 }
    ],
    sectors: { s1EndIdx: 12, s2EndIdx: 21 },
    drsZone: { detectIdx: 8, startIdx: 9, endIdx: 13 },
    brakeMarkers: [
      { x: 960, y: 1510, distance: '100m', angle: 0 },
      { x: 700, y: 250, distance: '100m', angle: -Math.PI / 6 },
      { x: 2050, y: 1250, distance: '100m', angle: Math.PI / 2 }
    ]
  },

  // 15. ZANDVOORT (NETHERLANDS)
  {
    id: 'zandvoort',
    name: 'Circuit Sandfort',
    location: 'Zandvoort, Netherlands',
    countryCode: 'NL',
    flag: '🇳🇱',
    lengthKm: 4.259,
    roadWidth: 74,
    targetLapTime: 46.0,
    difficulty: 'CHAMPION',
    characteristics: ['Tarzan Hairpin', 'Hugenholtz 19° Banking', 'Arie Luyendyk Banked Blast', 'Dune Rollercoaster'],
    start: { x: 1350, y: 1380, angle: Math.PI },
    points: [
      { x: 1350, y: 1380 },
      { x: 950, y: 1380 },
      { x: 620, y: 1380 },
      // Tarzan Bocht (T1 180° Hairpin)
      { x: 440, y: 1340, kerbSide: 'right', speedGuide: 95 },
      { x: 380, y: 1220, kerbSide: 'right', speedGuide: 110 },
      // Gerlach Bocht & Hugenholtz 19° Banked Corner
      { x: 460, y: 1120, speedGuide: 190 },
      { x: 580, y: 1040, kerbSide: 'left', speedGuide: 115 },
      { x: 590, y: 920, kerbSide: 'left', speedGuide: 140 },
      // Hunserug crest & Rob Slotemaker Bocht
      { x: 720, y: 850, speedGuide: 260 },
      { x: 880, y: 780, kerbSide: 'right', speedGuide: 240 },
      // Scheivlak blind high-speed downhill right
      { x: 1060, y: 740, kerbSide: 'right', speedGuide: 235 },
      // Masters Bocht
      { x: 1220, y: 790, kerbSide: 'right', speedGuide: 185 },
      // Bocht 9 & 10 hairpin
      { x: 1340, y: 910, kerbSide: 'left', speedGuide: 130 },
      { x: 1460, y: 960, kerbSide: 'left', speedGuide: 110 },
      // Hans Ernst Bocht chicane (T11/12)
      { x: 1600, y: 1060, speedGuide: 240 },
      { x: 1680, y: 1170, kerbSide: 'right', speedGuide: 95 },
      { x: 1740, y: 1250, kerbSide: 'left', speedGuide: 105 },
      // Arie Luyendyk Bocht 18° banked final sweeper (DRS active)
      { x: 1840, y: 1340, kerbSide: 'right', speedGuide: 255 },
      { x: 1620, y: 1380, speedGuide: 290 }
    ],
    sectors: { s1EndIdx: 5, s2EndIdx: 12 },
    drsZone: { detectIdx: 16, startIdx: 17, endIdx: 2 },
    brakeMarkers: [{ x: 540, y: 1410, distance: '100m', angle: 0 }]
  },

  // 16. MONZA (ITALY)
  {
    id: 'monza',
    name: 'Monza-rella Autodromo',
    location: 'Monza, Italy',
    countryCode: 'IT',
    flag: '🇮🇹',
    lengthKm: 5.793,
    roadWidth: 76,
    targetLapTime: 52.0,
    difficulty: 'PRO',
    characteristics: ['Temple of Speed', 'Rettifilo Chicane', 'Ascari Complex', 'Parabolica Sweeper'],
    start: { x: 1350, y: 1420, angle: Math.PI },
    points: [
      { x: 1350, y: 1420 },
      { x: 950, y: 1420 },
      { x: 650, y: 1420 },
      { x: 440, y: 1420 },
      { x: 310, y: 1400, kerbSide: 'left', speedGuide: 85 },
      { x: 260, y: 1310, kerbSide: 'right', speedGuide: 75 },
      { x: 320, y: 1220, kerbSide: 'left', speedGuide: 120 },
      { x: 420, y: 1100, speedGuide: 240 },
      { x: 540, y: 920, kerbSide: 'right', speedGuide: 270 },
      { x: 620, y: 720, kerbSide: 'right', speedGuide: 290 },
      { x: 640, y: 550, speedGuide: 305 },
      { x: 630, y: 390, kerbSide: 'left', speedGuide: 110 },
      { x: 670, y: 300, kerbSide: 'right', speedGuide: 130 },
      { x: 800, y: 250, kerbSide: 'right', speedGuide: 175 },
      { x: 960, y: 240, speedGuide: 210 },
      { x: 1100, y: 250, kerbSide: 'right', speedGuide: 180 },
      { x: 1260, y: 320, speedGuide: 230 },
      { x: 1480, y: 400, speedGuide: 290 },
      { x: 1740, y: 480, speedGuide: 325 },
      { x: 2000, y: 550, speedGuide: 340 },
      { x: 2140, y: 640, kerbSide: 'left', speedGuide: 175 },
      { x: 2210, y: 760, kerbSide: 'right', speedGuide: 200 },
      { x: 2150, y: 890, kerbSide: 'left', speedGuide: 230 },
      { x: 2150, y: 1080, speedGuide: 320 },
      { x: 2160, y: 1220, speedGuide: 300 },
      { x: 2180, y: 1340, kerbSide: 'right', speedGuide: 225 },
      { x: 2080, y: 1420, kerbSide: 'right', speedGuide: 220 },
      { x: 1880, y: 1420, kerbSide: 'left', speedGuide: 265 },
      { x: 1620, y: 1420, speedGuide: 310 }
    ],
    sectors: { s1EndIdx: 9, s2EndIdx: 19 },
    drsZone: { detectIdx: 26, startIdx: 27, endIdx: 3 },
    brakeMarkers: [
      { x: 550, y: 1480, distance: '150m', angle: 0 },
      { x: 440, y: 1480, distance: '100m', angle: 0 },
      { x: 360, y: 1480, distance: '50m', angle: 0 },
      { x: 2220, y: 1140, distance: '100m', angle: Math.PI / 2 }
    ]
  },

  // 17. BAKU (AZERBAIJAN)
  {
    id: 'baku',
    name: 'Baku to the Future',
    location: 'Baku, Azerbaijan',
    countryCode: 'AZ',
    flag: '🇦🇿',
    lengthKm: 6.003,
    roadWidth: 70,
    targetLapTime: 57.0,
    difficulty: 'EXTREME',
    characteristics: ['2.2km Longest Straight', 'Castle Section (7.6m Wide)', '90-Degree Street Turns'],
    start: { x: 1450, y: 1400, angle: Math.PI },
    points: [
      { x: 1450, y: 1400 },
      { x: 1000, y: 1400 },
      { x: 620, y: 1400 },
      // T1 90° left
      { x: 430, y: 1360, kerbSide: 'left', speedGuide: 105 },
      { x: 430, y: 1200, speedGuide: 210 },
      // T2 90° left
      { x: 430, y: 1060, kerbSide: 'left', speedGuide: 100 },
      // T3 90° right
      { x: 600, y: 1060, kerbSide: 'right', speedGuide: 105 },
      { x: 600, y: 890, speedGuide: 220 },
      // T4 90° left
      { x: 600, y: 760, kerbSide: 'left', speedGuide: 110 },
      // T5/T6 chicane
      { x: 740, y: 760, kerbSide: 'right', speedGuide: 125 },
      { x: 780, y: 640, kerbSide: 'left', speedGuide: 130 },
      // Old Castle Section T8-T11 (Extremely narrow!)
      { x: 880, y: 550, kerbSide: 'left', speedGuide: 80 },
      { x: 970, y: 530, kerbSide: 'right', speedGuide: 75 },
      { x: 1060, y: 560, kerbSide: 'left', speedGuide: 85 },
      // Downhill run T13-T15
      { x: 1180, y: 650, speedGuide: 220 },
      { x: 1290, y: 760, speedGuide: 250 },
      { x: 1410, y: 880, kerbSide: 'left', speedGuide: 110 },
      // Turn 16 onto the 2.2km flat-out straight
      { x: 1530, y: 920, kerbSide: 'left', speedGuide: 115 },
      // Flat-out sweepers T17-T20
      { x: 1670, y: 960, speedGuide: 280 },
      { x: 1850, y: 1050, speedGuide: 320 },
      { x: 2020, y: 1170, speedGuide: 345 },
      { x: 2150, y: 1320, speedGuide: 355 },
      { x: 1880, y: 1390, speedGuide: 350 },
      { x: 1650, y: 1400, speedGuide: 340 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 16, startIdx: 17, endIdx: 2 },
    brakeMarkers: [{ x: 530, y: 1430, distance: '100m', angle: 0 }]
  },

  // 18. MARINA BAY (SINGAPORE)
  {
    id: 'singapore',
    name: 'Marina Bay Sweat Circuit',
    location: 'Marina Bay, Singapore',
    countryCode: 'SG',
    flag: '🇸🇬',
    lengthKm: 4.940,
    roadWidth: 70,
    targetLapTime: 54.0,
    difficulty: 'EXTREME',
    characteristics: ['Original Night Race', 'Tropical Heat & Humidity', 'Bumpy Street Braking', 'New Fast Straight'],
    start: { x: 1400, y: 1400, angle: Math.PI },
    points: [
      { x: 1400, y: 1400 },
      { x: 1000, y: 1400 },
      { x: 680, y: 1400 },
      // Turn 1/2/3 Sheares complex
      { x: 480, y: 1360, kerbSide: 'left', speedGuide: 110 },
      { x: 420, y: 1250, kerbSide: 'right', speedGuide: 120 },
      { x: 490, y: 1160, kerbSide: 'left', speedGuide: 115 },
      // Republic Boulevard into Turn 5
      { x: 680, y: 1140, speedGuide: 240 },
      { x: 880, y: 1120, kerbSide: 'right', speedGuide: 125 },
      // Raffles Boulevard long straight into Turn 7
      { x: 1150, y: 1080, speedGuide: 290 },
      { x: 1420, y: 1040, speedGuide: 310 },
      { x: 1560, y: 970, kerbSide: 'left', speedGuide: 100 },
      // Stamford Road T8 & T9
      { x: 1520, y: 840, kerbSide: 'left', speedGuide: 110 },
      { x: 1420, y: 740, kerbSide: 'right', speedGuide: 125 },
      // Padang run to Anderson Bridge T13 Hairpin
      { x: 1280, y: 640, speedGuide: 240 },
      { x: 1120, y: 550, speedGuide: 250 },
      { x: 990, y: 480, kerbSide: 'left', speedGuide: 75 },
      // Esplanade Drive into Turn 14
      { x: 1110, y: 390, speedGuide: 260 },
      { x: 1320, y: 380, speedGuide: 280 },
      { x: 1490, y: 440, kerbSide: 'right', speedGuide: 95 },
      // New fast sector bypassing grandstands
      { x: 1680, y: 540, speedGuide: 285 },
      { x: 1860, y: 720, speedGuide: 290 },
      // Turn 16 & 17 final chicanes
      { x: 1940, y: 920, kerbSide: 'left', speedGuide: 120 },
      { x: 1950, y: 1120, speedGuide: 230 },
      { x: 1880, y: 1280, kerbSide: 'left', speedGuide: 130 },
      { x: 1720, y: 1360, kerbSide: 'right', speedGuide: 145 },
      { x: 1560, y: 1400, speedGuide: 240 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 7, startIdx: 8, endIdx: 10 },
    brakeMarkers: [{ x: 560, y: 1430, distance: '100m', angle: 0 }]
  },

  // 19. COTA (AUSTIN, USA)
  {
    id: 'austin',
    name: 'Circuit of the Bumpy Americas',
    location: 'Austin, Texas, USA',
    countryCode: 'US',
    flag: '🇺🇸',
    lengthKm: 5.513,
    roadWidth: 76,
    targetLapTime: 54.0,
    difficulty: 'PRO',
    characteristics: ['Turn 1 Steep Uphill Blind Crest', 'Maggotts-Inspired Esses', 'Multi-Apex Turn 16-18'],
    start: { x: 1400, y: 1420, angle: Math.PI },
    points: [
      { x: 1400, y: 1420 },
      { x: 950, y: 1420 },
      { x: 580, y: 1420 },
      // Steep uphill blind Turn 1 hairpin
      { x: 380, y: 1380, kerbSide: 'left', speedGuide: 80 },
      { x: 420, y: 1240, speedGuide: 170 },
      // High-speed Esses T3-T6
      { x: 540, y: 1140, kerbSide: 'right', speedGuide: 250 },
      { x: 640, y: 1020, kerbSide: 'left', speedGuide: 245 },
      { x: 740, y: 910, kerbSide: 'right', speedGuide: 230 },
      { x: 860, y: 820, kerbSide: 'left', speedGuide: 215 },
      // T8/T9 technical section
      { x: 1010, y: 770, speedGuide: 200 },
      { x: 1120, y: 710, kerbSide: 'left', speedGuide: 140 },
      // Turn 11 hairpin onto 1km back straight
      { x: 1180, y: 580, kerbSide: 'left', speedGuide: 80 },
      // Long DRS Back Straight
      { x: 1360, y: 540, speedGuide: 290 },
      { x: 1650, y: 510, speedGuide: 330 },
      { x: 1950, y: 490, speedGuide: 345 },
      // Turn 12 heavy braking
      { x: 2120, y: 570, kerbSide: 'left', speedGuide: 85 },
      // Stadium section T13-T15
      { x: 2080, y: 740, kerbSide: 'right', speedGuide: 120 },
      { x: 1990, y: 890, kerbSide: 'left', speedGuide: 110 },
      // Multi-apex carousel T16-T18
      { x: 1940, y: 1040, kerbSide: 'right', speedGuide: 220 },
      { x: 1970, y: 1190, kerbSide: 'right', speedGuide: 235 },
      // T19/T20 back to start
      { x: 1880, y: 1330, kerbSide: 'left', speedGuide: 140 },
      { x: 1720, y: 1390, kerbSide: 'left', speedGuide: 135 },
      { x: 1560, y: 1420, speedGuide: 240 }
    ],
    sectors: { s1EndIdx: 8, s2EndIdx: 15 },
    drsZone: { detectIdx: 11, startIdx: 12, endIdx: 15 },
    brakeMarkers: [{ x: 480, y: 1450, distance: '100m', angle: 0 }]
  },

  // 20. MEXICO CITY
  {
    id: 'mexico',
    name: 'Altitude Sickness Autódromo',
    location: 'Mexico City, Mexico',
    countryCode: 'MX',
    flag: '🇲🇽',
    lengthKm: 4.304,
    roadWidth: 76,
    targetLapTime: 47.0,
    difficulty: 'INTERMEDIATE',
    characteristics: ['2,200m Thin Air Altitude', '355km/h Main Straight', 'Foro Sol Stadium Arena'],
    start: { x: 1400, y: 1400, angle: Math.PI },
    points: [
      { x: 1400, y: 1400 },
      { x: 1000, y: 1400 },
      { x: 600, y: 1400 },
      // T1/T2/T3 chicane
      { x: 420, y: 1360, kerbSide: 'right', speedGuide: 110 },
      { x: 370, y: 1250, kerbSide: 'left', speedGuide: 120 },
      { x: 460, y: 1170, kerbSide: 'right', speedGuide: 140 },
      // Run to T4/T5/T6
      { x: 680, y: 1150, speedGuide: 280 },
      { x: 880, y: 1120, kerbSide: 'left', speedGuide: 115 },
      { x: 920, y: 1010, kerbSide: 'right', speedGuide: 125 },
      // High-speed Esses T7-T11
      { x: 1040, y: 920, kerbSide: 'right', speedGuide: 230 },
      { x: 1150, y: 830, kerbSide: 'left', speedGuide: 240 },
      { x: 1260, y: 740, kerbSide: 'right', speedGuide: 235 },
      { x: 1380, y: 650, kerbSide: 'left', speedGuide: 220 },
      // Foro Sol baseball stadium arena entrance
      { x: 1540, y: 580, speedGuide: 200 },
      { x: 1720, y: 580, kerbSide: 'right', speedGuide: 90 },
      { x: 1840, y: 670, kerbSide: 'left', speedGuide: 75 },
      { x: 1810, y: 820, kerbSide: 'right', speedGuide: 95 },
      // Peraltada exit onto 1.3km blast
      { x: 1840, y: 1010, kerbSide: 'right', speedGuide: 180 },
      { x: 1910, y: 1210, kerbSide: 'right', speedGuide: 245 },
      { x: 1780, y: 1360, speedGuide: 290 },
      { x: 1580, y: 1400, speedGuide: 320 }
    ],
    sectors: { s1EndIdx: 6, s2EndIdx: 13 },
    drsZone: { detectIdx: 19, startIdx: 20, endIdx: 2 },
    brakeMarkers: [{ x: 520, y: 1430, distance: '100m', angle: 0 }]
  },

  // 21. INTERLAGOS (BRAZIL)
  {
    id: 'interlagos',
    name: 'Interlaggos',
    location: 'São Paulo, Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    lengthKm: 4.309,
    roadWidth: 76,
    targetLapTime: 50.0,
    difficulty: 'PRO',
    characteristics: ['Downhill Senna S', 'Curva do Sol', 'Reta Oposta DRS', 'Bico de Pato'],
    start: { x: 1400, y: 1350, angle: Math.PI },
    points: [
      { x: 1400, y: 1350 },
      { x: 1050, y: 1350 },
      { x: 750, y: 1350 },
      { x: 570, y: 1320, kerbSide: 'left', speedGuide: 120 },
      { x: 480, y: 1220, kerbSide: 'right', speedGuide: 135 },
      { x: 450, y: 1080, kerbSide: 'left', speedGuide: 240 },
      { x: 510, y: 920, speedGuide: 270 },
      { x: 640, y: 780, speedGuide: 310 },
      { x: 860, y: 640, speedGuide: 330 },
      { x: 1100, y: 520, speedGuide: 340 },
      { x: 1260, y: 440, kerbSide: 'left', speedGuide: 160 },
      { x: 1390, y: 450, kerbSide: 'left', speedGuide: 180 },
      { x: 1530, y: 550, kerbSide: 'right', speedGuide: 220 },
      { x: 1620, y: 690, kerbSide: 'right', speedGuide: 215 },
      { x: 1580, y: 820, kerbSide: 'left', speedGuide: 110 },
      { x: 1650, y: 940, kerbSide: 'right', speedGuide: 75 },
      { x: 1540, y: 1050, kerbSide: 'left', speedGuide: 180 },
      { x: 1470, y: 1170, kerbSide: 'left', speedGuide: 130 },
      { x: 1520, y: 1280, speedGuide: 260 },
      { x: 1620, y: 1340, speedGuide: 290 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 6, startIdx: 7, endIdx: 10 },
    brakeMarkers: [
      { x: 680, y: 1380, distance: '100m', angle: 0 },
      { x: 1050, y: 550, distance: '100m', angle: -Math.PI / 6 }
    ]
  },

  // 22. LAS VEGAS
  {
    id: 'las_vegas',
    name: 'Las Vegas Strip Mall',
    location: 'Las Vegas, Nevada, USA',
    countryCode: 'US',
    flag: '🇺🇸',
    lengthKm: 6.201,
    roadWidth: 76,
    targetLapTime: 53.0,
    difficulty: 'PRO',
    characteristics: ['1.9km Las Vegas Boulevard Strip', 'Neon Night Spectacle', '350km/h Top Speed'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 950, y: 1400 },
      { x: 620, y: 1400 },
      // T1/T2 hairpin
      { x: 420, y: 1360, kerbSide: 'left', speedGuide: 90 },
      { x: 380, y: 1230, kerbSide: 'right', speedGuide: 120 },
      // Koval Lane run
      { x: 440, y: 1080, speedGuide: 280 },
      { x: 480, y: 880, speedGuide: 310 },
      // Sphere Complex T5-T9
      { x: 540, y: 720, kerbSide: 'right', speedGuide: 135 },
      { x: 680, y: 640, kerbSide: 'left', speedGuide: 120 },
      { x: 820, y: 610, kerbSide: 'right', speedGuide: 145 },
      { x: 940, y: 660, speedGuide: 210 },
      // Sands Avenue to Strip
      { x: 1100, y: 690, speedGuide: 270 },
      { x: 1280, y: 690, kerbSide: 'left', speedGuide: 130 },
      // The 1.9km Las Vegas Boulevard Strip
      { x: 1420, y: 650, speedGuide: 300 },
      { x: 1680, y: 580, speedGuide: 335 },
      { x: 1960, y: 500, speedGuide: 350 },
      { x: 2220, y: 420, speedGuide: 355 },
      // Turn 14 heavy braking chicane (Bellagio)
      { x: 2340, y: 510, kerbSide: 'left', speedGuide: 95 },
      { x: 2280, y: 660, kerbSide: 'right', speedGuide: 110 },
      // Harmon Avenue run back to pit straight
      { x: 2180, y: 860, speedGuide: 270 },
      { x: 2020, y: 1080, speedGuide: 290 },
      { x: 1840, y: 1280, kerbSide: 'left', speedGuide: 160 },
      { x: 1560, y: 1390, speedGuide: 250 }
    ],
    sectors: { s1EndIdx: 7, s2EndIdx: 15 },
    drsZone: { detectIdx: 13, startIdx: 14, endIdx: 17 },
    brakeMarkers: [{ x: 2180, y: 430, distance: '100m', angle: 0 }]
  },

  // 23. LUSAIL (QATAR)
  {
    id: 'lusail',
    name: 'Lose-a-Sail Circuit',
    location: 'Al Daayen, Qatar',
    countryCode: 'QA',
    flag: '🇶🇦',
    lengthKm: 5.419,
    roadWidth: 76,
    targetLapTime: 51.0,
    difficulty: 'CHAMPION',
    characteristics: ['Relentless High-G Sweepers', '1km Pit Straight DRS', 'Triple-Apex Turn 12-14'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 950, y: 1400 },
      { x: 600, y: 1400 },
      // Turn 1 right
      { x: 420, y: 1350, kerbSide: 'right', speedGuide: 130 },
      // T2 left
      { x: 400, y: 1220, kerbSide: 'left', speedGuide: 180 },
      // T4 & T5
      { x: 510, y: 1110, speedGuide: 220 },
      { x: 660, y: 1050, kerbSide: 'right', speedGuide: 190 },
      // Turn 6 hairpin
      { x: 790, y: 990, kerbSide: 'left', speedGuide: 105 },
      // High-speed sweepers T7-T10
      { x: 890, y: 850, kerbSide: 'right', speedGuide: 220 },
      { x: 980, y: 720, kerbSide: 'left', speedGuide: 235 },
      { x: 1100, y: 620, kerbSide: 'right', speedGuide: 245 },
      { x: 1240, y: 550, speedGuide: 260 },
      // Monster Triple-Apex Right T12/13/14
      { x: 1440, y: 540, kerbSide: 'right', speedGuide: 240 },
      { x: 1650, y: 620, kerbSide: 'right', speedGuide: 250 },
      { x: 1820, y: 760, kerbSide: 'right', speedGuide: 245 },
      // T15 & Turn 16 final corner
      { x: 1880, y: 950, speedGuide: 260 },
      { x: 1840, y: 1160, kerbSide: 'right', speedGuide: 150 },
      { x: 1720, y: 1330, kerbSide: 'right', speedGuide: 165 },
      { x: 1540, y: 1390, speedGuide: 280 }
    ],
    sectors: { s1EndIdx: 6, s2EndIdx: 12 },
    drsZone: { detectIdx: 16, startIdx: 17, endIdx: 2 },
    brakeMarkers: [{ x: 530, y: 1430, distance: '100m', angle: 0 }]
  },

  // 24. YAS MARINA (ABU DHABI)
  {
    id: 'yas_marina',
    name: 'Yas Queen Marina',
    location: 'Abu Dhabi, UAE',
    countryCode: 'AE',
    flag: '🇦🇪',
    lengthKm: 5.281,
    roadWidth: 76,
    targetLapTime: 52.0,
    difficulty: 'PRO',
    characteristics: ['Season Finale Twilight Race', '1.2km Back Straight', 'W Hotel Marina Complex'],
    start: { x: 1350, y: 1400, angle: Math.PI },
    points: [
      { x: 1350, y: 1400 },
      { x: 950, y: 1400 },
      { x: 620, y: 1400 },
      // Turn 1 90° left
      { x: 440, y: 1350, kerbSide: 'left', speedGuide: 140 },
      // T2/T3 sweepers
      { x: 440, y: 1210, speedGuide: 240 },
      { x: 520, y: 1080, speedGuide: 270 },
      // Turn 5 hairpin before straight
      { x: 620, y: 950, kerbSide: 'left', speedGuide: 80 },
      // 1.2km Back Straight (DRS 1)
      { x: 800, y: 910, speedGuide: 280 },
      { x: 1100, y: 860, speedGuide: 320 },
      { x: 1420, y: 810, speedGuide: 340 },
      // Turn 6/7 chicane
      { x: 1620, y: 770, kerbSide: 'left', speedGuide: 90 },
      { x: 1690, y: 860, kerbSide: 'right', speedGuide: 105 },
      // Second straight (DRS 2)
      { x: 1760, y: 720, speedGuide: 280 },
      { x: 1880, y: 550, speedGuide: 320 },
      // Turn 9 banked sweeper
      { x: 2020, y: 440, kerbSide: 'left', speedGuide: 185 },
      { x: 2150, y: 560, kerbSide: 'left', speedGuide: 195 },
      // Marina hotel section T12-T14
      { x: 2110, y: 760, speedGuide: 230 },
      { x: 2020, y: 960, kerbSide: 'right', speedGuide: 135 },
      { x: 1940, y: 1120, kerbSide: 'left', speedGuide: 120 },
      // Turn 15 & 16 onto main straight
      { x: 1840, y: 1280, kerbSide: 'right', speedGuide: 145 },
      { x: 1710, y: 1370, kerbSide: 'right', speedGuide: 160 },
      { x: 1540, y: 1400, speedGuide: 260 }
    ],
    sectors: { s1EndIdx: 6, s2EndIdx: 13 },
    drsZone: { detectIdx: 6, startIdx: 7, endIdx: 10 },
    brakeMarkers: [{ x: 1520, y: 800, distance: '100m', angle: 0 }]
  }
];
