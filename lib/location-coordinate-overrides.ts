import { LOCATION_COORDINATES as GEOCODED } from '@/lib/location-coordinates'

/**
 * Hand-entered [latitude, longitude] for locations OpenStreetMap could not geocode.
 * Building wings/additions reuse their main building. Edit these freely to refine accuracy;
 * they take precedence over the generated file and survive re-running scripts/geocode.mjs.
 */
const MANUAL: Record<string, [number, number]> = {
  'north-barbara-mcclintock-hall': [42.4563, -76.4803],
  'north-kay-bauer-hall': [42.4538, -76.477],
  'north-noyes-lodge': [42.4517, -76.4787],
  'central-boyce-thompson-institute-for-plant-research': [42.4482, -76.4687],
  'central-bruckner-hall': [42.4479, -76.4685],
  'central-cornell-ann-s-bowers-college-of-computing-and-information-science': [42.4446, -76.4818],
  'central-cornell-health-addition': GEOCODED['central-cornell-health'],
  'central-ives-hall-east': GEOCODED['central-ives-hall'],
  'central-ives-hall-faculty-wing': GEOCODED['central-ives-hall'],
  'central-ives-hall-west': GEOCODED['central-ives-hall'],
  'central-lincoln-hall-east-avenue-addition': GEOCODED['central-lincoln-hall'],
  'central-mann-library-addition': [42.4488, -76.4763],
  'central-mann-library-building': [42.4488, -76.4763],
  'central-martha-van-rensselaer-hall-west-wing': GEOCODED['central-martha-van-rensselaer-hall'],
  'central-myron-taylor-hall-jane-foster-library-addition': GEOCODED['central-myron-taylor-hall'],
  'central-plant-science-building-and-greenhouses': [42.4486, -76.4788],
  'central-post-kenneth-laboratory': [42.4487, -76.472],
  'central-sage-hall-addition': GEOCODED['central-sage-hall'],
  'central-sibley-dome': [42.4511, -76.4838],
  'central-sibley-east': [42.4511, -76.4834],
  'central-sibley-west': [42.4511, -76.4842],
  'central-stocking-hall-east-addition': [42.4462, -76.4705],
  'central-stocking-hall-west': [42.4462, -76.4713],
  'central-veterinary-medical-center': [42.4478, -76.4655],
  'central-veterinary-research-tower': [42.4472, -76.4669],
}

export const ALL_COORDINATES: Record<string, [number, number]> = { ...GEOCODED, ...MANUAL }
