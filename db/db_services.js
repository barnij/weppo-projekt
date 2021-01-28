const { pool } = require('./config');

function disconnect() {
  pool.end();
}

async function get_user_id(username, password) {
  let query = `SELECT id FROM account WHERE username = $1 AND password = $2;`;
  let args = [username, password];
  try {
    let res = await pool.query(query, args);
    if (res.rows[0]) {
      return res.rows[0].id;
    } else {
      return false;
    }
  } catch (err) {
    console.error('db get_user_id error');
    console.error(err);
  }
}

async function login_user(username, password) {
  try {
    let id = await get_user_id(username, password);
    let query = `UPDATE account SET last_login = NOW() WHERE id = $1;`;
    await pool.query(query, [id]);
    return id;
  } catch (err) {
    console.error('db login_user error');
    console.error(err);
  }
}

async function add_user(username, password, isadmin) {
  let query = `INSERT INTO account (id,username, password, isadmin, last_login)
              VALUES (DEFAULT,$1, $2, $3, NOW())
              RETURNING id;`;
  let query1 = `SELECT id FROM account WHERE username = $1;`;
  let args = [username, password, isadmin];
  try {
    let check_existence = await pool.query(query1, [username]);
    if (check_existence.rowCount) {
      return false;
    }
    let res = await pool.query(query, args);
    return res.rows[0].id;
  } catch (err) {
    console.error('db add_user error');
    console.error(err);
  }
}

async function set_admin(userid, isadmin) {
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

async function add_category(description) {
  let query = `INSERT INTO category (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_category error');
    console.error(err);
  }
}

async function add_size(description) {
  let query = `INSERT INTO size (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_size error');
    console.error(err);
  }
}

async function add_colour(description) {
  let query = `INSERT INTO colour (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_colour error');
    console.error(err);
  }
}

async function add_product(price, name, size, colour, amount, status, description, category) {
  let query = `INSERT INTO product (price, name, size, colour, amount, status, description, category)
              VALUES ($1 ::numeric::money, $2, $3, $4, $5, $6, $7, $8)
              RETURNING id;`;
  let args = [price, name, size, colour, amount, status, description, category];
  try {
    let res = await pool.query(query, args);
    return res.rows[0].id;
  } catch (err) {
    console.error('db add_product error');
    console.error(err);
  }
}


async function set_product_status(prodid, status) {
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

async function set_product_amount(prodid, amount) {
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

async function add_purchase_status(description) {
  let query = `INSERT INTO purchase_status (description) VALUES ($1);`;
  try {
    await pool.query(query, [description]);
    return true;
  } catch (err) {
    console.error('db add_purchase_status error');
    console.error(err);
  }
}

async function add_picture(prodid, filepath) {
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

async function add_purchase(userid, status) {
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

async function add_sold_product(purchaseid, prodid, amount) {
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

async function set_purchase_status(purchaseid, status) {
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

async function get_category(id) {
  var query = `SELECT * FROM category;`;
  var args = [];
  if (id) {
    query = 'SELECT * FROM category WHERE id = $1;';
    args = [id];
  }
  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_category error');
    console.error(err);
  }
}

async function get_colour(id) {
  var query = `SELECT * FROM colour;`;
  var args = [];

  if (id) {
    query = `SELECT * FROM colour WHERE id = $1;`;
    args = [id];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_colour error');
    console.error(err);
  }
}

async function get_picture(prodid, id) {
  var query = `SELECT * FROM picture WHERE product = $1;`;
  var args = [prodid];

  if (id) {
    query = `SELECT * FROM picture WHERE id = $1;`;
    args = [id];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_picture error');
    console.error(err);
  }
}

async function get_purchase(userid, id) {
  var query = "";
  var args = [];
  if (id) {
    query = `SELECT * FROM purchase WHERE id = $1;`;
    args = [id];
  } else {
    if (userid) {
      query = `SELECT * FROM purchase WHERE userid = $1;`;
      args = [userid];
    } else {
      query = `SELECT * FROM purchase;`;
      args = [];
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

async function get_purchase_status(id) {
  var query = `SELECT * FROM purchase_status;`;
  var args = [];

  if (id) {
    query = `SELECT * FROM purchase_status WHERE id = $1;`;
    args = [id];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_purchase_status error');
    console.error(err);
  }
}

async function get_size(id) {
  var query = `SELECT * FROM size;`;
  var args = [];

  if (id) {
    query = `SELECT * FROM size WHERE id = $1;`;
    args = [id];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_size error');
    console.error(err);
  }
}

async function get_sold_product(purchaseid) {
  var query = `SELECT * FROM sold_product;`;
  var args = [];

  if (purchaseid) {
    query = `SELECT * FROM sold_product WHERE purchase_id = $1;`;
    args = [purchaseid];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_sold_product error');
    console.error(err);
  }
}

async function get_product(id) {
  var query = `SELECT * FROM product;`;
  var args = [];

  if (id) {
    query = `SELECT * FROM product WHERE id = $1;`;
    args = [id];
  }

  try {
    let res = await pool.query(query, args);
    return res.rows;
  } catch (err) {
    console.error('db get_product error');
    console.error(err);
  }
}

module.exports = {
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
