// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Load env vars
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Logging util
const logInsertAttempt = (table, data) => {
  console.log(`📦 Attempting to insert into ${table}:`, data);
};

const logInsertError = (error) => {
  console.error('❌ Supabase insert error:');
  if (error) {
    console.error('Status:', error.code || error.status || 'Unknown');
    console.error('Message:', error.message || JSON.stringify(error));
    if (error.details) console.error('Details:', error.details);
  }
};

// Insert handler
async function handleInsert(req, res) {
  const payload = req.body;

  const snakeCasePayload = {
    id: uuidv4(),
    uuid: payload.uuid,
    title: payload.title,
    price: payload.price,
    postcode: payload.postcode,
    property_type: payload.houseType || null,
    beds: payload.beds ?? null,
    bathrooms: payload.bathrooms ?? null,
    receptions: payload.receptions ?? null,
    tenure: payload.tenure || null,
    energy_rating: payload.energyRating || null,
    rates: payload.rates || null,
    style: payload.style || null,
    listingtype: payload.listingType || null,        // ✅ matches Supabase exactly
    price_text: payload.priceText || null,
    source_url: payload.sourceUrl || null,
    listingid: payload.listingId || null,            // ✅ matches Supabase exactly
    scraped_at: payload.detectedAt || null           // ✅ matches Supabase exactly
  };

  logInsertAttempt('listings', snakeCasePayload);

  const { error } = await supabase.from('listings').insert(snakeCasePayload);

  if (error) {
    logInsertError(error);
    return res.status(500).send('Insert failed');
  }

  res.send('OK');
}

// Routes
app.post('/sales', handleInsert);
app.post('/rentals', handleInsert);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log('///////////////////////////////////////////////////////////');
  console.log(`Available at your primary URL https://property-sync-api.onrender.com`);
  console.log('///////////////////////////////////////////////////////////');
});
