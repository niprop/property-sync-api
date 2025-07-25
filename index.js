import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE_SALES = process.env.SUPABASE_TABLE_SALES;
const TABLE_RENTALS = process.env.SUPABASE_TABLE_RENTALS;

const insertIntoSupabase = async (table, payload) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Prefer': 'resolution=merge-duplicates'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify([payload])
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Insert failed:', result);
    } else if (result.length === 0) {
      console.log('⚠️ Insert skipped (duplicate or empty)');
    } else {
      console.log('✅ Inserted into Supabase:', result[0].uuid || result[0].id);
    }

    return result;
  } catch (err) {
    console.error('❌ Error inserting into Supabase:', err);
    return null;
  }
};

app.post('/sales', async (req, res) => {
  const result = await insertIntoSupabase(TABLE_SALES, req.body);
  res.json({ inserted: result });
});

app.post('/rentals', async (req, res) => {
  const result = await insertIntoSupabase(TABLE_RENTALS, req.body);
  res.json({ inserted: result });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
