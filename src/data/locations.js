/* Shared parlour locations and opening hours. */
export const HOURS = {
  weekday: { open: 12, close: 23, label: '12 PM – 11 PM' },
  weekend: { open: 11, close: 24, label: '11 AM – 12 AM' },
};

export const LOCATIONS = [
  { city: 'Hyderabad', name: 'Jubilee Hills', address: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad 500033', exclusive: 'Irani Chai & Osmania' },
  { city: 'Bengaluru', name: 'Indiranagar', address: '812, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru 560008', exclusive: 'Filter Coffee Fudge' },
  { city: 'Mumbai', name: 'Bandra West', address: '17, Chapel Road, Ranwar Village, Bandra West, Mumbai 400050', exclusive: 'Chikki Crunch' },
];

export const FLAGSHIP = LOCATIONS[0];
