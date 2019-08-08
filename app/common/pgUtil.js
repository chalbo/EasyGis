import { Client } from 'pg';

const client = new Client();

export async function queSql(params) {

  await client.connect()
  const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  console.log(res.rows[0].message) // Hello world!
  await client.end();
}
