export interface CropRecommendation {
  name: string;
  suitability: "high" | "medium" | "low";
  season: string;
  waterNeeds: string;
  tips: string;
  icon: string;
}

const cropDatabase: Record<string, Record<string, CropRecommendation[]>> = {
  clay: {
    summer: [
      { name: "Paddy (Rice)", suitability: "high", season: "Summer", waterNeeds: "High", tips: "Ideal soil for water retention. Transplant at 25-30 days.", icon: "🌾" },
      { name: "Cotton", suitability: "medium", season: "Summer", waterNeeds: "Medium", tips: "Ensure good drainage. Apply balanced NPK fertilizer.", icon: "🌿" },
    ],
    winter: [
      { name: "Wheat", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Sow in October–November. Apply irrigation at crown root stage.", icon: "🌾" },
      { name: "Mustard", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Well suited for clay. Harvest when pods turn yellow.", icon: "🌿" },
    ],
    monsoon: [
      { name: "Paddy (Rice)", suitability: "high", season: "Monsoon", waterNeeds: "High", tips: "Best season for rice in clay soil. Flood irrigation method.", icon: "🌾" },
      { name: "Maize", suitability: "medium", season: "Monsoon", waterNeeds: "Medium", tips: "Avoid waterlogging. Ridge sowing recommended.", icon: "🌽" },
    ],
    spring: [
      { name: "Vegetables", suitability: "medium", season: "Spring", waterNeeds: "Medium", tips: "Ideal for tomatoes, brinjal. Good moisture retention.", icon: "🥦" },
    ],
  },
  sandy: {
    summer: [
      { name: "Groundnut", suitability: "high", season: "Summer", waterNeeds: "Low", tips: "Sandy soil is ideal for groundnuts. Good drainage prevents rot.", icon: "🥜" },
      { name: "Watermelon", suitability: "high", season: "Summer", waterNeeds: "Medium", tips: "Excellent drainage for root health. Drip irrigation recommended.", icon: "🍉" },
    ],
    winter: [
      { name: "Barley", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Drought tolerant grain perfect for sandy soils.", icon: "🌾" },
      { name: "Carrots", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Loose sandy soil allows straight root growth.", icon: "🥕" },
    ],
    monsoon: [
      { name: "Bajra (Millet)", suitability: "high", season: "Monsoon", waterNeeds: "Low", tips: "Highly tolerant of droughts. Well-drained sandy soil is perfect.", icon: "🌾" },
      { name: "Cowpea", suitability: "medium", season: "Monsoon", waterNeeds: "Low", tips: "Good nitrogen fixer for sandy soils.", icon: "🫘" },
    ],
    spring: [
      { name: "Moong Dal", suitability: "high", season: "Spring", waterNeeds: "Low", tips: "Short duration crop ideal for sandy soil.", icon: "🫘" },
    ],
  },
  loamy: {
    summer: [
      { name: "Tomatoes", suitability: "high", season: "Summer", waterNeeds: "Medium", tips: "Best soil for tomatoes. Apply mulch to retain moisture.", icon: "🍅" },
      { name: "Sunflower", suitability: "high", season: "Summer", waterNeeds: "Low", tips: "Deep root development in loamy soil. High oil yield.", icon: "🌻" },
      { name: "Sugarcane", suitability: "high", season: "Summer", waterNeeds: "High", tips: "Loamy soil provides excellent nutrients for cane growth.", icon: "🌿" },
    ],
    winter: [
      { name: "Wheat", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Best soil type for wheat. High yields expected.", icon: "🌾" },
      { name: "Peas", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Cool climate with loamy soil ensures quality peas.", icon: "🫛" },
      { name: "Spinach", suitability: "high", season: "Winter", waterNeeds: "Medium", tips: "Rich loamy soil for nutrient-dense leafy greens.", icon: "🥬" },
    ],
    monsoon: [
      { name: "Soybean", suitability: "high", season: "Monsoon", waterNeeds: "Medium", tips: "High-protein legume thrives in well-drained loamy soil.", icon: "🫘" },
      { name: "Maize", suitability: "high", season: "Monsoon", waterNeeds: "Medium", tips: "Excellent growth in loamy soil. High productivity.", icon: "🌽" },
    ],
    spring: [
      { name: "Cucumber", suitability: "high", season: "Spring", waterNeeds: "Medium", tips: "Warm weather + loamy soil for best cucumber yield.", icon: "🥒" },
      { name: "Brinjal", suitability: "high", season: "Spring", waterNeeds: "Medium", tips: "Well-drained loamy soil for excellent eggplant growth.", icon: "🍆" },
    ],
  },
  silty: {
    summer: [
      { name: "Rice", suitability: "high", season: "Summer", waterNeeds: "High", tips: "Silty soil retains moisture excellently for rice cultivation.", icon: "🌾" },
      { name: "Jute", suitability: "high", season: "Summer", waterNeeds: "High", tips: "Ideal for jute fiber crops. High humidity and silt combination.", icon: "🌿" },
    ],
    winter: [
      { name: "Wheat", suitability: "high", season: "Winter", waterNeeds: "Low", tips: "Fertile silty soil gives high wheat yields.", icon: "🌾" },
      { name: "Onion", suitability: "high", season: "Winter", waterNeeds: "Medium", tips: "Fine silty soil promotes bulb development.", icon: "🧅" },
    ],
    monsoon: [
      { name: "Jute", suitability: "high", season: "Monsoon", waterNeeds: "High", tips: "Best season for jute in silty riverine soils.", icon: "🌿" },
      { name: "Paddy", suitability: "high", season: "Monsoon", waterNeeds: "High", tips: "High fertility silty soil for bumper paddy crop.", icon: "🌾" },
    ],
    spring: [
      { name: "Potato", suitability: "high", season: "Spring", waterNeeds: "Medium", tips: "Loose silty soil allows excellent tuber expansion.", icon: "🥔" },
    ],
  },
};

export function getRecommendations(
  soilType: string,
  season: string
): CropRecommendation[] {
  const soil = soilType.toLowerCase();
  const s = season.toLowerCase();
  return cropDatabase[soil]?.[s] || [
    { name: "Consult Local Expert", suitability: "medium", season: season, waterNeeds: "Varies", tips: "No specific data for this combination. Please consult your local agricultural officer.", icon: "🌱" },
  ];
}

export const SOIL_TYPES = ["Clay", "Sandy", "Loamy", "Silty"];
export const SEASONS = ["Summer", "Winter", "Monsoon", "Spring"];
