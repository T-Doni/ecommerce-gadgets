const PRODUCTS = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro 256 GB',
    price: 1099.0,
    description:
      'Pro-grade titanium flagship with the A18 Pro chip, the new Camera Control button, and a brighter, more efficient ProMotion display.',
    image: 'assets/images/products/iphone-16-pro/white-titanium.jpg',
    colors: [
      {
        id: 'white-titanium',
        name: 'White Titanium',
        hex: '#f4f1eb',
        image: 'assets/images/products/iphone-16-pro/white-titanium.jpg',
      },
      {
        id: 'black-titanium',
        name: 'Black Titanium',
        hex: '#3c3a37',
        image: 'assets/images/products/iphone-16-pro/black-titanium.jpg',
      },
      {
        id: 'natural-titanium',
        name: 'Natural Titanium',
        hex: '#c9c0b6',
        image: 'assets/images/products/iphone-16-pro/natural-titanium.jpg',
      },
      {
        id: 'desert-titanium',
        name: 'Desert Titanium',
        hex: '#a98b6a',
        image: 'assets/images/products/iphone-16-pro/desert-titanium.jpg',
      },
    ],
    specs: [
      { label: 'Display', value: '6.3" Super Retina XDR OLED, 120 Hz' },
      { label: 'Chip', value: 'Apple A18 Pro' },
      { label: 'Camera', value: '48 MP main + 48 MP UW + 12 MP 5× tele' },
      { label: 'Battery', value: 'Up to 27 h video playback' },
      { label: 'Storage', value: '256 GB' },
    ],
  },
  {
    id: 'macbook-pro-m4',
    name: 'MacBook Pro 14" M4',
    price: 1599.0,
    description:
      'Apple M4 with a 10-core CPU and a 10-core GPU, a 14.2" Liquid Retina XDR display, and up to 24 hours of battery.',
    image: 'assets/images/products/macbook-pro-m4/space-black.jpg',
    colors: [
      {
        id: 'space-black',
        name: 'Space Black',
        hex: '#2a2a2c',
        image: 'assets/images/products/macbook-pro-m4/space-black.jpg',
      },
      {
        id: 'silver',
        name: 'Silver',
        hex: '#d9d9d9',
        image: 'assets/images/products/macbook-pro-m4/silver.jpg',
      },
    ],
    specs: [
      { label: 'Display', value: '14.2" Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M4 (10-core CPU, 10-core GPU)' },
      { label: 'Memory', value: '16 GB unified memory' },
      { label: 'Storage', value: '512 GB SSD' },
      { label: 'Battery', value: 'Up to 24 hours' },
    ],
  },
  {
    id: 'ipad-pro-m4',
    name: 'iPad Pro 11" M4',
    price: 999.0,
    description:
      'The thinnest Apple product ever (5.3 mm) with a tandem-OLED display, M4 chip, and Apple Pencil Pro support.',
    image: 'assets/images/products/ipad-pro-m4/space-black.jpg',
    colors: [
      {
        id: 'space-black',
        name: 'Space Black',
        hex: '#2a2a2c',
        image: 'assets/images/products/ipad-pro-m4/space-black.jpg',
      },
      {
        id: 'silver',
        name: 'Silver',
        hex: '#d9d9d9',
        image: 'assets/images/products/ipad-pro-m4/silver.jpg',
      },
    ],
    specs: [
      { label: 'Display', value: '11" Ultra Retina XDR Tandem OLED, 120 Hz' },
      { label: 'Chip', value: 'Apple M4' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Pencil', value: 'Apple Pencil Pro support' },
      { label: 'Thickness', value: '5.3 mm' },
    ],
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    price: 799.0,
    description:
      '49 mm aerospace-grade titanium watch built for the outdoors, with a 3000-nit display, dual-frequency GPS, and 36-hour battery life.',
    image: 'assets/images/products/apple-watch-ultra-2/blue-alpine.jpg',
    colors: [
      {
        id: 'blue-alpine',
        name: 'Blue Alpine Loop',
        hex: '#3a4a78',
        image: 'assets/images/products/apple-watch-ultra-2/blue-alpine.jpg',
      },
      {
        id: 'orange-ocean',
        name: 'Orange Ocean Band',
        hex: '#e8732d',
        image: 'assets/images/products/apple-watch-ultra-2/orange-ocean.jpg',
      },
    ],
    specs: [
      { label: 'Case', value: '49 mm aerospace-grade titanium' },
      { label: 'Display', value: 'Always-On Retina, 3000 nits' },
      { label: 'Battery', value: 'Up to 36 hours' },
      { label: 'Water resistance', value: '100 m / WR100' },
      { label: 'GPS', value: 'Dual-frequency L1 + L5' },
    ],
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2 (USB-C)',
    price: 249.0,
    description:
      'Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio, and a MagSafe USB-C charging case.',
    image: 'assets/images/products/airpods-pro-2/white.jpg',
    colors: [
      {
        id: 'white',
        name: 'White',
        hex: '#ffffff',
        image: 'assets/images/products/airpods-pro-2/white.jpg',
      },
    ],
    specs: [
      { label: 'Chip', value: 'Apple H2' },
      { label: 'ANC', value: 'Up to 2× more than first gen' },
      { label: 'Spatial Audio', value: 'Personalised, head-tracking' },
      { label: 'Battery', value: 'Up to 6 h / 30 h with case' },
      { label: 'Case', value: 'MagSafe + USB-C, IP54' },
    ],
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    price: 399.0,
    description:
      'Industry-leading wireless noise cancellation, eight microphones for crystal-clear voice calls, 30-hour battery.',
    image: 'assets/images/products/sony-wh-1000xm5/black.jpg',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#1a1a1a',
        image: 'assets/images/products/sony-wh-1000xm5/black.jpg',
      },
    ],
    specs: [
      { label: 'Drivers', value: '30 mm carbon-fibre composite' },
      { label: 'ANC', value: '8 microphones, Auto NC Optimizer' },
      { label: 'Battery', value: '30 h with ANC on' },
      { label: 'Codecs', value: 'LDAC, AAC, SBC' },
      { label: 'Weight', value: '250 g' },
    ],
  },
  {
    id: 'sony-a7-iv',
    name: 'Sony α7 IV (body)',
    price: 2499.0,
    description:
      '33 MP full-frame Exmor R sensor, 4K 60p 10-bit video, real-time eye AF for humans, animals and birds.',
    image: 'assets/images/products/sony-a7-iv/black.jpg',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#1a1a1a',
        image: 'assets/images/products/sony-a7-iv/black.jpg',
      },
    ],
    specs: [
      { label: 'Sensor', value: '33 MP full-frame Exmor R' },
      { label: 'Video', value: '4K 60p 10-bit 4:2:2' },
      { label: 'AF', value: 'Real-time Eye AF' },
      { label: 'Burst', value: 'Up to 10 fps' },
      { label: 'Stabilisation', value: '5-axis IBIS' },
    ],
  },
  {
    id: 'jbl-flip-6',
    name: 'JBL Flip 6',
    price: 129.0,
    description:
      'Bold sound and powerful bass in a compact, IP67 dust- and waterproof speaker. 12 hours of battery.',
    image: 'assets/images/products/jbl-flip-6/black.jpg',
    colors: [
      {
        id: 'black',
        name: 'Black',
        hex: '#1a1a1a',
        image: 'assets/images/products/jbl-flip-6/black.jpg',
      },
      {
        id: 'blue',
        name: 'Blue',
        hex: '#1d6bb1',
        image: 'assets/images/products/jbl-flip-6/blue.jpg',
      },
    ],
    specs: [
      { label: 'Output', value: '20 W woofer + 10 W tweeter' },
      { label: 'Bluetooth', value: '5.1, range up to 10 m' },
      { label: 'Battery', value: 'Up to 12 hours' },
      { label: 'Durability', value: 'IP67 dust- and waterproof' },
      { label: 'Weight', value: '550 g' },
    ],
  },
];
