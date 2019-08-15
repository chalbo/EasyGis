import { Client } from 'pg';

const client = new Client();

export async function querySql(sql, param) {

  await client.connect();
  const res = await client.query(sql, [...param]);
  console.log(res.rows[0].message);
  await client.end();
  
}
