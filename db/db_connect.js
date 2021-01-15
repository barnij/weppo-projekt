const { Pool } = require('pg');

function connect() {
  let pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'weppo',
    password: '123',
    port: 5432,
  });
  pool.on('error', (err, client) => {
    console.error('Error:', err);
  });
  return pool
}
function disconnect(pool) {
  pool.end()
}
function add_user(username, password, isadmin, pool) {
  if (isadmin) {
    isadmin = 't'
  }
  else {
    isadmin = 'f'
  }
  //TODO check if already exists
  let query = `
  INSERT INTO account (username, password, isadmin, last_login)
  VALUES (${username}, ${password}, ${isadmin}, NOW())
  `;
  (async () => {
    try {
      let client = await pool.connect();
      let res = await client.query(query);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  })();
}
function login_user(username, password, pool) {
  let query = `
  SELECT id FROM account
  WHERE username = ${username}
  AND password = ${password}
  `;
  (async () => {
    try{
      let client = await pool.connect();
      let res = await client.query(query);
      tmp = "";
      for (let row in res.rows) {
        tmp += row;
      }
      let user = JSON.parse(tmp)
      if (user.id) {
        //TODO update last login
        return user.id;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  })();
}

return {connect, disconnect, add_user, login_user};