export type Campus = 'North' | 'Central'

export type Location = {
  id: string
  name: string
  campus: Campus
  /** Extra search terms: nicknames, abbreviations, alternate spellings. */
  aliases: string[]
}

/** Display order of campus groups in the dropdown. */
export const CAMPUSES: Campus[] = ['North', 'Central']

function slugify(value: string) {
  return normalize(value).replace(/\s+/g, '-')
}

/** Lowercase, strip accents (e.g. "Ganędagǫ:" -> "ganedago") and punctuation. */
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function place(name: string, campus: Campus, aliases: string[] = []): Location {
  return { id: `${campus.toLowerCase()}-${slugify(name)}`, name, campus, aliases }
}

/**
 * The set list of searchable locations.
 * Add, remove, or rename entries here; the home screen search reads directly from this array.
 * Ordering here doesn't matter: results are sorted alphabetically within each campus.
 */
export const LOCATIONS: Location[] = [
  // North Campus
  place('Appel Commons', 'North', ['Appel']),
  place('Balch Hall', 'North'),
  place('Barbara McClintock Hall', 'North', ['McClintock']),
  place('Clara Dickson Hall', 'North', ['Dickson']),
  place('Fuertes Observatory', 'North'),
  place('Ganędagǫ: Hall', 'North', ['Ganedago']),
  place('Helen Newman Hall', 'North', ['Helen Newman', 'Newman Gym']),
  place('High Rise 5', 'North', ['HR5', 'Highrise 5']),
  place('Hu Shih Hall', 'North', ['Hu Shih']),
  place('Jameson (George) Hall (High Rise 1)', 'North', ['HR1', 'Highrise 1', 'George Jameson']),
  place('Just About Music (JAM), Low Rise 9', 'North', ['JAM', 'LR9', 'Lowrise 9']),
  place('Kay-Bauer Hall', 'North', ['Kay', 'Bauer', 'Kay Bauer']),
  place('Low Rise 6', 'North', ['LR6', 'Lowrise 6']),
  place('Low Rise 7', 'North', ['LR7', 'Lowrise 7']),
  place('Mary Donlon Hall', 'North', ['Donlon']),
  place('Mews Hall', 'North'),
  place('Noyes Lodge', 'North', ['Noyes']),
  place('Risley Hall', 'North', ['Risley']),
  place('Robert Purcell Community Center', 'North', ['RPCC', 'RPC', 'Purcell']),
  place('Ruth Bader Ginsburg Hall', 'North', ['RBG', 'Ginsburg']),
  place('Toni Morrison Hall', 'North', ['Morrison', 'Toni Morrison']),
  place('Ujamaa (Low Rise 10)', 'North', ['LR10', 'Lowrise 10']),

  // Central Campus
  place('Andrew Dickson White House', 'Central', ['A.D. White House', 'AD White']),
  place('Anabel Taylor Hall', 'Central', ['ATH']),
  place('Atkinson Hall', 'Central'),
  place('Bailey Hall', 'Central'),
  place('Baker Laboratory', 'Central', ['Baker Lab']),
  place('Bard Hall', 'Central'),
  place('Barnes Hall', 'Central'),
  place('Bartels Hall', 'Central'),
  place('Barton Hall', 'Central'),
  place('Beebe Hall', 'Central'),
  place('Big Red Barn', 'Central'),
  place('Biotechnology Building', 'Central', ['Biotech']),
  place('Boyce Thompson Institute for Plant Research', 'Central', ['BTI']),
  place('Bradfield Hall', 'Central'),
  place('Bruckner Hall', 'Central'),
  place('Caldwell Hall', 'Central'),
  place('CALS Surge Facility', 'Central', ['Surge']),
  place('Carpenter Hall', 'Central'),
  place('Clark Hall', 'Central'),
  place('Computing and Communications Center', 'Central', ['CCC']),
  place('Comstock Hall', 'Central'),
  place('Cornell Ann S. Bowers College of Computing and Information Science', 'Central', [
    'Bowers',
    'Bowers CIS',
    'CIS',
  ]),
  place('Cornell Health', 'Central', ['Gannett']),
  place('Cornell Health addition', 'Central', ['Gannett']),
  place('Cornell Store', 'Central', ['Campus Store', 'Bookstore']),
  place('Corson-Mudd Hall', 'Central', ['Corson', 'Mudd', 'Corson Mudd']),
  place('Day Hall', 'Central'),
  place('Dolgen Hall ("ILR Extension Building")', 'Central', ['ILR']),
  place('Duffield Hall', 'Central'),
  place('East Campus Research Facility', 'Central', ['ECRF']),
  place('Emerson Hall', 'Central'),
  place('Fernow Hall', 'Central'),
  place('Fischell Band Center', 'Central', ['Band Center']),
  place('Foundry, The', 'Central', ['The Foundry']),
  place('Friedman Wrestling Center', 'Central', ['Wrestling']),
  place('Gates (Bill & Melinda) Hall', 'Central', ['Gates Hall', 'Bill and Melinda Gates']),
  place('Goldwin Smith Hall', 'Central', ['GSH', 'Goldwin']),
  place('Grumman Hall', 'Central'),
  place('Grumman Squash Courts', 'Central', ['Squash']),
  place('Ho Plaza', 'Central'),
  place('Hollister Hall', 'Central'),
  place('Hughes Hall', 'Central'),
  place('Human Ecology Building', 'Central', ['HEB', 'Hum Ec', 'HumEc']),
  place('Intercultural Center', 'Central'),
  place('Ives Hall', 'Central'),
  place('Ives Hall East', 'Central'),
  place('Ives Hall Faculty Wing', 'Central'),
  place('Ives Hall West', 'Central'),
  place('Johnson Museum of Art', 'Central', ['Herbert F. Johnson', 'Art Museum', 'Johnson Museum']),
  place('Kennedy Hall', 'Central'),
  place('Kimball Hall', 'Central'),
  place('King-Shaw Hall ("ILR Conference Center")', 'Central', ['King Shaw', 'ILR']),
  place('Kinzelberg Hall', 'Central'),
  place('Klarman Hall', 'Central'),
  place('Kroch Library', 'Central'),
  place('Lincoln Hall', 'Central'),
  place('Lincoln Hall East Avenue addition', 'Central'),
  place('Livestock Pavilion', 'Central'),
  place('Lynah Rink', 'Central', ['Lynah', 'Hockey']),
  place('Malott Hall', 'Central'),
  place('Mann Library addition', 'Central', ['Mann']),
  place('Mann Library building', 'Central', ['Mann']),
  place('Martha Van Rensselaer Hall', 'Central', ['MVR']),
  place('Martha Van Rensselaer Hall West Wing', 'Central', ['MVR']),
  place('McGraw Hall', 'Central'),
  place('McGraw Tower (University Chimes)', 'Central', ['Clocktower', 'Clock Tower', 'Chimes']),
  place('Milstein Hall', 'Central'),
  place('Morrill Hall', 'Central'),
  place('Morrison Hall', 'Central'),
  place('Myron Taylor Hall', 'Central', ['Law School']),
  place('Myron Taylor Hall Jane Foster Library Addition', 'Central', ['Jane Foster', 'Law Library']),
  place('Nevin (Brian C.) Welcome Center', 'Central', ['Nevin', 'Welcome Center']),
  place('Newman (Floyd R.) Laboratory', 'Central', ['Newman Lab', 'Floyd Newman']),
  place('Olin Chemistry Research Laboratory', 'Central', ['Olin Chem']),
  place('Olin Hall', 'Central'),
  place('Olin Library', 'Central'),
  place('Phillips Hall', 'Central'),
  place('Physical Sciences Building', 'Central', ['PSB']),
  place('Plant Science Building and Greenhouses', 'Central', ['Plant Sci', 'Greenhouse']),
  place('Post (Kenneth) Laboratory', 'Central', ['Post Lab', 'Kenneth Post']),
  place('Rand Hall', 'Central'),
  place('Rhodes (Frank H.T.) Hall', 'Central', ['Rhodes Hall', 'Frank Rhodes']),
  place('Rice Hall', 'Central'),
  place('Riley-Robb Hall', 'Central', ['Riley Robb']),
  place('Roberts Hall', 'Central'),
  place('Rockefeller Hall', 'Central', ['Rock']),
  place('Sage Chapel', 'Central'),
  place('Sage Hall', 'Central', ['Johnson School']),
  place('Sage Hall Addition', 'Central'),
  place('Savage Hall', 'Central'),
  place('Schoellkopf Crescent', 'Central', ['Schoellkopf Field']),
  place('Schoellkopf House', 'Central'),
  place('Schoellkopf Memorial Hall', 'Central'),
  place('Schurman Hall', 'Central'),
  place('Sibley Dome', 'Central', ['Sibley']),
  place('Sibley East', 'Central', ['Sibley']),
  place('Sibley West', 'Central', ['Sibley']),
  place('Snee Hall', 'Central'),
  place('Space Sciences Building', 'Central'),
  place('Statler Hall', 'Central', ['Hotel School']),
  place('Statler Hotel', 'Central'),
  place('Stimson Hall', 'Central'),
  place('Stocking Hall East Addition', 'Central', ['Stocking', 'Dairy Bar']),
  place('Stocking Hall West', 'Central', ['Stocking']),
  place('Teagle Hall', 'Central'),
  place('Thurston Hall', 'Central'),
  place('Tjaden Hall', 'Central'),
  place('Upson Hall', 'Central'),
  place('Uris Hall', 'Central'),
  place('Uris Library', 'Central', ['A.D. White Library']),
  place('Veterinary Medical Center', 'Central', ['Vet School', 'Vet Med']),
  place('Veterinary Research Tower', 'Central', ['Vet Tower']),
  place('Ward Lab', 'Central', ['Ward Laboratory']),
  place('Warren Hall', 'Central'),
  place('Weill Hall', 'Central'),
  place('White Hall', 'Central'),
  place('Willard Straight Hall', 'Central', ['WSH', 'The Straight', 'Straight']),
  place('Wilson Synchrotron Laboratory', 'Central', ['Wilson Lab', 'CHESS']),
  place('Wing Hall', 'Central'),
]

function searchWords(loc: Location) {
  return normalize([loc.name, ...loc.aliases].join(' ')).split(' ')
}

/**
 * Every word in the query must be the start of some word in the place's name or aliases,
 * so "bauer" finds Kay-Bauer Hall, "commons" finds Appel Commons, and "low ri" finds Low Rises.
 * Results are grouped by campus and sorted alphabetically within each group.
 */
export function searchLocations(query: string, list: Location[] = LOCATIONS) {
  const terms = normalize(query).split(' ').filter(Boolean)
  const matches = terms.length
    ? list.filter((loc) => {
        const words = searchWords(loc)
        return terms.every((term) => words.some((word) => word.startsWith(term)))
      })
    : list

  return [...matches].sort(
    (a, b) =>
      CAMPUSES.indexOf(a.campus) - CAMPUSES.indexOf(b.campus) ||
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),
  )
}
