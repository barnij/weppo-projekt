const db = require('./db_services');
(async function () {
  await db.add_user('anonymous', 'anonymouspassword', false);
  await db.add_user('admin1', 'adminpassword1', true);
  await db.add_user('user1', 'userpassword1', false);
  await db.add_user('user2', 'userpassword2', false);
  await db.add_user('user3', 'userpassword3', false);

  await db.add_category('kategoria 1');
  await db.add_category('kategoria 2');
  await db.add_category('kategoria 3');

  await db.add_size('rozmiar 1');
  await db.add_size('rozmiar 2');
  await db.add_size('rozmiar 3');

  await db.add_colour('kolor 1');
  await db.add_colour('kolor 2');
  await db.add_colour('kolor 3');

  await db.add_product(10.99, 'produkt 1', 1, 1, 30, true, 'To jest niezwykły produkt 1', 1);
  await db.add_product(15.99, 'produkt 2', 2, 2, 50, true, 'To jest niezwykły produkt 2', 2);
  await db.add_product(20.99, 'produkt 3', 3, 3, 70, true, 'To jest niezwykły produkt 3', 3);

  await db.add_purchase_status('status zamówienia 1');
  await db.add_purchase_status('status zamówienia 2');
  await db.add_purchase_status('status zamówienia 3');

  await db.add_purchase(1, 1);
  await db.add_purchase(3, 2);
  await db.add_purchase(2, 3);

  await db.add_sold_product(1, 1, 2);
  await db.add_sold_product(1, 2, 5);
  await db.add_sold_product(2, 3, 10);
  await db.add_sold_product(3, 1, 1);
  await db.add_sold_product(3, 3, 15);
})();