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
    console.error('db add_purchase_status error');
    console.error(err);
  }
}

async function add_picture(pool, prodid, filepath) {
  let query = `INSERT INTO picture (product, filepath)
              VALUES ($1, $2);`;
  let args = [prodid, filepath];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db add_picture error');
    console.error(err);
  }
}

async function add_purchase(pool, userid, status) {
  let query = `INSERT INTO purchase (userid, status)
              VALUES ($1, $2);`;
  let args = [userid, status];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db add_purchase error');
    console.error(err);
  }
}

async function add_sold_product(pool, purchaseid, prodid, amount) {
  let query = `INSERT INTO sold_product (purchase_id, product_id, amount)
              VALUES ($1, $2, $3);`;
  let args = [purchaseid, prodid, amount];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db add_sold_product error');
    console.error(err);
  }
}

async function set_purchase_status(pool, purchaseid, status) {
  let query = `UPDATE purchase SET status = $1 WHERE id = $2;`;
  let args = [status, purchaseid];
  try {
    await pool.query(query, args);
    return true;
  } catch (err) {
    console.error('db set_purchase_status error');
    console.error(err);
  }
}

async function get_category(pool, id) {
  if(id) {
    var query = `SELECT * FROM category WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM category;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_category error');
    console.error(err);
  }
}

async function get_colour(pool, id) {
  if(id) {
    var query = `SELECT * FROM colour WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM colour;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_colour error');
    console.error(err);
  }
}

async function get_picture(pool, prodid, id) {
  if(id) {
    var query = `SELECT * FROM picture WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM picture WHERE product = $1;`;
    var args = [prodid];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_picture error');
    console.error(err);
  }
}

async function get_purchase(pool, userid, id) {
  if(id) {
    var query = `SELECT * FROM purchase WHERE id = $1;`;
    var args = [id];
  } else {
    if(userid) {
      var query = `SELECT * FROM purchase WHERE userid = $1;`;
      var args = [userid];
    } else {
      var query = `SELECT * FROM purchase;`;
      var args = [];
    }
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_purchase error');
    console.error(err);
  }
}

async function get_purchase_status(pool, id) {
  if(id) {
    var query = `SELECT * FROM purchase_status WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM purchase_status;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_purchase_status error');
    console.error(err);
  }
}

async function get_size(pool, id) {
  if(id) {
    var query = `SELECT * FROM size WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM size;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_size error');
    console.error(err);
  }
}

async function get_sold_product(pool, purchaseid) {
  if(purchaseid) {
    var query = `SELECT * FROM sold_product WHERE purchase_id = $1;`;
    var args = [purchaseid];
  } else {
    var query = `SELECT * FROM sold_product;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_sold_product error');
    console.error(err);
  }
}

async function get_product(pool, id) {
  if(id) {
    var query = `SELECT * FROM product WHERE id = $1;`;
    var args = [id];
  } else {
    var query = `SELECT * FROM product;`;
    var args = [];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_product error');
    console.error(err);
  }
}

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
  add_purchase_status,
  add_picture,
  add_purchase,
  add_sold_product,
  set_purchase_status,
  get_category,
  get_colour,
  get_picture,
  get_purchase,
  get_purchase_status,
  get_size,
  get_sold_product,
  get_product
}