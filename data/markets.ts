export interface Market {
  id:      string;
  name:    string;
  area:    string;
  km:      string;
  opens:   string;
  vendors: number;
  open:    boolean;
  mapUrl:  string;
}

export interface WeeklyShandha {
  day:      string;
  name:     string;
  location: string;
}

const hour = new Date().getHours();
const isOpen = (openH: number, closeH: number) => hour >= openH && hour < closeH;

export const markets: Market[] = [
  {
    id:      'gajuwaka',
    name:    'Gajuwaka Rythu Bazar',
    area:    'Gajuwaka, Visakhapatnam',
    km:      '0.5',
    opens:   '6 AM – 1 PM',
    vendors: 120,
    open:    isOpen(6, 13),
    mapUrl:  'https://maps.google.com/?q=Gajuwaka+Rythu+Bazar+Visakhapatnam',
  },
  {
    id:      'gopalapatnam',
    name:    'Gopalapatnam Rythu Bazar',
    area:    'Gopalapatnam, Visakhapatnam',
    km:      '8',
    opens:   '6 AM – 1 PM',
    vendors: 95,
    open:    isOpen(6, 13),
    mapUrl:  'https://maps.google.com/?q=Gopalapatnam+Rythu+Bazar+Visakhapatnam',
  },
  {
    id:      'mvp',
    name:    'MVP Colony Rythu Bazar',
    area:    'MVP Colony, Visakhapatnam',
    km:      '12',
    opens:   '6 AM – 1 PM',
    vendors: 110,
    open:    isOpen(6, 13),
    mapUrl:  'https://maps.google.com/?q=MVP+Colony+Rythu+Bazar+Visakhapatnam',
  },
  {
    id:      'pendurthi',
    name:    'Pendurthi Rythu Bazar',
    area:    'Pendurthi, Visakhapatnam',
    km:      '18',
    opens:   '6 AM – 12 PM',
    vendors: 75,
    open:    isOpen(6, 12),
    mapUrl:  'https://maps.google.com/?q=Pendurthi+Rythu+Bazar+Visakhapatnam',
  },
];

export const weeklyShandhas: WeeklyShandha[] = [
  { day: 'Mon', name: 'Kommadi Shandha',     location: 'Kommadi Junction'          },
  { day: 'Tue', name: 'Madhurawada Shandha', location: 'Madhurawada Bus Stop'      },
  { day: 'Wed', name: 'Bheemunipatnam',      location: 'Beach Road, Bhimunipatnam' },
  { day: 'Thu', name: 'Anakapalli Shandha',  location: 'Anakapalli Town Centre'    },
  { day: 'Fri', name: 'Pendurthi Shandha',   location: 'Pendurthi Main Road'       },
  { day: 'Sat', name: 'Pedagantyada',        location: 'Pedagantyada Circle'       },
  { day: 'Sun', name: 'Rushikonda Shandha',  location: 'Rushikonda Beach Road'     },
];
