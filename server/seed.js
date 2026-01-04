const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const Service = require('./models/Service'); 

dotenv.config();

const services = [
  {
    name: "Campus Canteen",
    category: "Food",
    description: "Multi-cuisine student hub serving fresh meals daily.",
    address: "Block-A Ground Floor",
    lat: 22.5576984,
    lng: 88.3939082    
  },
  {
    name: "Ladies PG",
    category: "Private Furnished Homestay",
    description: "Located conveniently for all day-today needs and with all amenities. It’s also a safe accommodation for women.",
    address: "B/7A/H/7/1/4 Rani Rashmoni Garden Lane RCC ENGINEERING COLLEGE, Beliaghata, near kishore Sangha play ground, near RCC engineering college, Kolkata, West Bengal 700015",
    lat: 22.5596016,
    lng: 88.3892188
  },
  {
    name: "Gents PG",
    category: "Private Furnished Homestay",
    description: "Affordable price within this area both for working people and students.",
    address: "115, 2C, Beleghata Main Rd, Kulia, Beleghata, Kolkata, West Bengal 700010",
    lat: 22.5623506,
    lng: 88.3946016
  },
  {
    name: "Infectious Diseases & Beleghata General Hospital",
    category: "Medical",
    description: "24/7 Pharmacy providing essential medicines and first-aid kits.",
    address: "57, Beleghata Main Rd, Subhas Sarobar Park, Phool Bagan, Beleghata, Kolkata, West Bengal 700010",
    lat: 22.5592616,
    lng: 88.3854612
  },
  {
    name: "Maa Xerox",
    category: "Stationery Store",
    description: "Complete academic supplies, and engineering drawing tools.",
    address: "P 28 CIT Road Kolkata 700010, 28, CIT Rd, Kolkata, West Bengal 700010",
    lat: 22.5631366,
    lng: 88.3963339
  },
  {
    name: "Turram's : Flames and Works",
    category: "Food",
    description: "Popular spot for quick snacks and student networking sessions.",
    address: "5/H/1, Gagan Sarkar Rd, Kulia, Beleghata, Kolkata, West Bengal 700010",
    lat: 22.561993,
    lng: 88.3956175
  },
  {
    name: "HELLO KOLKATA",
    category: "Grocery Store",
    description: "Daily essentials and packed snacks for hostel students.",
    address: "112F, Dr SC Banerjee Rd, Kulia, Beleghata, Kolkata, West Bengal 700010",
    lat: 22.5623361,
    lng: 88.3957581
  }
];

async function getPlaceId(name, lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`;
  try {
    const response = await axios.get(url, {
      params: {
        input: name,
        inputtype: 'textquery',
        locationbias: `point:${lat},${lng}`,
        fields: 'place_id',
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    return response.data.candidates[0]?.place_id || null;
  } catch (error) {
    console.error(`Could not find Place ID for ${name}`);
    return null;
  }
}

async function startEnrichment() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB. Starting enrichment...");

  const enrichedServices = [];

  for (const item of services) {
    console.log(`Searching for: ${item.name}...`);
    const pid = await getPlaceId(item.name, item.lat, item.lng);
    enrichedServices.push({ ...item, placeId: pid });
    // Small delay to avoid hitting rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  await Service.deleteMany();
  await Service.insertMany(enrichedServices);
  console.log("Database seeded with live Place IDs! 🚀");
  process.exit();
}

startEnrichment();