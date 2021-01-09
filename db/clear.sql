
ALTER TABLE purchase DROP CONSTRAINT IF EXISTS fk_purchase;
ALTER TABLE sold_product DROP CONSTRAINT IF EXISTS fk_sold_product_purchase;
ALTER TABLE sold_product DROP CONSTRAINT IF EXISTS fk_sold_product_prod;
ALTER TABLE product DROP CONSTRAINT IF EXISTS fk_product_size;
ALTER TABLE product DROP CONSTRAINT IF EXISTS fk_product_colour;
ALTER TABLE product DROP CONSTRAINT IF EXISTS fk_product_category;
ALTER TABLE picture DROP CONSTRAINT IF EXISTS fk_picture;
ALTER TABLE account DROP CONSTRAINT IF EXISTS account_key;
ALTER TABLE purchase DROP CONSTRAINT IF EXISTS purchase_key; 
ALTER TABLE purchase_status DROP CONSTRAINT IF EXISTS purchase_status_key;
ALTER TABLE sold_product DROP CONSTRAINT IF EXISTS sold_product_key;
ALTER TABLE product DROP CONSTRAINT IF EXISTS product_key;
ALTER TABLE size DROP CONSTRAINT IF EXISTS size_key;
ALTER TABLE colour DROP CONSTRAINT IF EXISTS colour_key;
ALTER TABLE category DROP CONSTRAINT IF EXISTS category_key;
ALTER TABLE picture DROP CONSTRAINT IF EXISTS picture_key;

DROP TABLE account;
DROP TABLE purchase;
DROP TABLE purchase_status;
DROP TABLE sold_product;
DROP TABLE product;
DROP TABLE size;
DROP TABLE colour;
DROP TABLE category;
DROP TABLE picture;

DROP DOMAIN alphanum;