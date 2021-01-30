INSERT INTO account (username, password, isadmin, last_login)
  VALUES ('admin1', 'adminpassword1', true, NOW());

INSERT INTO account (username, password, isadmin, last_login)
  VALUES ('user1', 'userpassword1', false, NOW());

INSERT INTO account (username, password, isadmin, last_login)
  VALUES ('user2', 'userpassword2', false, NOW());

INSERT INTO account (username, password, isadmin, last_login)
  VALUES ('user3', 'userpassword3', false, NOW());


INSERT INTO category (description)
  VALUES ('category1');

INSERT INTO category (description)
  VALUES ('category2');

INSERT INTO category (description)
  VALUES ('category3');


INSERT INTO size (description)
 VALUES ('size1');

INSERT INTO size (description)
 VALUES ('size2');

INSERT INTO size (description)
 VALUES ('size3');


INSERT INTO colour (description)
  VALUES ('colour1');

INSERT INTO colour (description)
  VALUES ('colour2');

INSERT INTO colour (description)
  VALUES ('colour3');


INSERT INTO product (price, name, size, colour, amount, status, description, category)
  VALUES (10.99 ::numeric::money, 'product1', 1, 1, 30, true, 'this is very nice product1', 1);

INSERT INTO product (price, name, size, colour, amount, status, description, category)
  VALUES (15.99 ::numeric::money, 'product2', 2, 2, 50, true, 'this is very nice product2', 2);

INSERT INTO product (price, name, size, colour, amount, status, description, category)
  VALUES (20.49 ::numeric::money, 'product3', 3, 3, 70, true, 'this is very nice product3', 3);


INSERT INTO purchase_status (description)
  VALUES ('purchase_status1');

INSERT INTO purchase_status (description)
  VALUES ('purchase_status2');

INSERT INTO purchase_status (description)
  VALUES ('purchase_status3');


INSERT INTO purchase (userid, status)
  VALUES (1, 1);

INSERT INTO purchase (userid, status)
  VALUES (1, 2);

INSERT INTO purchase (userid, status)
  VALUES (2, 3);


INSERT INTO sold_product (purchase_id, product_id, amount)
  VALUES (1, 1, 2);

INSERT INTO sold_product (purchase_id, product_id, amount)
  VALUES (1, 2, 5);

INSERT INTO sold_product (purchase_id, product_id, amount)
  VALUES (2, 3, 10);

INSERT INTO sold_product (purchase_id, product_id, amount)
  VALUES (3, 1, 1);

INSERT INTO sold_product (purchase_id, product_id, amount)
  VALUES (3, 3, 15);

