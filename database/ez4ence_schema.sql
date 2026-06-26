--
-- PostgreSQL database dump
--

\restrict uA2vChlpAMF3oRfMX4dA8ytwU1dUYnVGEdV6bIanbugemVswDlXtcTDD9njTK9J

-- Dumped from database version 18.3 (Postgres.app)
-- Dumped by pg_dump version 18.3 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: orderstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orderstatus AS ENUM (
    'PENDING',
    'CONFIRMED',
    'SHIPPING',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.orderstatus OWNER TO postgres;

--
-- Name: paymentmethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.paymentmethod AS ENUM (
    'COD',
    'PAYPAL',
    'VNPAY'
);


ALTER TYPE public.paymentmethod OWNER TO postgres;

--
-- Name: paymentstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.paymentstatus AS ENUM (
    'UNPAID',
    'PAID',
    'REFUNDED'
);


ALTER TYPE public.paymentstatus OWNER TO postgres;

--
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.role OWNER TO postgres;

--
-- Name: senderenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.senderenum AS ENUM (
    'CUSTOMER',
    'ADMIN'
);


ALTER TYPE public.senderenum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    full_name character varying NOT NULL,
    phone character varying NOT NULL,
    address_line character varying NOT NULL,
    ward character varying,
    district character varying NOT NULL,
    city character varying NOT NULL,
    is_default boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    province_id integer,
    district_id integer,
    ward_code character varying
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banners (
    id character varying NOT NULL,
    title character varying NOT NULL,
    image_url character varying NOT NULL,
    link_url character varying,
    "position" character varying NOT NULL,
    is_active boolean NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.banners OWNER TO postgres;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id character varying NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying,
    logo_url character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id character varying NOT NULL,
    cart_id character varying NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sku_id character varying NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id character varying NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying,
    image character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    parent_id character varying
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    session_id integer NOT NULL,
    sender public.senderenum NOT NULL,
    content text,
    is_read boolean,
    created_at timestamp with time zone,
    image_url character varying(255)
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_messages_id_seq OWNER TO postgres;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: chat_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_sessions (
    id integer NOT NULL,
    client_id character varying(255) NOT NULL,
    user_id character varying,
    customer_name character varying(100),
    customer_email character varying(255),
    is_active boolean,
    unread_count integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.chat_sessions OWNER TO postgres;

--
-- Name: chat_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_sessions_id_seq OWNER TO postgres;

--
-- Name: chat_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_sessions_id_seq OWNED BY public.chat_sessions.id;


--
-- Name: compatibility_overrides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.compatibility_overrides (
    id character varying NOT NULL,
    product_id_1 character varying NOT NULL,
    product_id_2 character varying NOT NULL,
    is_compatible boolean NOT NULL,
    note character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.compatibility_overrides OWNER TO postgres;

--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id character varying NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    summary text,
    content text NOT NULL,
    image_url character varying,
    category character varying,
    is_active boolean NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id character varying NOT NULL,
    order_id character varying NOT NULL,
    product_name character varying NOT NULL,
    quantity integer NOT NULL,
    sku_id character varying NOT NULL,
    sku_code character varying NOT NULL,
    price_at_purchase double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    id character varying NOT NULL,
    order_id character varying NOT NULL,
    status public.orderstatus NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_status_history OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    address_id character varying NOT NULL,
    status public.orderstatus NOT NULL,
    payment_method public.paymentmethod NOT NULL,
    payment_status public.paymentstatus NOT NULL,
    payment_transaction_id character varying,
    total_amount double precision NOT NULL,
    shipping_fee double precision NOT NULL,
    note character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    promotion_id character varying,
    discount_amount double precision NOT NULL,
    shipping_provider character varying
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id character varying NOT NULL,
    product_id character varying NOT NULL,
    url character varying NOT NULL,
    alt_text character varying,
    is_primary boolean NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- Name: product_skus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_skus (
    id character varying NOT NULL,
    product_id character varying NOT NULL,
    sku_code character varying NOT NULL,
    price double precision NOT NULL,
    promotional_price double precision,
    stock_quantity integer NOT NULL,
    attributes json NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_skus OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id character varying NOT NULL,
    name character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying,
    category_id character varying,
    is_published boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    brand_id character varying,
    specifications json NOT NULL,
    sold_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: promotions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotions (
    id character varying NOT NULL,
    code character varying NOT NULL,
    discount_percent double precision,
    discount_amount double precision,
    min_order_value double precision NOT NULL,
    expiration_date timestamp with time zone,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotions OWNER TO postgres;

--
-- Name: review_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_images (
    id character varying NOT NULL,
    review_id character varying NOT NULL,
    url character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.review_images OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    rating integer NOT NULL,
    comment character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sku_id character varying NOT NULL,
    admin_reply text,
    is_hidden boolean DEFAULT false
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sku_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sku_images (
    id character varying NOT NULL,
    sku_id character varying NOT NULL,
    url character varying NOT NULL,
    alt_text character varying,
    is_primary boolean NOT NULL
);


ALTER TABLE public.sku_images OWNER TO postgres;

--
-- Name: stock_receipt_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_receipt_items (
    id character varying NOT NULL,
    receipt_id character varying NOT NULL,
    sku_id character varying NOT NULL,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    total_price double precision NOT NULL
);


ALTER TABLE public.stock_receipt_items OWNER TO postgres;

--
-- Name: stock_receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_receipts (
    id character varying NOT NULL,
    receipt_code character varying NOT NULL,
    type character varying NOT NULL,
    supplier_id character varying,
    total_amount double precision NOT NULL,
    note text,
    created_by character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stock_receipts OWNER TO postgres;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id character varying NOT NULL,
    name character varying NOT NULL,
    contact_name character varying,
    phone character varying,
    email character varying,
    address text,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying,
    password character varying NOT NULL,
    full_name character varying,
    phone character varying,
    avatar character varying,
    role public.role NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    staff_role character varying,
    username character varying,
    is_email_verified boolean DEFAULT false NOT NULL,
    provider character varying DEFAULT 'LOCAL'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist_items (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sku_id character varying NOT NULL
);


ALTER TABLE public.wishlist_items OWNER TO postgres;

--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: chat_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions ALTER COLUMN id SET DEFAULT nextval('public.chat_sessions_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: brands brands_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_name_key UNIQUE (name);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chat_sessions chat_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_pkey PRIMARY KEY (id);


--
-- Name: compatibility_overrides compatibility_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compatibility_overrides
    ADD CONSTRAINT compatibility_overrides_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: product_skus product_skus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_skus
    ADD CONSTRAINT product_skus_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: review_images review_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sku_images sku_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_images
    ADD CONSTRAINT sku_images_pkey PRIMARY KEY (id);


--
-- Name: stock_receipt_items stock_receipt_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_receipt_items
    ADD CONSTRAINT stock_receipt_items_pkey PRIMARY KEY (id);


--
-- Name: stock_receipts stock_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_receipts
    ADD CONSTRAINT stock_receipts_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: ix_addresses_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_addresses_id ON public.addresses USING btree (id);


--
-- Name: ix_banners_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_banners_id ON public.banners USING btree (id);


--
-- Name: ix_brands_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_brands_id ON public.brands USING btree (id);


--
-- Name: ix_brands_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_brands_slug ON public.brands USING btree (slug);


--
-- Name: ix_cart_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_cart_items_id ON public.cart_items USING btree (id);


--
-- Name: ix_carts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_carts_id ON public.carts USING btree (id);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_categories_slug ON public.categories USING btree (slug);


--
-- Name: ix_chat_messages_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_chat_messages_id ON public.chat_messages USING btree (id);


--
-- Name: ix_chat_sessions_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_chat_sessions_client_id ON public.chat_sessions USING btree (client_id);


--
-- Name: ix_chat_sessions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_chat_sessions_id ON public.chat_sessions USING btree (id);


--
-- Name: ix_compatibility_overrides_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_compatibility_overrides_id ON public.compatibility_overrides USING btree (id);


--
-- Name: ix_news_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_news_id ON public.news USING btree (id);


--
-- Name: ix_news_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_news_slug ON public.news USING btree (slug);


--
-- Name: ix_order_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_items_id ON public.order_items USING btree (id);


--
-- Name: ix_order_status_history_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_status_history_id ON public.order_status_history USING btree (id);


--
-- Name: ix_orders_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_orders_id ON public.orders USING btree (id);


--
-- Name: ix_product_images_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_product_images_id ON public.product_images USING btree (id);


--
-- Name: ix_product_skus_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_product_skus_id ON public.product_skus USING btree (id);


--
-- Name: ix_product_skus_sku_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_product_skus_sku_code ON public.product_skus USING btree (sku_code);


--
-- Name: ix_products_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_id ON public.products USING btree (id);


--
-- Name: ix_products_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_products_slug ON public.products USING btree (slug);


--
-- Name: ix_promotions_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_promotions_code ON public.promotions USING btree (code);


--
-- Name: ix_promotions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_promotions_id ON public.promotions USING btree (id);


--
-- Name: ix_review_images_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_review_images_id ON public.review_images USING btree (id);


--
-- Name: ix_reviews_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_reviews_id ON public.reviews USING btree (id);


--
-- Name: ix_sku_images_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_sku_images_id ON public.sku_images USING btree (id);


--
-- Name: ix_stock_receipt_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_stock_receipt_items_id ON public.stock_receipt_items USING btree (id);


--
-- Name: ix_stock_receipts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_stock_receipts_id ON public.stock_receipts USING btree (id);


--
-- Name: ix_stock_receipts_receipt_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_stock_receipts_receipt_code ON public.stock_receipts USING btree (receipt_code);


--
-- Name: ix_suppliers_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_suppliers_id ON public.suppliers USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: ix_wishlist_items_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_wishlist_items_id ON public.wishlist_items USING btree (id);


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: cart_items cart_items_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: chat_messages chat_messages_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.chat_sessions(id) ON DELETE CASCADE;


--
-- Name: chat_sessions chat_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_sessions
    ADD CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: compatibility_overrides compatibility_overrides_product_id_1_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compatibility_overrides
    ADD CONSTRAINT compatibility_overrides_product_id_1_fkey FOREIGN KEY (product_id_1) REFERENCES public.products(id);


--
-- Name: compatibility_overrides compatibility_overrides_product_id_2_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.compatibility_overrides
    ADD CONSTRAINT compatibility_overrides_product_id_2_fkey FOREIGN KEY (product_id_2) REFERENCES public.products(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: order_status_history order_status_history_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: orders orders_promotion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_promotion_id_fkey FOREIGN KEY (promotion_id) REFERENCES public.promotions(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: product_skus product_skus_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_skus
    ADD CONSTRAINT product_skus_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: review_images review_images_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id);


--
-- Name: reviews reviews_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sku_images sku_images_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sku_images
    ADD CONSTRAINT sku_images_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: stock_receipt_items stock_receipt_items_receipt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_receipt_items
    ADD CONSTRAINT stock_receipt_items_receipt_id_fkey FOREIGN KEY (receipt_id) REFERENCES public.stock_receipts(id);


--
-- Name: stock_receipt_items stock_receipt_items_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_receipt_items
    ADD CONSTRAINT stock_receipt_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: stock_receipts stock_receipts_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_receipts
    ADD CONSTRAINT stock_receipts_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: wishlist_items wishlist_items_sku_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES public.product_skus(id);


--
-- Name: wishlist_items wishlist_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict uA2vChlpAMF3oRfMX4dA8ytwU1dUYnVGEdV6bIanbugemVswDlXtcTDD9njTK9J

