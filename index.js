import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase env vars");
  process.exit(1);
}

const insertListing = async (table, listing) => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([listing])
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Supabase insert error:", data?.message || data);
    } else if (!data || data.length === 0) {
      console.error("⚠️ Insert returned no rows for", listing.uuid);
    } else {
      console.log("✅ Inserted:", data.map(d => d.uuid));
    }

  } catch (err) {
    console.error("❌ Insert failed:", err.message || err);
  }
};

app.post('/sales', async (req, res) => {
  const listing = req.body;
  await insertListing('sales_listings', listing);
  res.sendStatus(200);
});

app.post('/rentals', async (req, res) => {
  const listing = req.body;
  await insertListing('rental_listings', listing);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
