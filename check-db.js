const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.rkozdnbedsvzcmzksros',
  password: 'Pok@l744900',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'product';
  `);
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
