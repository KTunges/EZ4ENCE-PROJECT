-- =============================================
-- EZ4ENCE E-Commerce Database Schema
-- Generated for PostgreSQL
-- =============================================

-- ENUM Types
DO $$ BEGIN
    CREATE TYPE role AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE orderstatus AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE paymentmethod AS ENUM ('COD', 'PAYPAL', 'VNPAY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE paymentstatus AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Table: categories
CREATE TABLE categories (
	id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	slug VARCHAR NOT NULL, 
	description VARCHAR, 
	image VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (name)
);

-- Table: users
CREATE TABLE users (
	id VARCHAR NOT NULL, 
	email VARCHAR NOT NULL, 
	password VARCHAR NOT NULL, 
	full_name VARCHAR, 
	phone VARCHAR, 
	avatar VARCHAR, 
	role role NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id)
);

-- Table: addresses
CREATE TABLE addresses (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	full_name VARCHAR NOT NULL, 
	phone VARCHAR NOT NULL, 
	address_line VARCHAR NOT NULL, 
	ward VARCHAR, 
	district VARCHAR NOT NULL, 
	city VARCHAR NOT NULL, 
	is_default BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

-- Table: products
CREATE TABLE products (
	id VARCHAR NOT NULL, 
	name VARCHAR NOT NULL, 
	slug VARCHAR NOT NULL, 
	description VARCHAR, 
	price FLOAT NOT NULL, 
	discount_price FLOAT, 
	stock INTEGER NOT NULL, 
	images JSON NOT NULL, 
	category_id VARCHAR, 
	is_published BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(category_id) REFERENCES categories (id)
);

-- Table: carts
CREATE TABLE carts (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES users (id)
);

-- Table: cart_items
CREATE TABLE cart_items (
	id VARCHAR NOT NULL, 
	cart_id VARCHAR NOT NULL, 
	product_id VARCHAR NOT NULL, 
	quantity INTEGER NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cart_id) REFERENCES carts (id), 
	FOREIGN KEY(product_id) REFERENCES products (id)
);

-- Table: orders
CREATE TABLE orders (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	address_id VARCHAR NOT NULL, 
	status orderstatus NOT NULL, 
	payment_method paymentmethod NOT NULL, 
	payment_status paymentstatus NOT NULL, 
	total_amount FLOAT NOT NULL, 
	shipping_fee FLOAT NOT NULL, 
	note VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(address_id) REFERENCES addresses (id)
);

-- Table: order_items
CREATE TABLE order_items (
	id VARCHAR NOT NULL, 
	order_id VARCHAR NOT NULL, 
	product_id VARCHAR NOT NULL, 
	product_name VARCHAR NOT NULL, 
	product_price FLOAT NOT NULL, 
	quantity INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES orders (id), 
	FOREIGN KEY(product_id) REFERENCES products (id)
);

-- Table: reviews
CREATE TABLE reviews (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	product_id VARCHAR NOT NULL, 
	rating INTEGER NOT NULL, 
	comment VARCHAR, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(product_id) REFERENCES products (id)
);

-- Table: wishlist_items
CREATE TABLE wishlist_items (
	id VARCHAR NOT NULL, 
	user_id VARCHAR NOT NULL, 
	product_id VARCHAR NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(product_id) REFERENCES products (id)
);

-- =============================================
-- Schema generation complete!
-- =============================================