const pg = require('pg');

function connect() {
  let pool = new pg.Pool({
    user: 'andrzej',
    host: 'localhost',
    database: 'weppo',
    password: '123',
    port: 5432,
  });
  return pool;
}

function disconnect(pool) {
  pool.end();
}

async function get_user_id(pool, username, password) {
  let query = `SELECT id FROM account WHERE username = $1 AND password = $2;`;
  let args = [username, password];
  try {
    let res = await pool.query(query, args);
    if(res.rows[0]){
      return res.rows[0].id;
    } else {
      return false;
    }
  } catch (err) {
    console.error('db get_user_id error');
    console.error(err);
  }
}

async function login_user(pool, username, password) {
  try {
    let id = await get_user_id(pool, username, password);
    let query = `UPDATE account SET last_login = NOW() WHERE id = $1;`;
    await pool.query(query, [id]);
    return id;
  } catch (err) {
    console.error('db login_user error');
    console.error(err);
  }
}

async function add_user(pool, username, password, isadmin) {
  let query = `INSERT INTO account (username, password, isadmin, last_login)
              VALUES ($1, $2, $3, NOW())
              RETURNING id;`;
  let query1 = `SELECT id FROM account WHERE username = $1 OR password = $2;`;
  let args = [username, password, isadmin];
  try {
    let check_existence = await pool.query(query1, [username, password]);
    if (check_existence) {
      return false;
    }
    let res = await pool.query(query, args);
    return res.rows[0].id;
  } catch (err) {
    console.error('db add_user error');
    console.error(err);
  }
}

async function set_admin(pool, userid, isadmin) {
  let query = `UPDATE account SET isadmin = $1 WHERE id = $2;`;
  let args = [isadmin, userid];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db set_admin error');
    console.error(err);
  }
}

async function add_category(pool, description) {
  let query = `INSERT INTO category (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) { 
    console.error('db add_category error');
    console.error(err);
  }
}

async function add_size(pool, description) {
  let query = `INSERT INTO size (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_size error');
    console.error(err);
  }
}

async function add_colour(pool, description) {
  let query = `INSERT INTO colour (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_colour error');
    console.error(err);
  }
}

async function add_product(pool, price, name, size, colour, amount, status, description, category) {
  let query = `INSERT INTO product (price, name, size, colour, amount, status, description, category)
              VALUES ($1 ::numeric::money, $2, $3, $4, $5, $6, $7, $8)
              RETURNING id;`;
  let args = [price, name, size, colour, amount, status, description, category];
  try{
    let res = await pool.query(query, args);
    return res.rows[0].id;
  } catch (err) {
    console.error('db add_product error');
    console.error(err);
  }
}

async function set_product_status(pool, prodid, status) {
  let query = `UPDATE product SET status = $1 WHERE id = $2;`;
  let args = [status, prodid];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db set_product_status error');
    console.error(err);
  }
}

async function set_product_amount(pool, prodid, amount) {
  let query = `UPDATE product SET amount = $1 WHERE id = $2;`;
  let args = [amount, prodid];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db set_product_amount error');
    console.error(err);
  }
}

async function add_purchase_status(pool, description) {
  let query = `INSERT INTO purchase_status (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_colour error');
    console.error(err);
  }
}

pool = connect();
add_purchase_status(pool, 'test2').then(res => {disconnect(pool)});

//TODO getters
//TODO purchase management

return {
  connect,
  disconnect,
  get_user_id,
  login_user,
  add_user,
  set_admin,
  add_category,
  add_size,
  add_colour,
  add_product,
  set_product_status,
  set_product_amount,

}