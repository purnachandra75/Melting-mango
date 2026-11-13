/* ------------------------------------------------------------------
   Menu data — sourced from the Melting Mango flavour sheet.
   Rates are per scoop. Change CURRENCY to switch the symbol site-wide.
   ------------------------------------------------------------------ */

export const CURRENCY = '$';

export const AVAILABILITY = ['All', 'Normal', 'Seasonal'];

export const SCOOP_SIZES = [
  { id: 'one', label: 'One', count: 1 },
  { id: 'two', label: 'Two', count: 2 },
  { id: 'three', label: 'Three', count: 3 },
];

export const CONTAINERS = [
  { id: 'waffle', label: 'Waffle Cone', note: 'Golden & crisp, rolled in-house' },
  { id: 'cup', label: 'Cup', note: 'Compostable, easy to share' },
  { id: 'sugar', label: 'Sugar Cone', note: 'Classic, light & crunchy' },
];

export const flavors = [
  {
    id: 'mango',
    name: 'Mango',
    availability: 'Normal',
    price: 5,
    notes: 'Alphonso mango · fresh cream · sea salt',
    description:
      'Our namesake. Hand-pulped Alphonso mangoes folded into a slow-churned cream base with a whisper of sea salt. Bright, lush and impossibly smooth.',
    tags: ['House signature', 'Egg-free'],
    color: '#F6B93B',
    topping: 'mango',
    vessel: 'waffle',
    tint: '#FFF3C4',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    availability: 'Normal',
    price: 5,
    notes: 'Dark cacao · cocoa nib · vanilla',
    description:
      'Deep, fudgy and only just sweet. Made with real dark cacao and finished with crunchy cocoa nibs for the serious chocoholic.',
    tags: ['Gluten-free'],
    color: '#5B3A2E',
    topping: 'cherry',
    vessel: 'cup',
    tint: '#ECECEE',
  },
  {
    id: 'pista',
    name: 'Pista',
    availability: 'Normal',
    price: 5,
    notes: 'Roasted pistachio · cardamom',
    description:
      'Stone-ground roasted pistachios with a gentle lift of green cardamom. Nutty, fragrant and quietly elegant.',
    tags: ['Contains nuts'],
    color: '#BFD39A',
    topping: 'pistachio',
    vessel: 'sugar',
    tint: '#F6F6F7',
  },
  {
    id: 'chickoo',
    name: 'Chickoo',
    availability: 'Seasonal',
    price: 6,
    notes: 'Ripe sapota · jaggery · cream',
    description:
      'A seasonal favourite. Sun-ripened chickoo (sapota) with malty, caramel notes, sweetened with a touch of jaggery. Here only while the harvest lasts.',
    tags: ['Seasonal', 'Limited batch'],
    color: '#C49A6C',
    topping: 'leaf',
    vessel: 'waffle',
    tint: '#FFF6D6',
  },
  {
    id: 'banana-split',
    name: 'Banana Split',
    availability: 'Normal',
    price: 8,
    notes: 'Banana cream · fudge ripple · cherry',
    description:
      'The parlour classic, reimagined as a single scoop — caramelised banana cream rippled with hot fudge and crowned with a cherry.',
    tags: ['Parlour classic'],
    color: '#F3DE8A',
    topping: 'cherry',
    vessel: 'cup',
    tint: '#F6F6F7',
  },
];

/* ------------------------------------------------------------------
   Reward programmes — sourced from the Reward Programs sheet.
   ------------------------------------------------------------------ */

export const REWARD_RULES = ['Enrollment', 'Reward', 'Qualification', 'Limit', 'Expiration', 'Stacking'];

export const REWARDS = [
  {
    id: 'founding-50',
    numeral: 'I',
    name: 'Founding 50',
    tagline: 'For our first fifty guests',
    ribbon: 'Opening day only',
    highlight: 'A free scoop every week',
    rules: {
      Enrollment: 'First 50 verified eligible customers on opening day',
      Reward: '1 free single scoop per week',
      Qualification: 'A qualifying paid purchase on each redemption visit',
      Limit: '12 weekly rewards',
      Expiration: 'Unused weekly rewards expire',
      Stacking: 'Only one free scoop reward per transaction',
    },
  },
  {
    id: 'flavor-passport',
    numeral: 'II',
    name: 'Flavor Passport',
    tagline: 'Taste your way around the menu',
    highlight: 'Collect 6 stamps, earn a scoop',
    stamps: 6,
    rules: {
      Enrollment: 'Any enrolled customer',
      Reward: '1 free single scoop',
      Qualification: 'Purchase 6 distinct flavours',
      Limit: 'One reward per completed cycle',
      Expiration: 'Progress resets after 12 months of account inactivity',
      Stacking: 'Only one free scoop reward per transaction',
    },
  },
  {
    id: 'mango-points',
    numeral: 'III',
    name: 'Mango Points',
    tagline: 'Every visit adds up',
    highlight: 'Spend points on any regular item',
    rules: {
      Enrollment: 'Any enrolled customer',
      Reward: '1 free single scoop or any regular item of your choice',
      Qualification: 'Earn points with every purchase',
      Limit: 'Based on your points balance',
      Expiration: 'Points do not expire',
      Stacking: 'Only one free scoop reward per transaction',
    },
  },
];

export const formatPrice = (n) =>
  `${CURRENCY}${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const flavorById = (id) => flavors.find((f) => f.id === id);
export const containerById = (id) => CONTAINERS.find((c) => c.id === id);
