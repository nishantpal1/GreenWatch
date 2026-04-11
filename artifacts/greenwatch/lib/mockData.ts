export interface MarketPrice {
  id: string;
  crop: string;
  price: number;
  unit: string;
  change: number;
  market: string;
  date: string;
}

export const MARKET_PRICES: MarketPrice[] = [
  { id: "1", crop: "Wheat", price: 2150, unit: "per quintal", change: +2.3, market: "Delhi Mandi", date: "Today" },
  { id: "2", crop: "Paddy (Rice)", price: 2183, unit: "per quintal", change: -0.5, market: "Punjab Mandi", date: "Today" },
  { id: "3", crop: "Maize", price: 1862, unit: "per quintal", change: +1.8, market: "Rajasthan", date: "Today" },
  { id: "4", crop: "Cotton", price: 6900, unit: "per quintal", change: +3.1, market: "Gujarat", date: "Today" },
  { id: "5", crop: "Soybean", price: 4200, unit: "per quintal", change: -1.2, market: "Madhya Pradesh", date: "Today" },
  { id: "6", crop: "Sugarcane", price: 310, unit: "per quintal", change: 0, market: "UP Mandi", date: "Today" },
  { id: "7", crop: "Mustard", price: 5650, unit: "per quintal", change: +0.8, market: "Rajasthan", date: "Today" },
  { id: "8", crop: "Groundnut", price: 5800, unit: "per quintal", change: +2.0, market: "Gujarat", date: "Today" },
  { id: "9", crop: "Onion", price: 1450, unit: "per quintal", change: -3.5, market: "Nashik", date: "Today" },
  { id: "10", crop: "Potato", price: 1200, unit: "per quintal", change: +1.1, market: "Agra", date: "Today" },
  { id: "11", crop: "Tomato", price: 2300, unit: "per quintal", change: -2.4, market: "Bangalore", date: "Today" },
  { id: "12", crop: "Chickpea", price: 5400, unit: "per quintal", change: +0.6, market: "Madhya Pradesh", date: "Today" },
  { id: "13", crop: "Bajra (Millet)", price: 2350, unit: "per quintal", change: +1.4, market: "Jodhpur", date: "Today" },
  { id: "14", crop: "Barley", price: 1800, unit: "per quintal", change: -0.3, market: "Haryana", date: "Today" },
  { id: "15", crop: "Moong Dal", price: 7500, unit: "per quintal", change: +2.7, market: "Jaipur", date: "Today" },
];

export interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
}

export const CROP_TIPS = [
  "Irrigate crops early morning to reduce evaporation loss.",
  "Test soil pH before sowing — optimal range is 6.0 to 7.5.",
  "Use organic mulch to retain moisture and control weeds.",
  "Rotate crops each season to maintain soil fertility.",
  "Monitor for pest signs weekly — early detection saves yield.",
  "Apply fertilizers based on soil test reports for best results.",
  "Inter-cropping with legumes fixes nitrogen naturally.",
  "Harvest at the right maturity stage to maximize market value.",
];

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: string;
  unit: string;
  location: string;
  sellerName: string;
  sellerPhone: string;
  category: string;
  description: string;
  postedDate: string;
  image?: string;
}

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Wheat",
    price: 2100,
    quantity: "50",
    unit: "quintal",
    location: "Ludhiana, Punjab",
    sellerName: "Ranjit Singh",
    sellerPhone: "+91 98765 43210",
    category: "Grains",
    description: "Grade A wheat, freshly harvested, well-dried and cleaned. MSP quality assured.",
    postedDate: "2 days ago",
  },
  {
    id: "p2",
    name: "Organic Tomatoes",
    price: 2500,
    quantity: "10",
    unit: "quintal",
    location: "Nashik, Maharashtra",
    sellerName: "Suresh Patil",
    sellerPhone: "+91 87654 32109",
    category: "Vegetables",
    description: "Fresh organic tomatoes, no pesticides used, grown with natural compost.",
    postedDate: "1 day ago",
  },
  {
    id: "p3",
    name: "Cotton Bales",
    price: 6800,
    quantity: "20",
    unit: "quintal",
    location: "Surat, Gujarat",
    sellerName: "Dhirubhai Patel",
    sellerPhone: "+91 76543 21098",
    category: "Cash Crops",
    description: "Long staple cotton, high ginning outturn percentage. Ideal for textile mills.",
    postedDate: "3 days ago",
  },
  {
    id: "p4",
    name: "Fresh Potatoes",
    price: 1100,
    quantity: "100",
    unit: "quintal",
    location: "Agra, Uttar Pradesh",
    sellerName: "Ramesh Kumar",
    sellerPhone: "+91 65432 10987",
    category: "Vegetables",
    description: "Grade A potatoes, uniform size, low moisture content. Cold storage available.",
    postedDate: "Today",
  },
  {
    id: "p5",
    name: "Soybean",
    price: 4100,
    quantity: "30",
    unit: "quintal",
    location: "Indore, Madhya Pradesh",
    sellerName: "Prakash Sharma",
    sellerPhone: "+91 54321 09876",
    category: "Oilseeds",
    description: "High protein soybean, free from aflatoxin. Perfect for oil extraction.",
    postedDate: "Today",
  },
  {
    id: "p6",
    name: "Sugarcane",
    price: 300,
    quantity: "200",
    unit: "quintal",
    location: "Muzaffarnagar, UP",
    sellerName: "Mahendra Yadav",
    sellerPhone: "+91 43210 98765",
    category: "Cash Crops",
    description: "High sucrose content sugarcane. Ready for jaggery or sugar mill.",
    postedDate: "5 hours ago",
  },
];

export const CATEGORIES = ["All", "Grains", "Vegetables", "Fruits", "Oilseeds", "Cash Crops", "Pulses", "Spices"];
