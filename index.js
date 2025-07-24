const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(bodyParser.json());

app.post('/sales', async (req, res) => {
  const data = Array.isArray(req.body) ? req.body : [req.body];
  const inserted = [];

  for (const item of data) {
    const { uuid } = item;
    const exists = await supabase
      .from(process.env.SUPABASE_TABLE_SALES)
      .select('id')
      .eq('uuid', uuid)
      .maybeSingle();

    if (!exists.data) {
      const { error } = await supabase
        .from(process.env.SUPABASE_TABLE_SALES)
        .insert([item]);

      if (error) {
        console.error(error);
        continue;
      }

      inserted.push(uuid);
    }
  }

  res.status(200).json({ inserted });
});

app.post('/rentals', async (req, res) => {
  const data = Array.isArray(req.body) ? req.body : [req.body];
  const inserted = [];

  for (const item of data) {
    const { uuid } = item;
    const exists = await supabase
      .from(process.env.SUPABASE_TABLE_RENTALS)
      .select('id')
      .eq('uuid', uuid)
      .maybeSingle();

    if (!exists.data) {
      const { error } = await supabase
        .from(process.env.SUPABASE_TABLE_RENTALS)
        .insert([item]);

      if (error) {
        console.error(error);
        continue;
      }

      inserted.push(uuid);
    }
  }

  res.status(200).json({ inserted });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
