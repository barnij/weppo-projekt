const { Pool } = require('pg');

function send (query, pool) {
  (async () => {
    try{
      let client = await pool.connect();
      let res = await client.query(query);
    } catch {
      console.error(err);
    }
  })();
}
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
  return pool;
}
function disconnect(pool) {
  pool.end();
}
function check_user_existence(pool, username, password) {
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
      return user.id;
    } catch (err) {
      console.error(err);
      return false;
    }
  })();
}
function add_user(pool, username, password, isadmin) {
  if (isadmin) {
    isadmin = 't';
  }
  else {
    isadmin = 'f';
  }
  if(check_user_existence(pool, username, password)) {
    console.error('adding existing user attempt');
    return false;
  }
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
function update_last_login(pool, userid) {
  let query = `
  UPDATE account
  SET last_login = NOW()
  WHERE id = ${userid}
  `;
  send(query, pool);
}
function login_user(pool, username, password) {
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
        update_last_login(user.id, pool);
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
function set_admin(pool, userid, isadmin) {
  if (isadmin) {
    isadmin = 't';
  }
  else {
    isadmin = 'f';
  }
  let query = `
  UPDATE account
  SET isadmin = ${isadmin}
  WHERE id = ${userid}
  `;
  send(query, pool);
}
function add_category(pool, description) {
  let query = `
  INSERT INTO category (description)
  VALUES (${description})
  `;
  send(query, pool);
}
function add_size(pool, description) {
  let query = `
  INSERT INTO size (description)
  VALUES (${description})
  `;
  send(query, pool);
}
function add_colour(pool, description) {
  let query = `
  INSERT INTO colour (description)
  VALUES (${description})
  `;
  send(query, pool);
}
function add_product(pool, name, category, size, colour, description, price, status, amount=0) {
  if (status) {
    status = 't';
  } else {
    status = 'f';
  }
  let query = `
  INSERT INTO product (price, name, size, colour, amount, status, description, category)
  VALUES (${price}, ${name}, ${size}, ${colour}, ${amount}, ${status}, ${description}, ${category})
  `;
  send(query, pool);
}
function set_product_status (pool, prodid, status) {
  if (status) {
    status = 't';
  } else {
    status = 'f';
  }
  let query = `
  UPDATE product
  SET status = ${status}
  WHERE id = ${prodid}
  `;
  send(query, pool);
}
function add_product_amount (pool, prodid, amount) {
  let query = `
  UPDATE product
  SET amount = amount+${amount}
  WHERE id = ${prodid}
  `;
  send(query, pool);
}
function add_purchase_status(pool, description) {
  let query = `
  INSERT INTO purchase_status (description)
  VALUES (${description})
  `;
  send(query, pool);
}
//TODO getters
//TODO purchase management
return {connect,
        disconnect,
        add_user,
        login_user,
        set_admin, 
        add_category, 
        add_size, 
        add_colour, 
        add_product, 
        add_purchase_status, 
        set_product_status,
        add_product_amount};