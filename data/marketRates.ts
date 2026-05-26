export interface MarketRate {
  id: string; emoji: string; name: string; te: string;
  cat: string; today: number; prev: number; chg: number; unit: string;
}

export const marketRates: MarketRate[] = [
  { id: '1',  emoji: '🍅', name: 'Tomato',       te: 'టమాటో',        cat: 'vegetables', today: 18, prev: 22, chg: -4,  unit: 'kg'  },
  { id: '2',  emoji: '🧅', name: 'Onion',        te: 'ఉల్లిపాయ',    cat: 'vegetables', today: 35, prev: 30, chg:  5,  unit: 'kg'  },
  { id: '3',  emoji: '🥔', name: 'Potato',       te: 'బంగాళదుంప',   cat: 'vegetables', today: 28, prev: 28, chg:  0,  unit: 'kg'  },
  { id: '4',  emoji: '🍆', name: 'Brinjal',      te: 'వంకాయ',       cat: 'vegetables', today: 22, prev: 25, chg: -3,  unit: 'kg'  },
  { id: '5',  emoji: '🫑', name: 'Capsicum',     te: 'క్యాప్సికం',  cat: 'vegetables', today: 60, prev: 55, chg:  5,  unit: 'kg'  },
  { id: '6',  emoji: '🥕', name: 'Carrot',       te: 'క్యారెట్',    cat: 'vegetables', today: 28, prev: 32, chg: -4,  unit: 'kg'  },
  { id: '7',  emoji: '🥦', name: 'Broccoli',     te: 'బ్రోకలీ',     cat: 'vegetables', today: 80, prev: 75, chg:  5,  unit: 'kg'  },
  { id: '8',  emoji: '🥒', name: 'Cucumber',     te: 'దోసకాయ',      cat: 'vegetables', today: 15, prev: 18, chg: -3,  unit: 'kg'  },
  { id: '9',  emoji: '🌽', name: 'Corn',         te: 'మొక్కజొన్న', cat: 'vegetables', today: 20, prev: 20, chg:  0,  unit: 'pc'  },
  { id: '10', emoji: '🍌', name: 'Banana',       te: 'అరటిపండు',   cat: 'fruits',     today: 40, prev: 45, chg: -5,  unit: 'doz' },
  { id: '11', emoji: '🍅', name: 'Cherry Tomato',te: 'చెర్రీ టమాటో',cat:'vegetables', today: 80, prev: 75, chg:  5,  unit: 'kg'  },
  { id: '12', emoji: '🧄', name: 'Garlic',       te: 'వెల్లుల్లి',  cat: 'vegetables', today: 120,prev: 110,chg:  10, unit: 'kg'  },
  { id: '13', emoji: '🌿', name: 'Coriander',    te: 'కొత్తిమీర',  cat: 'leafy',      today: 10, prev: 12, chg: -2,  unit: 'bunch'},
  { id: '14', emoji: '🍃', name: 'Curry Leaves', te: 'కరివేపాకు',  cat: 'leafy',      today: 10, prev: 10, chg:  0,  unit: 'bunch'},
  { id: '15', emoji: '🥬', name: 'Spinach',      te: 'పాలకూర',     cat: 'leafy',      today: 15, prev: 18, chg: -3,  unit: 'bunch'},
  { id: '16', emoji: '🍋', name: 'Lemon',        te: 'నిమ్మకాయ',   cat: 'fruits',     today: 80, prev: 70, chg:  10, unit: 'doz' },
  { id: '17', emoji: '🍈', name: 'Mango',        te: 'మామిడి',     cat: 'fruits',     today: 140,prev: 160,chg: -20, unit: 'kg'  },
  { id: '18', emoji: '🍉', name: 'Watermelon',   te: 'పుచ్చకాయ',  cat: 'fruits',     today: 18, prev: 20, chg: -2,  unit: 'kg'  },
  { id: '19', emoji: '🌸', name: 'Marigold',     te: 'బంతిపువ్వు', cat: 'flowers',    today: 80, prev: 100,chg: -20, unit: 'kg'  },
  { id: '20', emoji: '🌹', name: 'Rose',         te: 'గులాబీ',     cat: 'flowers',    today: 200,prev: 180,chg:  20, unit: 'kg'  },
];
