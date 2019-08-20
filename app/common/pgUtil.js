const { Client } = require('pg');
const config = require('../../config/config.local');

const client = new Client(config.pgConString);

module.exports = {
  async  querySql(sql, param) {
    await client.connect();
    const res = await client.query(sql, [...param]);
    console.log(res.rows[0].message);
    await client.end();
  },
};
