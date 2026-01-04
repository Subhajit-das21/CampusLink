const axios = require('axios');
const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config();

/**
 * findAndFix: Database Enrichment Node
 * Purpose: Matches MongoDB service names to Google Place IDs using spatial bias.
 */
async function findAndFix() {
  try {
    console.log("📡 Initializing Nexus Database Link...");
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find services missing the critical placeId field
    const items = await Service.find({ 
      $or: [
        { placeId: { $exists: false } },
        { placeId: "" },
        { placeId: null }
      ]
    });

    console.log(`🔍 Found ${items.length} nodes requiring synchronization.`);

    for (const item of items) {
      // Logic: Search for the name but bias results to within 500m of the stored lat/lng
      // This prevents "Starbucks" in your campus from linking to a "Starbucks" in another city.
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(item.name)}&inputtype=textquery&locationbias=circle:500@${item.lat},${item.lng}&fields=place_id,formatted_address,geometry&key=${process.env.VITE_GOOGLE_MAPS_API_KEY}`;
      
      const res = await axios.get(url);
      const candidate = res.data.candidates?.[0];
      const foundId = candidate?.place_id;

      if (foundId) {
        await Service.findByIdAndUpdate(item._id, { 
          placeId: foundId,
          // Optional: Update address if Google has a more precise one
          address: candidate.formatted_address || item.address 
        });
        console.log(`✅ Linked: ${item.name} ──> ${foundId}`);
      } else {
        console.log(`⚠️ Warning: No Google Node found for "${item.name}" at these coordinates.`);
      }

      // ⏱ Rate Limiting: 200ms pause to ensure API stability during bulk sync
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("✨ System Sync Complete. All network nodes are enriched.");
  } catch (err) {
    console.error("❌ Critical Sync Failure:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

findAndFix();