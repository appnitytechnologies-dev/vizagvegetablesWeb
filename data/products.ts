export interface Product {
  id: string; name: string; te: string; emoji: string;
  cat: string; price: number; orig: number; weight: string;
  eta: string; discount: number; tags: string[]; description: string;
}

export const products: Product[] = [
  { id: '1', name: 'Fresh Tomatoes',   te: 'టమాటో',      emoji: '🍅', cat: 'vegetables', price: 32,  orig: 40,  weight: '1kg',    eta: '45 min', discount: 20, tags: ['Farm Fresh', 'Seasonal'],     description: 'Farm fresh tomatoes sourced directly from Rythu Bazar. Rich in lycopene and antioxidants. Perfect for curries, salads, and chutneys.' },
  { id: '2', name: 'Onion',            te: 'ఉల్లిపాయ',   emoji: '🧅', cat: 'vegetables', price: 28,  orig: 35,  weight: '1kg',    eta: '45 min', discount: 20, tags: ['Farm Fresh'],                  description: 'Fresh onions from local farms. Essential for every Indian kitchen — adds depth and flavour to all dishes.' },
  { id: '3', name: 'Green Capsicum',   te: 'క్యాప్సికం',  emoji: '🫑', cat: 'vegetables', price: 55,  orig: 65,  weight: '500g',   eta: '45 min', discount: 15, tags: ['Farm Fresh', 'Low Calorie'],  description: 'Crunchy green capsicums great for stir-fries, salads, and stuffed dishes. Rich in Vitamin C.' },
  { id: '4', name: 'Curry Leaves',     te: 'కరివేపాకు',  emoji: '🌿', cat: 'leafy',      price: 10,  orig: 15,  weight: '1 bunch',eta: '45 min', discount: 33, tags: ['Aromatic', 'Fresh'],          description: 'Freshly plucked curry leaves — a staple in South Indian cooking. Adds incredible aroma to dals, curries, and chutneys.' },
  { id: '5', name: 'Mixed Veggie Box', te: 'కూరగాయల పెట్టె',emoji: '🥗',cat: 'combos',  price: 120, orig: 150, weight: '2kg',    eta: '45 min', discount: 20, tags: ['Value Pack', 'Farm Fresh'],  description: 'A curated box of seasonal vegetables — tomato, onion, capsicum, brinjal, and more. Best value for daily cooking.' },
  { id: '6', name: 'Banana Bunch',     te: 'అరటిపండు',   emoji: '🍌', cat: 'fruits',     price: 60,  orig: 80,  weight: '1 doz',  eta: '45 min', discount: 25, tags: ['Ripe', 'Sweet'],             description: 'Sweet Robusta bananas — perfect for breakfast, smoothies, or as a healthy snack. Packed with potassium.' },
  { id: '7', name: 'Brinjal',          te: 'వంకాయ',      emoji: '🍆', cat: 'vegetables', price: 22,  orig: 30,  weight: '500g',   eta: '45 min', discount: 27, tags: ['Farm Fresh'],                 description: 'Tender brinjals ideal for curries, bharwa baingan, and sambar. Sourced fresh every morning.' },
  { id: '8', name: 'Coriander',        te: 'కొత్తిమీర',  emoji: '🌱', cat: 'leafy',      price: 10,  orig: 15,  weight: '1 bunch',eta: '45 min', discount: 33, tags: ['Aromatic', 'Fresh'],          description: 'Fresh coriander leaves — the finishing touch on every dish. Great for chutneys, garnishing, and raita.' },
];
