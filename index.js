import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertListing(table, listing) {
  const data = {
    id: uuidv4(),
    uuid: listing.uuid || null,
    title: listing.title || null,
    price: listing.price || null,
    postcode: listing.postcode || null,
    property_type: listing.houseType || null,
    beds: listing.beds || null,
    source_url: listing.link || null,
    scraped_at: listing.detectedAt || null,
    bathrooms: listing.bathrooms || null,
    receptions: listing.receptions || null,
    tenure: listing.tenure || null,
    energy_rating: listing.energyRating || null,
    rates: listing.rates || null,
    style: listing.style || null,
    listing_type: listing.listingType || null,
    price_text: listing.price_text || null,
    listing_id: listing.listingId || null,
  };

  console.log(`📦 Attempting to insert into ${table}:`, data);

  const { error } = await supabase.from(table).insert([data]);

  if (error) {
    console.error('❌ Supabase insert error:');
    console.error('Status:', error.code || 'unknown');
    console.error('Message:', error.message);
    console.error('Details:', error.details || 'No details');
    throw error;
  }
}

app.post('/sales', async (req, res) => {
  try {
    await insertListing('listings', req.body);
    res.status(200).send('OK');
  } catch (err) {
    res.status(400).send('Insert failed');
  }
});

app.post('/rentals', async (req, res) => {
  try {
    await insertListing('rental_listings', req.body);
    res.status(200).send('OK');
  } catch (err) {
    res.status(400).send('Insert failed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
