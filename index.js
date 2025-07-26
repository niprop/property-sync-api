import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase env vars");
  process.exit(1);
}

const insertListing = async (listing) => {
  try {
    // Ensure required fields are present
    if (!listing.uuid) {
      listing.uuid = uuidv4(); // fallback if UUID not provided
    }

    console.log('📦 Attempting to insert into listings:', listing);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/listings`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify([listing])
    });

    const body = await res.text();
    if (!res.ok) {
      console.error("❌ Supabase insert error:");
      console.error("Status:", res.status);
      console.error("Body:", body);
    } else {
      const parsed = JSON.parse(body);
      console.log("✅ Inserted:", parsed.map(row => row.uuid));
    }
  } catch (err) {
    console.error("❌ Insert failed:", err.message || err);
  }
};

app.post('/sales', async (req, res) => {
  await insertListing(req.body);
  res.send('Insert attempted');
});

app.post('/rentals', async (req, res) => {
  await insertListing(req.body);
  res.send('Insert attempted');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
