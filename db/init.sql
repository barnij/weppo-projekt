SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE DOMAIN alphanum as varchar(30) check (value ~ '^[A-Z0-9]+$');

CREATE TABLE user (
  id serial NOT NULL,
  username alphanum NOT NULL,
  passwd text NOT NULL,
  last_login timestamp
);

CREATE TABLE order (
  id serial NOT NULL,
  userid integer NOT NULL,
  status integer NOT NULL
);

CREATE TABLE order_status (
  id serial NOT NULL,
  description text 
);

CREATE TABLE sold_product (
  order_id integer NOT NULL,
  product_id integer NOT NULL,
  amount integer NOT NULL,
);

CREATE TABLE product (
  id serial NOT NULL,
  price money NOT NULL,
  name text NOT NULL,
  size integer,
  colour integer,
  amount integer NOT NULL,
  status boolean NOT NULL,
  description text,
  category integer
);

CREATE TABLE size (
  id serial NOT NULL,
  description text
);

CREATE TABLE colour (
  id serial NOT NULL,
  description text
);

CREATE TABLE category (
  id serial NOT NULL,
  description text
);

CREATE TABLE picture (
  id serial NOT NULL,
  product integer NOT NULL,
  filepath text NOT NULL
);

ALTER TABLE ONLY user
  ADD CONSTRAINT user_key PRIMARY KEY (id);

ALTER TABLE ONLY order 
  ADD CONSTRAINT order_key PRIMARY KEY (id);

ALTER TABLE ONLY order_status
  ADD CONSTRAINT order_status_key PRIMARY KEY (id);

ALTER TABLE ONLY sold_product
  ADD CONSTRAINT sold_product_key PRIMARY KEY (order_id, product_id);

ALTER TABLE ONLY product
  ADD CONSTRAINT product_key PRIMARY KEY (id);

ALTER TABLE ONLY size
  ADD CONSTRAINT size_key PRIMARY KEY (id);

ALTER TABLE ONLY colour
  ADD CONSTRAINT colour_key PRIMARY KEY (id);

ALTER TABLE ONLY category
  ADD CONSTRAINT category_key PRIMARY KEY (id);

ALTER TABLE ONLY picture
  ADD CONSTRAINT picture_key PRIMARY KEY (id);

ALTER TABLE ONLY order
    ADD CONSTRAINT fk_order FOREIGN KEY (userid) REFERENCES user(id) DEFERRABLE;

ALTER TABLE ONLY sold_product
    ADD CONSTRAINT fk_sold_product_order FOREIGN KEY (order_id) REFERENCES order(id) DEFERRABLE;

ALTER TABLE ONLY sold_product
    ADD CONSTRAINT fk_sold_product_prod FOREIGN KEY (product_id) REFERENCES product(id) DEFERRABLE;

ALTER TABLE ONLY product
    ADD CONSTRAINT fk_product_size FOREIGN KEY (size) REFERENCES size(id) DEFERRABLE;

ALTER TABLE ONLY product
    ADD CONSTRAINT fk_product_colour FOREIGN KEY (colour) REFERENCES colour(id) DEFERRABLE;

ALTER TABLE ONLY product
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category) REFERENCES category(id) DEFERRABLE;

ALTER TABLE ONLY picture
    ADD CONSTRAINT fk_picture FOREIGN KEY (product) REFERENCES product(id) DEFERRABLE;