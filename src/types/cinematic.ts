/**
 * Cinematic Video Sequence Types
 * 13 Commercial Shots mapped to scroll scrub progress
 */

export interface VideoShotDescriptor {
  shotNumber: number;
  label: string;
  sublabel: string;
  scrollRange: [number, number]; // [start progress 0..1, end progress 0..1]
  description: string;
}

export const CINEMATIC_SHOTS: VideoShotDescriptor[] = [
  {
    shotNumber: 1,
    label: 'SHOT 01',
    sublabel: 'ATMOSPHERIC KITCHEN',
    scrollRange: [0.0, 0.08],
    description: 'Clean premium food scene, dark stone counter, warm ambient lighting.',
  },
  {
    shotNumber: 2,
    label: 'SHOT 02',
    sublabel: 'THE CAST IRON PAN',
    scrollRange: [0.08, 0.16],
    description: 'A heavy seasoned cast-iron frying pan becomes the main visual focus.',
  },
  {
    shotNumber: 3,
    label: 'SHOT 03',
    sublabel: 'SMALL CHOPS INGRESS',
    scrollRange: [0.16, 0.25],
    description: 'Nigerian small-chop snacks (chinchin, puff-puff, samosa, spring rolls) enter.',
  },
  {
    shotNumber: 4,
    label: 'SHOT 04',
    sublabel: 'CRUCIBLE GATHERING',
    scrollRange: [0.25, 0.33],
    description: 'The snacks gather inside the sizzling frying pan basin.',
  },
  {
    shotNumber: 5,
    label: 'SHOT 05',
    sublabel: 'THE CHEF’S TOSS',
    scrollRange: [0.33, 0.41],
    description: 'The frying pan suddenly tosses the small chops upward with dynamic energy.',
  },
  {
    shotNumber: 6,
    label: 'SHOT 06',
    sublabel: 'AIRBORNE SPLASH',
    scrollRange: [0.41, 0.49],
    description: 'The snacks splash and launch dramatically into mid-air with golden oil glints.',
  },
  {
    shotNumber: 7,
    label: 'SHOT 07',
    sublabel: 'CAMERA TRACKING',
    scrollRange: [0.49, 0.57],
    description: 'The camera follows the flying snacks through dramatic culinary depth of field.',
  },
  {
    shotNumber: 8,
    label: 'SHOT 08',
    sublabel: 'SOLO FLIGHT HEROES',
    scrollRange: [0.57, 0.65],
    description: 'Individual chinchin, samosa, puff-puff and spring rolls soar across the frame.',
  },
  {
    shotNumber: 9,
    label: 'SHOT 09',
    sublabel: 'LUXURY PACKAGING ARRIVAL',
    scrollRange: [0.65, 0.73],
    description: 'A premium matte black and gold embossed takeaway container appears.',
  },
  {
    shotNumber: 10,
    label: 'SHOT 10',
    sublabel: 'PRECISION ENTRY',
    scrollRange: [0.73, 0.81],
    description: 'The airborne small chops glide smoothly into the open takeaway box.',
  },
  {
    shotNumber: 11,
    label: 'SHOT 11',
    sublabel: 'BOX ABUNDANCE',
    scrollRange: [0.81, 0.89],
    description: 'The container becomes generously filled with golden artisanal Nigerian delicacies.',
  },
  {
    shotNumber: 12,
    label: 'SHOT 12',
    sublabel: 'THE GOLD SEAL',
    scrollRange: [0.89, 0.95],
    description: 'The container lid closes and seals firmly with bespoke Atelier insignia.',
  },
  {
    shotNumber: 13,
    label: 'SHOT 13',
    sublabel: 'PACKAGED MASTERPIECE',
    scrollRange: [0.95, 1.0],
    description: 'Final cinematic commercial hero shot of the sealed luxury food package.',
  },
];
