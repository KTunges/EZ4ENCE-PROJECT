--
-- PostgreSQL database dump
--

\restrict ZFZdAT3VKEyI8HRxdAx05dqgmj8hTKJ2dzqetoXLwOhg8UI9OIYfCw2gcAijpgs

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
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, user_id, full_name, phone, address_line, ward, district, city, is_default, created_at, updated_at, province_id, district_id, ward_code) FROM stdin;
d0c816d5-1f71-4cc6-bf75-a8d5d4351fba	662b1cd3-dbf4-4d88-acf9-fa0749b000d0	Test Name	0123456789	123 Test St	Ward 1	District 1	Ho Chi Minh	f	2026-06-17 18:35:58.390605+07	2026-06-17 18:35:58.390605+07	79	760	26734
939e76cb-992e-4655-922c-d70e76d6d3ef	5d9f851d-dc99-4bdc-8f48-35f154bd4642	Nguyễn Kim Tùng	0353835577	588/50 Tỉnh lộ 10	Phường Bình Trị Đông B	Quận Bình Tân	Hồ Chí Minh	f	2026-06-17 18:36:42.968487+07	2026-06-19 14:00:23.085317+07	\N	\N	\N
c1ab6478-6998-4416-928c-762052db54f6	5d9f851d-dc99-4bdc-8f48-35f154bd4642	Nguyễn Kim Tùng	0353835576	588/50 Tỉnh lộ 10	Phường Bình Trị Đông B	Quận Bình Tân	Hồ Chí Minh	t	2026-06-17 18:36:42.913244+07	2026-06-19 14:00:23.085317+07	202	1458	21908
0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	54664a35-d7b7-47ca-a380-cc2ae6a9e862	Huỳnh Xuân Linh	0965831809	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
0ed45a42-6327-497c-b79a-da2a5f0ffc32	51fb37d6-a1ea-4ee8-9579-08661539d327	Hoàng Hữu Phong	0927295344	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
4acdb2a0-e2d0-4001-8183-9433dc78c8a7	00e2ab3a-4e07-41a8-9667-6908486c983f	Lý Hải Tâm	0990655139	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
44244090-d7f5-4454-9239-68d535999781	48086f9d-9440-449b-9047-186cb5da6f0f	Phan Đức Phong	0919740086	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
8ed1654e-f19f-4b41-bdb4-545683bd9d4c	f666787a-c092-495e-882b-71680be7276a	Nguyễn Hoàng Hải	0944395264	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
53e8ff5c-b880-4b57-bfc3-04db1c5870f6	15550699-3c15-4611-8ab0-819e4dbbd4be	Huỳnh Xuân Châu	0975172902	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
d171a46a-e3b7-4cbf-a0d5-9a465cfc16ee	c892a72f-7962-47db-a4d0-345461ef316f	Nguyễn Văn Linh	0986715821	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
8282a925-5490-4cfe-a726-86cc0846ce22	7ef618fc-4aea-488f-83eb-ff6673688916	Đỗ Minh Oanh	0923954194	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
88744b11-3383-4158-8119-1af01c2c82a2	6d1849b0-a680-4b82-8c20-2fef553a3c35	Lê Tuấn Châu	0942009414	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
e74340da-8e6b-4954-8317-1be97721a64e	d2d8c4d9-af31-4102-af4e-fcf0b91885ab	Đặng Thị Sơn	0978948241	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
05e69232-0a9c-4801-addc-9c8e1b328907	c654bd54-f3da-4ac9-8d8f-399ea2de06a9	Vũ Xuân Khánh	0924630393	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
cb646f99-cc69-4605-b411-21443ac97531	10a8bd2b-cbad-4de4-9c54-6054c558e047	Phan Minh Vân	0921440358	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
6a3637ed-6cf3-41cc-bd21-13523eb75e7a	63b0379a-7608-42c1-9ccc-5861337f9473	Nguyễn Tuấn Châu	0947268977	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
0a6585c8-404f-43ca-8fad-205fdae51325	8b9b0724-8d15-48e7-8465-e1ae3e2d625c	Vũ Tuấn Yến	0920788619	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
9d128a5e-0be2-4fdc-b599-462817569f74	f1fcf118-37f4-45ce-b44c-ee70f694535f	Hồ Xuân Vân	0964539297	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
803eb945-9e59-4700-b6f7-cbf81a62666b	06f64d50-a4de-4876-bfa0-839c64540eed	Hoàng Tuấn Nam	0985688579	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
a8666abc-4a0e-4a71-996f-db7883351ec4	637c516b-f30a-46c7-bb6d-855016d4da84	Lý Minh Phương	0997677001	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
8bf63e43-6c4b-41dd-bda8-e64ebd982e36	8d3cdbd8-41e9-40d9-be4b-f866ef1de910	Huỳnh Đức Linh	0977283552	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
8f77ef2e-9329-48a4-8288-881636bb2959	81366434-e5cb-4bd3-90a4-7ad68cd85836	Đỗ Quang Linh	0997790788	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
d5d96109-9349-4f34-b646-143c5a30c427	5a4ff4c2-1bf2-4148-a789-6010e6ced4fe	Võ Quang Quân	0949443587	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	\N
f15d6a96-8944-49f8-b778-0ebc82c40ced	c86c4f6a-9868-4c21-b6d9-ec6d558373da	Lê Quang Uyên	0989696076	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
cd41e729-7571-4179-9a30-aaa1f97b78eb	2b426ae4-21c8-46de-ab4a-9a3e5d38c376	Bùi Hải Tâm	0977371503	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
63249c88-9baf-4cde-9601-f82578135e6e	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	Dương Hoàng Dũng	0923067026	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
f16f1103-aff8-40e8-b242-e5185b5e7cde	292ae0da-38e8-4f6b-ab48-f6e33069a3ce	Nguyễn Xuân Châu	0939602693	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
54d8e9da-b991-4e3c-96d8-14adfd3f1576	a9a9dce7-d12e-416b-b95d-f8d0b878e5a3	Huỳnh Minh Hải	0945046778	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
d9fc82e6-1982-4548-8e80-020e86c40e74	7d04da9b-ef68-4f38-af0c-46300b51de79	Lê Đức Minh	0955354084	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
7b978ba1-a274-42fa-89e7-059adb2ff152	93556805-fdab-45e1-9be6-e47684eec120	Đặng Hữu Oanh	0991254983	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
5a489ce2-75ca-4fdc-8e15-d183f2ddd6a2	626b7614-6d6e-4c9b-a10f-7fd2b837422f	Phan Đức Quân	0922935065	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
b414d319-e839-4978-a619-cea4811c566e	cc19e280-d5c7-4616-a117-ca29341ea383	Đỗ Tuấn Anh	0986317213	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
b3e3d898-5ac4-4efa-a8e6-313f762e83f1	68b21c3a-04e9-495e-926c-a460ff4de48b	Đặng Hoàng Anh	0951834646	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
4593ee48-4dea-4b6b-b8a3-fc5d912374d6	28fe64c6-5d2f-47a8-8014-632f76cac6c6	Đặng Thanh Châu	0995369533	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
9407380b-8487-44f0-8caa-cce4c9b9f231	1b94e300-e05d-411e-a90a-49e4dbe9470e	Lê Ngọc Phương	0985537650	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
1540f746-0a64-4542-a019-df099ec2afcc	300bfb37-10ee-421b-bd97-7e6dfc8c9689	Đặng Quang Long	0934306410	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
52a71950-e389-429f-8895-3cd5fc2ba65a	87a3416a-2f28-4cd5-acfa-74ebdc0774a5	Hồ Văn Tâm	0979031033	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
3d7c401e-3ca1-4b85-ae19-aa7324315881	68fd3c58-bfb6-4cd8-ad59-02d3568c249a	Dương Hoàng Long	0927825792	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
157fecc1-b935-411b-9f13-038265f12130	79a1ee4a-f0b3-4555-b652-943bfd259924	Hoàng Minh Long	0995364167	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
72e82dc2-b5b0-4656-a98c-f9f8f15b5e0e	2464a8eb-d330-490d-9a72-64469e478654	Phạm Thị Bình	0985276449	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
f5a847ff-a9de-48e0-9f2f-f720772817b6	8884b7ed-21b9-40de-9f2a-b52fe6078c31	Võ Văn Tâm	0926796590	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
6d65833e-4fd6-43cd-b9d0-024f3fdc59bf	5f222848-9f66-44eb-a46a-26bd4b138164	Trần Quang Sơn	0932315723	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
2a6d2b45-9f28-4a0e-bc98-58dfdd764637	6d7d98d9-ac6c-48ed-bf4d-dc0d0dd172a9	Hoàng Thị Hải	0965382698	123 Nguyễn Văn Cừ	Phường 4	Quận 5	Hồ Chí Minh	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	\N
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
abed78f2d91f
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banners (id, title, image_url, link_url, "position", is_active, start_date, end_date, created_at, updated_at) FROM stdin;
c9009b11-7b8c-4cc9-9785-12dee204f79b	Bento Main 2	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80	/products	bento_main	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
dd6d8f7c-b520-4611-b975-f5766e54ecc9	Bento Main 3	https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80	/products	bento_main	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
9a9edd06-b2e8-4b1e-b264-9f9293c91171	Bento Side 1	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80	/products?category=pc	bento_side	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
00ace203-fcbc-45e2-8966-10d7bebca456	Bento Side 2	https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80	/products?category=ban-phim	bento_side	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
17a88d3d-8ed1-4180-8d27-c7738f4479df	Bento Bottom 1	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80	/products?category=laptop	bento_bottom	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
af1acace-9c13-4440-94fc-bec36b7de478	Bento Bottom 3	https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80	/products?category=pc-gaming	bento_bottom	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
152cf3d4-e448-4405-9e49-62fddaca93d9	SETUP MƠ ƯỚC	https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80	/products	home_middle	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
75f0d358-9b20-4094-925d-94f123ee944e	BÙNG NỔ ƯU ĐÃI	https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1920&q=80	/products	home_bottom	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-15 23:07:49.62999+07
8f8cc61b-94fc-4b22-b7e0-b0c99898b7f9	Bento Main 1	https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80	/products	bento_main	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-23 18:27:22.839992+07
32106083-23d0-4d15-afaf-a9a0bcaf7c27	Bento Bottom 2	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80	/products?category=laptop-office	bento_bottom	t	\N	\N	2026-06-15 23:07:49.62999+07	2026-06-23 18:27:44.938561+07
a37cd143-46f3-4e67-9201-ea84bc5839ff	Hehe	https://res.cloudinary.com/dtbbbq4zr/image/upload/v1782380059/ez4gear/products/whgwna4drfocmq14jedq.jpg		sidebar_bottom	t	\N	\N	2026-06-25 16:35:03.064631+07	2026-06-25 16:35:03.064631+07
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name, slug, description, logo_url, created_at, updated_at) FROM stdin;
5da698cc-6b22-4eff-9493-e619bdbd387a	Logitech	logitech			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
ae145fd2-c6e9-4841-88e3-03bac25c3b56	Razer	razer			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
f75e0e15-034d-4e21-adbb-10f75685a10f	Akko	akko			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
d35a1862-b253-4855-bc3f-05282e96ea67	HyperX	hyperx			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
69f7c933-4f05-4b6f-8a73-6ad04ebbd774	Harman Kardon	harman-kardon			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
6341491c-f795-4096-8ed1-13519a1f3b1a	Lian Li	lian-li			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
7a594ee7-5656-4318-954c-e85481663b61	Wooting	wooting			2026-06-16 20:57:25.300471+07	2026-06-16 20:57:25.300471+07
0eacc349-0eb7-44be-a970-310b68cbe645	Asus	asus	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
c63a919f-5938-460c-9b8b-e90cd66b1291	MSI	msi	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
7a508659-0944-40ea-8cb7-bf5d76c797bc	Corsair	corsair	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
ecf34ee3-0789-400f-afe8-31a1da50d924	Lenovo	lenovo	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
c837f719-42b5-4e28-b7e2-dc0e1bc25058	Acer	acer	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
68c582d5-cfdf-4d5d-9c28-d3f4eac3a614	Dell	dell	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
48de0310-95de-4e8f-b185-ecd3f1334799	HP	hp	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
69669bfa-bf86-496f-84f0-ef8b6d212c21	Apple	apple	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
b08bb8ef-402c-44e1-beb9-65f279d3b61b	NZXT	nzxt	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
22fcd678-380c-4698-8fd5-e4ec1b8b1017	Deepcool	deepcool	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
31bffa70-e26f-4965-941b-cb4b3021502b	SteelSeries	steelseries	\N		2026-06-15 14:37:04.269867+07	2026-06-15 14:37:04.269867+07
24e65b24-31af-4915-882c-e8116fb33c99	Intel	intel	\N		2026-06-15 14:37:04.273939+07	2026-06-15 14:37:04.273939+07
66a0211c-8bfa-4dd2-8583-dfd87f7da2e2	AMD	amd	\N		2026-06-15 14:37:04.273939+07	2026-06-15 14:37:04.273939+07
b951edf0-37c6-4c24-916f-c5705f71044d	Gigabyte	gigabyte	\N		2026-06-15 14:37:04.273939+07	2026-06-15 14:37:04.273939+07
d09748d1-9c9d-4f1b-b8ff-b867fb402d25	Samsung	samsung	\N		2026-06-15 14:37:04.273939+07	2026-06-15 14:37:04.273939+07
2c8f9a39-2506-42c5-ba51-bf7348fc419a	NVIDIA	nvidia-2c8f9a39	Thương hiệu NVIDIA	\N	2026-06-15 22:01:08.256719+07	2026-06-15 22:01:08.256719+07
c308ee69-36f0-44c9-b0de-220f9bb2e5a4	Kingston	kingston-c308ee69	Thương hiệu Kingston	\N	2026-06-15 22:01:08.256719+07	2026-06-15 22:01:08.256719+07
6ab7f06c-973f-473e-b235-9444d921b1de	EZ4GEAR	ez4gear	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e9ad9c15-3f10-4677-8959-24476a51a013	Sapphire	sapphire	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
386657d6-e73d-436b-83c9-70824abe69fc	G.Skill	gskill	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c0b71f50-61d3-418f-b37a-7ff7d4977866	Western Digital	western-digital	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
30348ea9-f264-4d73-ac89-3ae528197770	Seagate	seagate	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
55165d01-912a-4323-8d70-68f9c112ef54	Lianli	lianli	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c3e84be6-e1ab-429f-9de3-3ebeb04da941	LG	lg	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
21b7d1a4-c6c0-4036-852a-3afdfd9ddbcf	Keychron	keychron	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0e1acd24-767e-497e-8245-6d6e210bace2	Pulsar	pulsar	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b61c738a-b956-4deb-be14-957fed2c2673	Zowie	zowie	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
96a73eb3-dc24-4fc7-a04a-c920f68539c0	Artisan	artisan	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d2a21452-a924-435f-9645-9746ba819325	Sony	sony	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
7c1ec210-f9e0-4c3e-af7a-3d87b024c65c	Edifier	edifier	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
aa0c8028-9c69-452c-89c8-3af703befee3	Creative	creative	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
82584494-0c52-4369-8ccd-a613e77a7282	JBL	jbl	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
bf1bff8c-edff-4549-a6f9-6809ba28ebf7	Elgato	elgato	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
70c10e0d-a92b-40b2-b673-0bf6caec432d	TP-Link	tp-link	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b2b6d331-a1c5-4ef3-a89a-cc9ea26c0656	Microsoft	microsoft	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0654191f-2d5d-4055-b5d8-9d4b4a30ba54	Kaspersky	kaspersky	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0eb6fb50-6b46-4c05-8eba-ac38636e3d88	Adobe	adobe	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ad12bc79-c2b5-4778-8b99-8f3876c672d9	Nintendo	nintendo	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
35aa2119-763b-4a60-8d61-7ac2f979b6cc	Valve	valve	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e241897d-3ab2-4aef-91ca-e3a6d02dfa80	Thrustmaster	thrustmaster	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
4f72dcdc-033e-4dff-8299-58b061dfb2ff	Cooler Master	cooler-master	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
abe88bae-b775-4e41-a63c-61aae671041e	Anker	anker	\N	\N	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, cart_id, quantity, created_at, sku_id) FROM stdin;
c523d6d6-9a58-4655-ab3b-1032b57b33ab	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.295927+07	30754f2a-443b-474c-be38-465b92b7a07f
71d9e083-61b1-4115-bb91-1aaa9763ea2f	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.295743+07	78a2e491-51cf-4543-8232-d0c5381ec236
d5ae6117-7a5f-4154-9130-8aaf17a02550	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.297826+07	d3be33d4-bf09-47a1-9397-bb7d39e9a9fc
3c3d92b7-b224-4a56-ba05-68ec31ecb0c9	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.29847+07	9d0ab46f-49f5-488d-a465-3573bcecfa84
28e4eff5-6f73-4fa7-9797-0d09bb0f161f	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.331607+07	b680f7d0-50ef-4dcd-ae7f-4377e8060ee9
2cb16562-32cf-446d-a373-4a67fbeb9c30	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.332538+07	a90ca3cc-9e1c-47a9-b468-73feac4c178e
b444bf25-9653-4c23-9408-168910f70845	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.4494+07	e568031c-83fc-4aee-aca3-8754733254ec
ad3ea771-986a-4ebb-8da5-eddf3cc40164	71871c02-24fc-42c0-990a-2254e0e636b0	1	2026-07-02 14:16:02.449557+07	846271dc-fe28-4bb7-98f5-27c656af006a
9eb78a41-93d1-443a-b81a-b45b37ef6652	71871c02-24fc-42c0-990a-2254e0e636b0	2	2026-07-02 14:18:37.660813+07	b376e183-80ba-465a-a979-2f21ed2db366
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, user_id, created_at, updated_at) FROM stdin;
5391565a-0028-4b75-8ab2-0e3b9233276d	5d9f851d-dc99-4bdc-8f48-35f154bd4642	2026-06-17 18:23:17.271687+07	2026-06-17 18:23:17.271687+07
4094d00b-ac51-4ccb-a66e-2f356eedece2	662b1cd3-dbf4-4d88-acf9-fa0749b000d0	2026-06-17 18:30:52.64927+07	2026-06-17 18:30:52.64927+07
461984a1-4b14-4c26-8233-6b5a6aefe387	3602e7b1-364c-4693-9293-9a4a69f27406	2026-06-17 21:49:28.177911+07	2026-06-17 21:49:28.177911+07
71871c02-24fc-42c0-990a-2254e0e636b0	33654608-deb1-454e-b9d5-963ca9cc9478	2026-06-23 18:38:33.114821+07	2026-06-23 18:38:33.114821+07
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, description, image, created_at, updated_at, parent_id) FROM stdin;
9ae4a892-6898-469f-9596-969e024ecad3	Laptop Gaming	laptop-gaming	Laptop chơi game hiệu năng cao		2026-06-15 14:37:04.263897+07	2026-06-15 14:37:04.263897+07	\N
c1923d9a-740e-4808-aa7e-87fd429e990a	Tai Nghe	tai-nghe	Tai nghe gaming, studio		2026-06-15 14:37:04.263897+07	2026-06-15 14:37:04.263897+07	\N
f13dc502-a309-4021-89e0-f4276458635d	Laptop	laptop	Laptops văn phòng, mỏng nhẹ, doanh nhân		2026-06-15 14:37:04.263897+07	2026-06-15 14:37:04.263897+07	\N
37d6ca80-0f3d-4ac9-8855-3ebe7802e142	Chuột	chuot	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
a786829f-bbe9-4999-ba60-8109dce5ad19	Lót chuột	lot-chuot	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
f9d29f85-1c8d-4439-b277-82fabd5f03ba	Loa	loa	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
17b32335-4570-41fd-9070-726482b5ef7c	Webcam	webcam	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
2a4a25f6-12b0-439e-9bca-1ce03ba4894c	Microphone	microphone	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
b884bf3c-f5b7-48b8-985e-95cb6043779c	Dịch vụ	dich-vu	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-16 23:15:40.682583+07	\N
00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a	Vỏ Máy Tính	vo-may-tinh	Danh mục Vỏ Máy Tính	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
05ced308-c726-4003-820d-c8359e025afc	Bàn phím	ban-phim	Bàn phím cơ và văn phòng		2026-06-15 14:37:04.263897+07	2026-06-25 14:45:26.224686+07	\N
342ca7e2-6ad3-4c6e-82c3-50baac105e49	Nguồn Máy Tính	nguon-may-tinh	Danh mục Nguồn Máy Tính	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
53d9cc06-0378-4bd5-a195-e9dc3a5da902	Ổ Cứng SSD	o-cung-ssd	Danh mục Ổ Cứng SSD	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
56162dc3-558b-489f-9735-c7a27e80f7ac	Bộ Nhớ Trong	bo-nho-trong	Danh mục Bộ Nhớ Trong	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
5d452037-725f-43c6-bbb9-72ceae06bab1	Màn hình	man-hinh	Màn hình máy tính chuyên nghiệp và gaming		2026-06-15 14:37:04.263897+07	2026-06-25 14:45:26.224686+07	\N
64d6f455-8867-43d3-976b-98094d8f16d6	Bộ Vi Xử Lý	bo-vi-xu-ly	Danh mục Bộ Vi Xử Lý	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
80145f50-5772-4aef-b398-3882bc8c04fb	PC EZ4ENCE	pc-ez4ence	Máy tính để bàn lắp ráp sẵn		2026-06-15 14:37:04.263897+07	2026-06-25 14:45:26.224686+07	\N
acce1753-eade-487f-a300-68b45fd325f6	Bo Mạch Chủ	bo-mach-chu	Danh mục Bo Mạch Chủ	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
ad72da4f-d9f0-46d0-bed7-35781dd859f9	Tản nhiệt	tan-nhiet	\N	\N	2026-06-16 23:15:40.682583+07	2026-06-25 14:45:26.224686+07	\N
d08aa7ba-fabc-43f4-9484-141d4f2628db	Card Màn Hình	card-man-hinh	Danh mục Card Màn Hình	\N	2026-06-15 22:01:08.256719+07	2026-06-25 14:45:26.224686+07	\N
e1ab13a9-ec24-4d8a-84d2-25faca94e509	Phụ kiện	phu-kien	Các loại phụ kiện máy tính, giá đỡ, cáp, hub...		2026-06-15 14:37:04.263897+07	2026-06-25 14:45:26.224686+07	\N
65581e2b-d085-4b8e-83d4-7e54b5b53adc	Phần mềm	phan-mem	\N	\N	2026-06-25 14:50:40.989002+07	2026-06-25 15:03:25.623767+07	\N
abcaa950-a125-4727-b161-f2704ddbb2f0	Thiết bị mạng	thiet-bi-mang	\N	\N	2026-06-25 15:03:25.623767+07	2026-06-25 15:03:25.623767+07	\N
07a19984-1dfe-4131-8728-e73aab80213e	Console	console	\N	\N	2026-06-25 14:50:40.989002+07	2026-06-25 14:50:40.989002+07	\N
6e049cfe-f988-4ae7-a9f4-eaa9707d205f	Ghế Gaming	ghe-ban	Ghế Gaming	\N	2026-06-25 15:50:44.742309+07	2026-06-25 15:50:44.742309+07	\N
c1ef3a72-7cc9-40c9-9b0d-8e3eb9a7e312	Handheld	handheld	Handheld	\N	2026-06-25 15:50:44.742309+07	2026-06-25 15:50:44.742309+07	\N
732c14b3-e494-4127-b228-75382745f536	Bàn Gaming	ban-gaming	Bàn Gaming	\N	2026-06-25 15:51:48.313202+07	2026-06-25 15:51:48.313202+07	\N
0bfa8b1a-d442-4fbb-8851-c38f66f3976c	Vi xử lý (CPU)	cpu	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
5f1217ba-6975-419b-9ffe-fd1d299e80e2	Bo mạch chủ (Mainboard)	mainboard	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
8cc76aa8-068a-4c50-affa-a6db717a7cce	Card màn hình (VGA)	vga	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
d007af94-0e7c-46ad-8969-15a01a98853f	RAM	ram	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
491c6cc5-85c9-4721-bee8-5a6d6ade862c	Ổ cứng (SSD/HDD)	storage	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
1881b88f-3170-4bf0-99c7-43e823dec0fc	Nguồn (PSU)	psu	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
88ec268e-03bf-40d6-8f05-28a3675c8789	Vỏ máy tính (Case)	case	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
20c71a91-1c60-49f3-9d32-35e870ca064c	Tản nhiệt	cooler	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
2b3ced0b-dd3d-4079-ae27-c3dcded1d195	Phần mềm, mạng	phan-mem-mang	\N	\N	2026-06-26 14:34:08.307682+07	2026-06-26 14:34:08.307682+07	\N
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, session_id, sender, content, is_read, created_at, image_url) FROM stdin;
2	2	CUSTOMER	hello cưng	f	2026-06-22 14:08:33.57975+07	\N
3	2	CUSTOMER	hi	f	2026-06-22 14:10:31.496239+07	\N
4	2	ADMIN	Hello from admin script	f	2026-06-22 14:34:15.850385+07	\N
5	2	ADMIN	hehe	f	2026-06-22 14:35:39.207437+07	\N
6	2	ADMIN	Chào bạn, EZ4GEAR có thể giúp gì cho bạn?	f	2026-06-22 14:36:03.190324+07	\N
7	2	ADMIN	heheeee	f	2026-06-22 14:36:10.590783+07	\N
8	2	CUSTOMER	đấm nhau không cu	f	2026-06-22 14:37:01.335873+07	\N
9	2	ADMIN	dcmm 5g chiều trước cổng trường	f	2026-06-22 14:37:15.718738+07	\N
10	2	ADMIN	Sản phẩm này hiện đang còn hàng bạn nhé.	f	2026-06-22 14:38:20.180641+07	\N
11	7	CUSTOMER	xin chào	f	2026-07-01 17:14:08.129256+07	\N
12	7	ADMIN	hello	f	2026-07-01 17:14:40.400582+07	\N
13	7	CUSTOMER	tôi muốn biết giá của intel core i5	f	2026-07-01 17:15:17.468665+07	\N
14	7	ADMIN	Xin lỗi, mình đang gặp chút sự cố kỹ thuật. Bạn vui lòng để lại câu hỏi, nhân viên EZ4GEAR sẽ hỗ trợ bạn ngay khi online nhé! 😊	f	2026-07-01 17:15:17.888831+07	\N
15	7	CUSTOMER	hello	f	2026-07-01 17:30:32.004921+07	\N
16	7	ADMIN	hii	f	2026-07-01 17:30:37.034721+07	\N
17	7	CUSTOMER	tôi muốn biết giá của intel core i5	f	2026-07-01 17:30:48.085883+07	\N
18	7	ADMIN	Xin lỗi, hệ thống AI tạm thời chưa được cấu hình. Vui lòng để lại tin nhắn, nhân viên sẽ phản hồi sớm nhất!	f	2026-07-01 17:30:48.09776+07	\N
19	7	CUSTOMER	tôi muốn biết giá của intel core i5	f	2026-07-01 17:31:47.641903+07	\N
20	7	ADMIN	Xin lỗi, hệ thống AI tạm thời chưa được cấu hình. Vui lòng để lại tin nhắn, nhân viên sẽ phản hồi sớm nhất!	f	2026-07-01 17:31:47.65711+07	\N
21	7	CUSTOMER	tôi muốn biết giá của intel core i5	f	2026-07-01 17:33:05.509433+07	\N
22	7	ADMIN	Xin chào! Để biết giá chính xác của Intel Core i5, bạn vui lòng cho tôi biết thế hệ và số nhân của CPU bạn quan tâm (ví dụ: i5-12400, i5-12600K,...) hoặc để lại số điện thoại, nhân viên EZ4GEAR sẽ liên hệ lại với bạn để cung cấp thông tin chi tiết nhất!	f	2026-07-01 17:33:06.367916+07	\N
\.


--
-- Data for Name: chat_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_sessions (id, client_id, user_id, customer_name, customer_email, is_active, unread_count, created_at, updated_at) FROM stdin;
2	5d9f851d-dc99-4bdc-8f48-35f154bd4642	5d9f851d-dc99-4bdc-8f48-35f154bd4642	Kim Tung	kimtung5576@gmail.com	t	0	2026-06-22 14:08:30.189862+07	2026-06-22 14:38:20.175266+07
5	guest_p2ur7um4k	\N	\N	\N	t	0	2026-06-23 18:30:09.584399+07	2026-06-23 18:30:09.584405+07
6	33654608-deb1-454e-b9d5-963ca9cc9478	33654608-deb1-454e-b9d5-963ca9cc9478	Nguyễn Hehe	\N	t	0	2026-06-23 18:38:33.104084+07	2026-06-23 18:38:33.104092+07
7	guest_804q2xvia	\N	\N	\N	t	6	2026-07-01 17:13:12.574442+07	2026-07-01 17:33:05.505489+07
\.


--
-- Data for Name: compatibility_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.compatibility_overrides (id, product_id_1, product_id_2, is_compatible, note, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, slug, summary, content, image_url, category, is_active, published_at, created_at, updated_at) FROM stdin;
cf68e9d1-0068-48da-a286-d38bc488ab19	NVIDIA RTX 5090 rò rỉ thông số khủng, mạnh gấp đôi RTX 4090?	nvidia-rtx-5090-ro-ri-thong-so-khung	Tin tức công nghệ mới nhất trong ngày. Nắm bắt xu hướng, cập nhật phần cứng, trải nghiệm công nghệ tuyệt đỉnh.	<p>Đây là bài viết chi tiết được tạo tự động bởi hệ thống... Bạn có thể tự do chỉnh sửa nội dung bài viết này thông qua trình quản lý Admin nhé.</p>	https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80	Phần Cứng	t	2026-06-15 23:03:18.08891+07	2026-06-15 23:03:18.0877+07	2026-06-15 23:03:18.0877+07
0b22c8b7-0eeb-4585-a157-74708df83971	Intel Core Ultra 200 series chính thức ra mắt, thiết lập tiêu chuẩn mới	intel-core-ultra-200-series-chinh-thuc-ra-mat	Tin tức công nghệ mới nhất trong ngày. Nắm bắt xu hướng, cập nhật phần cứng, trải nghiệm công nghệ tuyệt đỉnh.	<p>Đây là bài viết chi tiết được tạo tự động bởi hệ thống... Bạn có thể tự do chỉnh sửa nội dung bài viết này thông qua trình quản lý Admin nhé.</p>	https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80	CPU	t	2026-06-15 23:03:18.089558+07	2026-06-15 23:03:18.0877+07	2026-06-15 23:03:18.0877+07
f5e196bf-4053-4390-8a98-f43fdc27c363	Apple hé lộ chip M4 Max cực mạnh trên MacBook Pro thế hệ mới	apple-he-lo-chip-m4-max	Tin tức công nghệ mới nhất trong ngày. Nắm bắt xu hướng, cập nhật phần cứng, trải nghiệm công nghệ tuyệt đỉnh.	<p>Đây là bài viết chi tiết được tạo tự động bởi hệ thống... Bạn có thể tự do chỉnh sửa nội dung bài viết này thông qua trình quản lý Admin nhé.</p>	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80	Laptop	t	2026-06-15 23:03:18.089962+07	2026-06-15 23:03:18.0877+07	2026-06-15 23:03:18.0877+07
100fd576-aae9-415b-8fb4-1085e0b0c656	Top 5 bàn phím cơ Custom đáng mua nhất tầm giá dưới 2 triệu	top-5-ban-phim-co-custom-duoi-2-trieu	Tin tức công nghệ mới nhất trong ngày. Nắm bắt xu hướng, cập nhật phần cứng, trải nghiệm công nghệ tuyệt đỉnh.	<p>Đây là bài viết chi tiết được tạo tự động bởi hệ thống... Bạn có thể tự do chỉnh sửa nội dung bài viết này thông qua trình quản lý Admin nhé.</p>	https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80	Đánh Giá	t	2026-06-15 23:03:18.090432+07	2026-06-15 23:03:18.0877+07	2026-06-15 23:03:18.0877+07
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_name, quantity, sku_id, sku_code, price_at_purchase) FROM stdin;
76ece7cd-e398-4154-b8ef-9e3945a1719c	cc9a5b6c-a8e8-4397-84c3-a97140794590	Laptop Gaming Dell G15 5530 Alienware	4	5d92d68a-1205-4c2e-b4b9-431c95da825c	SKU-LAPTOP-GAMING-D-5ef9	27990000
76dc2a4d-bc1d-4536-a1ed-b3922638b840	d95cedaa-646a-4e2b-b525-ccc20b454ec3	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	1	846271dc-fe28-4bb7-98f5-27c656af006a	SKU-RAM-GSKILL-TRID-04d8	3290000
41ec14af-bc2e-4441-8ff6-abbe30d4601d	e4fdbd6f-6bad-40ce-8072-f88fea5d85b2	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	1	846271dc-fe28-4bb7-98f5-27c656af006a	SKU-RAM-GSKILL-TRID-04d8	3290000
31fa2ad8-1260-49be-9cdb-460032a013e7	e0b35f19-2653-457e-9aed-05bfb9170bc9	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	1	846271dc-fe28-4bb7-98f5-27c656af006a	SKU-RAM-GSKILL-TRID-04d8	3290000
09b9d251-518e-4a65-9826-f9b784650f90	e56629cd-260a-41c1-a91c-765c5f23af56	Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming)	1	a74a3c9d-0da6-4c3f-b835-a7f6f08d35e1	SKU-MAN-HINH-SAMSUN-253d	3190000
e506b97d-56a5-41f5-8ec8-1a529b33bcd1	8fece50f-63e6-4c41-8ce1-4a476ce4e709	Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m	1	72e53fbf-f035-4f55-a8f8-e79ea63f7db1	SKU-CAP-SAC-ANKER-5-9f22	290000
d04ffcd3-f29b-49f4-802f-e23037e1072e	8fece50f-63e6-4c41-8ce1-4a476ce4e709	Laptop Gaming MSI Stealth 16 AI Studio A1VIG	2	8a2891ad-9833-4414-93ab-125a1555eac6	SKU-LAPTOP-GAMING-M-4f35	55990000
279e9f5c-4551-48fa-9585-c241bac4d2d7	8fece50f-63e6-4c41-8ce1-4a476ce4e709	CPU Intel Core i3-14100F	2	227bac92-d722-4d33-9aa8-fde4b3d7d3fd	SKU-CPU-INTEL-CORE--e8a6	2890000
fc3bee79-1c99-4bd5-86ff-713a8c45662e	8fece50f-63e6-4c41-8ce1-4a476ce4e709	Tai nghe HyperX Cloud III Có Dây	1	bfad6719-31e2-45ef-926d-eda33ba04021	SKU-TAI-NGHE-HYPERX-4785	1790000
7c99d35c-3e66-4acc-b442-f5e78bba8de0	4dab6211-e7a4-475f-913a-7ef8c8b47b75	Nguồn DeepCool PX1000G 1000W 80 Plus Gold - Full Modular	1	88dbdb40-9e09-430f-85bc-f823be2bbf77	SKU-NGUON-DEEPCOOL--be48	2990000
321e1a4d-72e8-4532-af37-84a9247e84b6	4dab6211-e7a4-475f-913a-7ef8c8b47b75	Lót chuột SteelSeries QcK Prism Cloth XL RGB	2	163b85cf-c028-47fe-ab7e-d2bf4c8ca172	SKU-LOT-CHUOT-STEEL-1c96	890000
60179c6a-0b01-485f-bb10-a1877b9a1ff8	af3fa225-3e37-4b39-96b7-880f0fe7a2c4	PC EZ4ENCE Gaming Starter - Intel i5 13400F / RTX 4060	2	e4869bbc-b836-4102-ae34-c755d39c09a6	SKU-PC-EZ4ENCE-GAMI-150b	17500000
b90ae0d3-1136-46f2-ae04-9971e9f35536	c0897d3b-5ae4-4e91-be7e-d2355abbcee0	Tản nhiệt khí DeepCool AK620 Digital	1	e568031c-83fc-4aee-aca3-8754733254ec	SKU-TAN-NHIET-KHI-D-17a6	1590000
727f776d-2a91-424b-89e5-af28d4e79c70	c0897d3b-5ae4-4e91-be7e-d2355abbcee0	Laptop Gaming Dell G15 5530 Alienware	2	5d92d68a-1205-4c2e-b4b9-431c95da825c	SKU-LAPTOP-GAMING-D-5ef9	25990000
7479ed3e-a081-49cb-854a-b1147d32a4ca	c0897d3b-5ae4-4e91-be7e-d2355abbcee0	Laptop Dell Inspiron 15 3530	2	335c9caf-2d08-4cb7-87ae-b8527bd01026	SKU-LAPTOP-DELL-INS-a416	12490000
4feb2e83-64d9-4562-970c-f3283751b67b	c0897d3b-5ae4-4e91-be7e-d2355abbcee0	Mainboard ASUS ROG STRIX B760-F GAMING WIFI	1	0cf34fc2-f34a-4514-9721-13abdc0a0fea	SKU-MAINBOARD-ASUS--24db	6290000
edb1694e-e9a1-4803-a9de-ea02bb3ecfa4	8f406cd8-293b-4017-b500-d75417333e06	RAM Kingston Fury Impact 16GB DDR5 4800MHz SODIMM (Laptop)	1	cf34c1b0-e4b0-4463-9bae-7f7f90ededb6	SKU-RAM-KINGSTON-FU-370d	1190000
eb8f87b9-a61a-4029-81ba-91eaafe6cfbe	90c14938-68ab-4e85-9f44-3fcfd7142757	Tai nghe HyperX Cloud III Có Dây	1	bfad6719-31e2-45ef-926d-eda33ba04021	SKU-TAI-NGHE-HYPERX-4785	1790000
a0c9077c-a1f4-4311-8101-ae3086d83b8f	90c14938-68ab-4e85-9f44-3fcfd7142757	Dịch vụ Cài đặt Windows + Driver + Phần mềm cơ bản	1	5cdf1458-9328-4356-bad0-a0db12a96c01	SKU-DICH-VU-CAI-AT--c3c8	200000
0461b571-0b7b-4d21-96c7-827faf852411	2c7e0e21-46c7-4dda-9501-f495ce25ab23	SSD WD Black SN850X 2TB PCIe Gen 4.0 x4 NVMe M.2	1	77e2d837-106a-494a-b31d-ce15aebecb95	SKU-SSD-WD-BLACK-SN-ecd4	3990000
7acb1dd5-dbfd-4265-84c9-531201e0ce08	2c7e0e21-46c7-4dda-9501-f495ce25ab23	SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2	2	7ce19412-f015-47a2-b1f3-82f6e24f9a1f	SKU-SSD-KINGSTON-NV-a28e	890000
02ca87b8-f6c2-46d4-aad5-bb7baecaa5c1	2c7e0e21-46c7-4dda-9501-f495ce25ab23	Màn hình ASUS VG27AQ1A 27 inch 2K 170Hz IPS (Gaming)	1	e0eb89fa-b96a-4501-8d31-d81e1000ac14	SKU-MAN-HINH-ASUS-V-9d0a	6990000
6ac11048-33ba-4f85-a3c2-161d0c222fda	2c7e0e21-46c7-4dda-9501-f495ce25ab23	Chuột Zowie EC2-CW Wireless (Esports)	2	ab98c639-447f-4bc3-88d5-2ed14046e4b8	SKU-CHUOT-ZOWIE-EC2-7d31	2890000
f914ae0d-83a6-4592-9efe-6b7aa360afef	56b63fda-8ec6-44df-a029-5b161035d88a	Laptop HP Pavilion 15-eg3098TU	2	d6868dd1-aeae-40c3-9abf-6e0ed896def7	SKU-LAPTOP-HP-PAVIL-9108	14990000
170c846a-27ed-44a0-966d-4d3d26e50460	bf95e36b-c583-4ca8-adb8-ab5b3bad7e3a	Case Corsair 5000D Airflow Black	2	b91e005c-c743-4ac0-94d5-6dade8d87dd8	SKU-CASE-CORSAIR-50-2659	3690000
690063d8-478e-4121-ab28-ca65139f59f2	bf95e36b-c583-4ca8-adb8-ab5b3bad7e3a	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730	1	271aef7a-ded7-42f1-bcaa-a11913427598	SKU-PC-EZ4ENCE-VAN--699a	8500000
19e1423b-37d7-488c-b6fb-1ce4e7e76fef	bf95e36b-c583-4ca8-adb8-ab5b3bad7e3a	Microphone Razer Seiren V3 Chroma USB	2	7e8d1469-dce3-4d44-852c-cb5239850e47	SKU-MICROPHONE-RAZE-2fe2	2490000
bdcdcd30-d327-4c63-85e6-455402ffa801	bf95e36b-c583-4ca8-adb8-ab5b3bad7e3a	Lót chuột Razer Firefly V2 Pro RGB	2	9e9186f0-0af2-427d-91a9-9c9a0d020a45	SKU-LOT-CHUOT-RAZER-19cb	1590000
51a4da02-7139-4c5e-9f5b-382ba99d094a	3dcb864c-914f-4eb3-88a9-13fa4d390f22	Chuột Corsair M75 AIR Wireless	2	d08e39ed-6dd1-4cc1-993d-c917a7c75919	SKU-CHUOT-CORSAIR-M-7e43	2690000
b11cd4f9-8d90-4e8d-a2c5-f1c8f000f288	3dcb864c-914f-4eb3-88a9-13fa4d390f22	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C	1	eed1d596-ea85-4971-9a95-16bb2549e49a	SKU-MAN-HINH-DELL-U-efa4	11490000
fd5165cf-e6f6-42ea-a4c1-1c9b75ff0a39	3dcb864c-914f-4eb3-88a9-13fa4d390f22	Laptop Gaming HP Victus 15-fa1093TX	2	459ae894-3e47-46f1-bdb0-f76f98701fa0	SKU-LAPTOP-GAMING-H-6d56	16490000
21c71620-c6f5-46ae-a28c-d0d0231e64c5	cd5ea597-64eb-4fe4-a530-c1441779c134	Macbook Pro M3 14 inch	1	298e1407-dd9b-4ca5-9050-a838ab8f82de	SKU-MACBOOK-PRO-M3--b8b4	37990000
2c6b0f91-fe0f-4043-a5b4-d7a0f9089ffe	294701fb-4f92-495f-a392-f0e4249ea232	Máy chơi game Valve Steam Deck OLED 1TB	1	ca01d362-1522-4300-97ed-51480f4e6e6c	SKU-MAY-CHOI-GAME-V-6ccb	15990000
7584c9da-91ff-4ab5-aff1-ff333a65c822	294701fb-4f92-495f-a392-f0e4249ea232	Microphone Razer Seiren V3 Chroma USB	2	7e8d1469-dce3-4d44-852c-cb5239850e47	SKU-MICROPHONE-RAZE-2fe2	2490000
1a60bdaa-eb3c-4f35-aa2a-a0fb3e658657	41e8eb5a-ce05-4ba0-af05-d22d476f545c	Webcam Logitech C922 Pro Stream 1080p	1	64a6114a-7047-484c-815e-28b6607a7b67	SKU-WEBCAM-LOGITECH-ed07	1790000
44fd061d-cda1-44ba-a69b-3666ed5b521b	294701fb-4f92-495f-a392-f0e4249ea232	VGA ASUS TUF Gaming GeForce RTX 4070 Super OC 12GB	2	c3a067be-034e-4887-9a9b-0538028183ed	SKU-VGA-ASUS-TUF-GA-5f0a	15990000
5e8f438f-bff0-4568-a0ce-39c851ebfab7	294701fb-4f92-495f-a392-f0e4249ea232	Bàn phím cơ Corsair K70 MAX RGB	2	3fc0528f-2040-4267-aa26-edbb6f0bca4d	SKU-BAN-PHIM-CO-COR-a4ae	4290000
bb9e29dc-a047-41c0-a9ae-08192ae36a9b	cfe3f8af-f153-4e6a-81a3-835c3ea05664	Mainboard GIGABYTE Z790 AORUS ELITE AX DDR5	1	72e20bd1-9ca0-42f6-8f57-7ebfbc02a8f7	SKU-MAINBOARD-GIGAB-71f5	7290000
db0e5cae-e446-4e9d-80b7-f57d02349d7e	cfe3f8af-f153-4e6a-81a3-835c3ea05664	Bàn phím cơ Razer Huntsman V3 Pro TKL	2	a92c95a3-be60-4f16-b8cb-c04f888afdd7	SKU-BAN-PHIM-CO-RAZ-49f1	4990000
76cd7924-4ed9-4691-a14a-f81c4f63734c	a46c0f73-7329-408b-bbf1-ea4c65f8b517	Mainboard ASUS ROG STRIX B760-F GAMING WIFI	2	0cf34fc2-f34a-4514-9721-13abdc0a0fea	SKU-MAINBOARD-ASUS--24db	6290000
a742cfed-e34f-4eae-bfc1-9826f1358231	f0b12036-cca6-4ae8-9d84-999147fe1bd6	Laptop MSI Modern 14 C13M	2	96e83018-ce72-4850-afae-a6ee9cf11b0a	SKU-LAPTOP-MSI-MODE-4aa0	12990000
2378e08f-c89d-4518-801f-250249164880	f0b12036-cca6-4ae8-9d84-999147fe1bd6	Lót chuột Pulsar Superglide Glass XL (Kính)	1	f9bb5c83-1ab5-48dd-9e11-d5e409134cd5	SKU-LOT-CHUOT-PULSA-a682	1290000
a416c5bc-32df-4315-adc8-2599661a7f5a	19da3953-1eed-42b0-896d-2fec69791b77	Laptop HP Pavilion 15-eg3098TU	2	d6868dd1-aeae-40c3-9abf-6e0ed896def7	SKU-LAPTOP-HP-PAVIL-9108	14990000
e41009d5-54dc-44c9-9da0-b8f5d53398f9	19da3953-1eed-42b0-896d-2fec69791b77	Case Corsair 5000D Airflow Black	2	b91e005c-c743-4ac0-94d5-6dade8d87dd8	SKU-CASE-CORSAIR-50-2659	3690000
3b04d01e-0193-4119-bd1b-ff6b836fa846	19da3953-1eed-42b0-896d-2fec69791b77	Laptop MSI Modern 14 C13M	2	96e83018-ce72-4850-afae-a6ee9cf11b0a	SKU-LAPTOP-MSI-MODE-4aa0	12990000
11589c74-ced0-431f-8f32-e3070dd7a95a	19da3953-1eed-42b0-896d-2fec69791b77	Microphone Elgato Wave:3 Premium USB Condenser	2	624567ac-22aa-4c37-ba48-b16bee94251e	SKU-MICROPHONE-ELGA-0ad7	3690000
19439c3c-6187-4e46-a432-c7470aa7089c	df5517da-7125-4313-b5f0-3ccbae598b47	Chuột Corsair M75 AIR Wireless	2	d08e39ed-6dd1-4cc1-993d-c917a7c75919	SKU-CHUOT-CORSAIR-M-7e43	2690000
6b8fac71-eb5e-496c-bf43-24b84b9442de	df5517da-7125-4313-b5f0-3ccbae598b47	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB	2	8ce781dd-627d-4baa-af20-34e22c53036a	SKU-VGA-SAPPHIRE-NI-1e9b	11990000
03114082-ef23-41b4-910f-5ca0c1a4cc9c	df5517da-7125-4313-b5f0-3ccbae598b47	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	1	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
12857219-a4ed-4134-a94f-737513e3f633	df5517da-7125-4313-b5f0-3ccbae598b47	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C	2	eed1d596-ea85-4971-9a95-16bb2549e49a	SKU-MAN-HINH-DELL-U-efa4	11490000
5268e094-c5a2-4302-8198-f6e7804c05ff	6e896218-64c3-44f1-abb2-f6c669a04e7a	Tản nhiệt khí DeepCool AK620 Digital	2	e568031c-83fc-4aee-aca3-8754733254ec	SKU-TAN-NHIET-KHI-D-17a6	1590000
47ccdc7f-98d4-4784-9467-68282769affe	6e896218-64c3-44f1-abb2-f6c669a04e7a	Loa Creative Pebble V3 USB-C 2.0	1	47ab71e4-e7ac-4b80-ac32-de8a8348fb6e	SKU-LOA-CREATIVE-PE-d6a1	890000
4d000ffb-fa6b-4413-a5db-04d78af5f628	6e896218-64c3-44f1-abb2-f6c669a04e7a	Máy chơi game Valve Steam Deck OLED 1TB	2	ca01d362-1522-4300-97ed-51480f4e6e6c	SKU-MAY-CHOI-GAME-V-6ccb	15990000
ee8ae258-e14e-44ad-b2ea-af20b997b191	6e896218-64c3-44f1-abb2-f6c669a04e7a	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G	1	c1231ae8-05fb-4d6c-9fd4-3bfea6bde52d	SKU-VGA-GIGABYTE-GE-b87a	22990000
4066994c-cb04-440d-8dc7-b3e30aebc281	74124ec6-33a0-40df-b205-ac4e3b9d298a	PC EZ4ENCE Đồ Họa - AMD Ryzen 9 7950X / RTX 4080 Super	1	c07d125a-7535-4a9c-bfa9-8ac70a9f6d64	SKU-PC-EZ4ENCE-O-HO-231f	55000000
2ff7dffe-b352-4523-bdba-51a80ba4e3e5	f64c6b50-3633-4240-981d-c8550602a5de	Microphone Razer Seiren V3 Chroma USB	2	7e8d1469-dce3-4d44-852c-cb5239850e47	SKU-MICROPHONE-RAZE-2fe2	2490000
09a33848-3415-4a79-9d9b-ee0aecd7fd69	f64c6b50-3633-4240-981d-c8550602a5de	CPU Intel Core i3-14100F	1	227bac92-d722-4d33-9aa8-fde4b3d7d3fd	SKU-CPU-INTEL-CORE--e8a6	2890000
da451d5e-0a79-4ae4-b1be-256d90521451	f4fef4e3-1f22-4c9d-b35f-d945286d9557	Tai nghe Sony WF-1000XM5 True Wireless (In-ear)	2	ca1c4675-0780-49d4-8a8a-4a495fda979f	SKU-TAI-NGHE-SONY-W-2fc2	5290000
afbc0bf4-e9b2-42a2-9d11-d0f4c84fedab	869b20e9-da85-4a3f-a3f0-da2ad0401165	Tản nhiệt nước NZXT Kraken 280 RGB Black	1	32a46deb-eef6-4131-a73f-522578529416	SKU-TAN-NHIET-NUOC--0730	3190000
f6bf9a56-ee1f-4cde-82da-68994fa2efee	869b20e9-da85-4a3f-a3f0-da2ad0401165	Case NZXT H5 Flow RGB Matte White	1	da0be69a-d8e9-4426-aa6b-30811f1411f9	SKU-CASE-NZXT-H5-FL-1a5f	2490000
c7c39580-7bcc-4d86-86f3-fcd00bce44d3	869b20e9-da85-4a3f-a3f0-da2ad0401165	Case Lian Li LANCOOL III RGB White	1	f5beff7a-1284-45b8-a4c6-35a924eff911	SKU-CASE-LIAN-LI-LA-2c67	3290000
3d8c3dd9-11d2-4127-b38c-2db71cb2b666	869b20e9-da85-4a3f-a3f0-da2ad0401165	Bàn phím cơ Razer Huntsman V3 Pro TKL	1	a92c95a3-be60-4f16-b8cb-c04f888afdd7	SKU-BAN-PHIM-CO-RAZ-49f1	4990000
d43950e3-892d-4f0e-b31c-5bef1384f3f8	0bfc586c-f950-497f-8b21-00b2b90160ca	Nguồn Corsair RM750e 750W 80 Plus Gold - Full Modular	2	a90ca3cc-9e1c-47a9-b468-73feac4c178e	SKU-NGUON-CORSAIR-R-f21f	2490000
99545f78-d087-444e-a879-6f219e542436	0bfc586c-f950-497f-8b21-00b2b90160ca	Lót chuột Pulsar Superglide Glass XL (Kính)	1	f9bb5c83-1ab5-48dd-9e11-d5e409134cd5	SKU-LOT-CHUOT-PULSA-a682	1290000
68b93b62-42d2-4bac-9a1d-4eb6c70cc384	54a34b41-b409-481a-b99c-bd063bd65f0b	Microphone Razer Seiren V3 Chroma USB	2	7e8d1469-dce3-4d44-852c-cb5239850e47	SKU-MICROPHONE-RAZE-2fe2	2490000
96419878-2f4f-4ac4-9917-35c1b8a1355a	54a34b41-b409-481a-b99c-bd063bd65f0b	Tai nghe HyperX Cloud III Có Dây	2	bfad6719-31e2-45ef-926d-eda33ba04021	SKU-TAI-NGHE-HYPERX-4785	1790000
6469d44b-3d5f-4098-96d2-8dfc30cacd90	54a34b41-b409-481a-b99c-bd063bd65f0b	Chuột Pulsar X2H Medium Wireless	1	8e82dd6b-4172-43d5-9506-b2ea532e344a	SKU-CHUOT-PULSAR-X2-707b	2190000
8ac1e2b2-9798-46d2-a1a5-e81b48fa9586	54a34b41-b409-481a-b99c-bd063bd65f0b	SSD Samsung 870 EVO 1TB SATA III 2.5 inch	2	5504b4ef-4dcc-4ec5-8c97-46e9309bac44	SKU-SSD-SAMSUNG-870-f60d	2290000
4d4bf5a7-2011-4e12-817a-69389359ef51	4675d0a2-0075-4c40-a87d-0bf188ed3400	Laptop HP Pavilion 15-eg3098TU	2	d6868dd1-aeae-40c3-9abf-6e0ed896def7	SKU-LAPTOP-HP-PAVIL-9108	14990000
f8ae77e8-4523-455b-9f6a-7c40a502b4c4	4675d0a2-0075-4c40-a87d-0bf188ed3400	Laptop Gaming Dell G15 5530 Alienware	1	5d92d68a-1205-4c2e-b4b9-431c95da825c	SKU-LAPTOP-GAMING-D-5ef9	25990000
6e0d9adf-e88a-4cd1-948b-645e2ac87e9b	4675d0a2-0075-4c40-a87d-0bf188ed3400	Laptop Gaming ASUS ROG Zephyrus G14 GA403UI	1	d735830d-2280-42c7-93c1-a0b45225413b	SKU-LAPTOP-GAMING-A-a531	42990000
1bd2a0d6-d6fa-4942-b6f5-def25d5b4977	2231fde4-4904-4b4f-9265-2c5c9b3fffe2	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G	1	c1231ae8-05fb-4d6c-9fd4-3bfea6bde52d	SKU-VGA-GIGABYTE-GE-b87a	22990000
e6591b1f-c9c7-46aa-9549-ace68603f302	2231fde4-4904-4b4f-9265-2c5c9b3fffe2	Vô lăng đua xe Thrustmaster T248 Racing Wheel (PS/PC)	2	0833e5d4-d95a-4361-a317-36ed960b328e	SKU-VO-LANG-UA-XE-T-7b6b	6490000
52791f3e-5b12-43b5-9725-2a61c5629685	2231fde4-4904-4b4f-9265-2c5c9b3fffe2	Chuột Zowie EC2-CW Wireless (Esports)	1	ab98c639-447f-4bc3-88d5-2ed14046e4b8	SKU-CHUOT-ZOWIE-EC2-7d31	2890000
983d0ecb-9222-406d-bd68-9a89de754542	2231fde4-4904-4b4f-9265-2c5c9b3fffe2	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C	2	eed1d596-ea85-4971-9a95-16bb2549e49a	SKU-MAN-HINH-DELL-U-efa4	11490000
66d543b6-ca12-4b63-a433-f39eb734728f	639d87c0-16ac-411d-9160-5fb55181d1d4	Tay cầm Xbox Wireless Controller Carbon Black	2	f479ee64-d7c6-45d8-ae9c-692a1cddb279	SKU-TAY-CAM-XBOX-WI-c72b	1290000
1f1fb014-6834-48dc-b6fd-e8b98b552315	639d87c0-16ac-411d-9160-5fb55181d1d4	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G	1	c1231ae8-05fb-4d6c-9fd4-3bfea6bde52d	SKU-VGA-GIGABYTE-GE-b87a	22990000
a4c2392d-94b2-4aac-b095-8cdbb36ff310	bfff3c43-54c5-4a1f-a16f-0e55b022cffa	Laptop Acer Swift 3 SF314-512	1	c508ce3f-183d-48f4-9057-58b3237a9c0f	SKU-LAPTOP-ACER-SWI-2713	15990000
7fa0e40a-2fe0-4f88-b9c6-15f46385d0ed	95b648b9-c0fe-4438-aad9-1b4f2f3ea557	Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack)	2	2c87a908-53a2-4da4-825b-1f9eea37ddb4	SKU-BO-PHAT-WIFI-ME-2bca	3790000
04afa217-1692-4c81-bd27-ed0b1ea35789	95b648b9-c0fe-4438-aad9-1b4f2f3ea557	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)	1	02dab16b-b2ed-4fec-acfe-fdc1791badea	SKU-MAN-HINH-ASUS-P-2c94	11990000
cda8ddb0-ff7f-405a-baaa-e8d1fea442a3	95b648b9-c0fe-4438-aad9-1b4f2f3ea557	Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m	2	72e53fbf-f035-4f55-a8f8-e79ea63f7db1	SKU-CAP-SAC-ANKER-5-9f22	290000
2bfccaf3-5453-401e-8ebc-134caf3a9ca0	95b648b9-c0fe-4438-aad9-1b4f2f3ea557	Laptop HP Envy x360 14-fa0013TU (Cảm ứng)	2	b228fa68-ab21-4b22-999d-dc72cdac8394	SKU-LAPTOP-HP-ENVY--5e2d	19990000
996d3af2-7f53-422f-b924-32de3014119b	4f466c67-3713-4532-b7bb-3bcdf1f71267	Loa Edifier R1280DBs Bluetooth Active Bookshelf 2.0	2	aa414378-8b9f-42ce-b25d-26231d60881d	SKU-LOA-EDIFIER-R12-2d36	2290000
a625752b-5f86-4947-a41c-b95b9dbcd51d	1da4fafe-523d-4288-9177-c88f7a7d6dbc	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB	2	8ce781dd-627d-4baa-af20-34e22c53036a	SKU-VGA-SAPPHIRE-NI-1e9b	11990000
065e334c-3668-42c9-9794-b92b10cc6d3c	1da4fafe-523d-4288-9177-c88f7a7d6dbc	RAM Kingston Fury Impact 16GB DDR5 4800MHz SODIMM (Laptop)	2	cf34c1b0-e4b0-4463-9bae-7f7f90ededb6	SKU-RAM-KINGSTON-FU-370d	1190000
ba034b08-235e-4c60-8ed3-89123487af04	1da4fafe-523d-4288-9177-c88f7a7d6dbc	Lót chuột SteelSeries QcK Heavy XXL	2	a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	SKU-LOT-CHUOT-STEEL-60f1	590000
79d7b82b-d231-468e-b6f1-edd8a5c7834e	1da4fafe-523d-4288-9177-c88f7a7d6dbc	Chuột Zowie EC2-CW Wireless (Esports)	2	ab98c639-447f-4bc3-88d5-2ed14046e4b8	SKU-CHUOT-ZOWIE-EC2-7d31	2890000
a3232947-b756-47fc-8781-a3411d82408e	f5e2907d-215b-4324-8929-45d06e7cbd9f	Dịch vụ Vệ sinh PC / Laptop tại cửa hàng	1	3c82787c-2c02-4861-833e-6fdd9904c98f	SKU-DICH-VU-VE-SINH-d2f8	150000
105d9e10-4b34-431c-9f38-1e5d06f3c88e	f5e2907d-215b-4324-8929-45d06e7cbd9f	Tản nhiệt khí DeepCool AK620 Digital	2	e568031c-83fc-4aee-aca3-8754733254ec	SKU-TAN-NHIET-KHI-D-17a6	1590000
5c52e088-3ef0-4ef3-aeeb-8786d4848ac8	ba9baccd-b0ff-45c6-ab04-35e328c48ce9	Laptop Gaming Lenovo LOQ 15IAX9	1	e091fd8f-cddc-4c18-9b7c-39c9f32a690d	SKU-LAPTOP-GAMING-L-bf9c	16490000
0530aa54-3dec-47a0-9ee9-153ddd5eea12	ba9baccd-b0ff-45c6-ab04-35e328c48ce9	Microsoft Office 365 Personal (1 năm)	1	45e580d6-edd1-4641-9f1d-787bbcf378f3	SKU-MICROSOFT-OFFIC-4915	1490000
d0a0e765-e961-4d48-98a7-7d3898013c97	ba9baccd-b0ff-45c6-ab04-35e328c48ce9	Tản nhiệt nước NZXT Kraken 280 RGB Black	1	32a46deb-eef6-4131-a73f-522578529416	SKU-TAN-NHIET-NUOC--0730	3190000
3a753e35-d6f4-490a-a002-b109bf48d14e	ba9baccd-b0ff-45c6-ab04-35e328c48ce9	VGA MSI GeForce RTX 4080 Super VENTUS 3X OC 16G	2	7bb8de71-6b77-4d15-9b07-e26ebf34d15c	SKU-VGA-MSI-GEFORCE-72a3	28490000
96e0d0a8-215a-4e2e-9feb-349043ec15e3	623cdc71-cb2b-4b7d-a8f8-db224ee64962	Tai nghe Logitech G PRO X 2 LIGHTSPEED (Over-ear Gaming)	2	d0ff246a-21e8-42f6-9d8b-7a9fb7c200f7	SKU-TAI-NGHE-LOGITE-70f2	4490000
330b8108-9e5b-4123-a86b-5ac40243f761	623cdc71-cb2b-4b7d-a8f8-db224ee64962	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB	1	be4e84a0-827c-4423-b422-66e7f0666055	SKU-VGA-SAPPHIRE-PU-6460	13990000
eaa8ff8c-d78e-4aca-b061-4b8ad490fba3	623cdc71-cb2b-4b7d-a8f8-db224ee64962	Laptop Dell Inspiron 15 3530	1	335c9caf-2d08-4cb7-87ae-b8527bd01026	SKU-LAPTOP-DELL-INS-a416	12490000
f3b2e4de-e39f-4028-a802-93b5b5337ed2	623cdc71-cb2b-4b7d-a8f8-db224ee64962	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	1	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
03080966-1b01-47e0-8278-696b58d2b433	34516fcc-8fc9-4e26-9269-0532a30589d1	Nguồn Corsair CV550 550W 80 Plus Bronze	1	3f2f4541-6cc8-4666-b7a8-26a6a5a221e6	SKU-NGUON-CORSAIR-C-e63d	1190000
679cbf07-a2e1-48b9-a961-125263fac55c	34516fcc-8fc9-4e26-9269-0532a30589d1	Nguồn ASUS ROG STRIX 850W 80 Plus Gold - Full Modular	1	eb0a5868-af26-49d7-99ec-3ec220569539	SKU-NGUON-ASUS-ROG--34f3	3190000
d8daeaa6-5da4-452e-862a-88953c5b6b97	34516fcc-8fc9-4e26-9269-0532a30589d1	Loa Edifier M3280BT Bluetooth 2.1	2	49023e00-453c-42ee-bfa1-ac100d6d9e33	SKU-LOA-EDIFIER-M32-c82d	1690000
e89db437-d795-4caa-840c-c002cb6d32ba	34516fcc-8fc9-4e26-9269-0532a30589d1	Nintendo Switch OLED Model Mario Red Edition	2	a3f5dcef-448b-4f7a-b668-03a47d0beffb	SKU-NINTENDO-SWITCH-0dcb	8990000
cb2b049c-48c3-4fea-844e-59ed5f84fab8	f01cdd59-fab9-4ea4-a4ed-c3c8ed331ac9	Chuột Corsair M75 AIR Wireless	1	d08e39ed-6dd1-4cc1-993d-c917a7c75919	SKU-CHUOT-CORSAIR-M-7e43	2690000
d1455963-8fb5-44d8-99f7-0507676be8b5	f01cdd59-fab9-4ea4-a4ed-c3c8ed331ac9	Máy chơi game Xbox Series X 1TB	2	5bc1dc10-fcbd-4648-a0a9-632af59fbcdd	SKU-MAY-CHOI-GAME-X-1d26	12990000
f6a3bee6-dd80-40a1-8427-2ec1dc780f19	42ca0264-8218-4b2c-b421-335ecacfd8a5	Laptop Gaming HP Victus 15-fa1093TX	2	459ae894-3e47-46f1-bdb0-f76f98701fa0	SKU-LAPTOP-GAMING-H-6d56	16490000
228adb77-28c6-4ede-a694-fb0eed0b91e6	ba496ecd-f111-4de6-80b2-512c54497919	Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m	2	72e53fbf-f035-4f55-a8f8-e79ea63f7db1	SKU-CAP-SAC-ANKER-5-9f22	290000
07857202-34d6-4144-a3d6-db9b69a55dbb	ba496ecd-f111-4de6-80b2-512c54497919	Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming)	1	a74a3c9d-0da6-4c3f-b835-a7f6f08d35e1	SKU-MAN-HINH-SAMSUN-253d	3190000
6298e33d-fa26-4011-8ea2-0e60fc5a943d	ba496ecd-f111-4de6-80b2-512c54497919	VGA MSI GeForce RTX 4060 VENTUS 2X 8G OC	2	2d52e7eb-f803-4fa4-8b1d-58e3f032763b	SKU-VGA-MSI-GEFORCE-c26c	7990000
963b4125-f18e-481a-8610-5f64dcae9909	ba496ecd-f111-4de6-80b2-512c54497919	Màn hình ASUS VG27AQ1A 27 inch 2K 170Hz IPS (Gaming)	2	e0eb89fa-b96a-4501-8d31-d81e1000ac14	SKU-MAN-HINH-ASUS-V-9d0a	6990000
e5704102-d1e2-4c02-b1cf-7c2b5745ca9b	bbd42101-0b17-4327-806d-ea737eac61a4	Bàn phím cơ Keychron Q1 Pro QMK/VIA	2	32088110-c215-444b-be19-395d6127837c	SKU-BAN-PHIM-CO-KEY-c3e3	4290000
dfe5c9c4-2f90-4187-a1e3-d00e35e3f8db	bbd42101-0b17-4327-806d-ea737eac61a4	Laptop Gaming Acer Nitro V 15 ANV15-51	1	6f2ea8f0-b128-4fc4-b9c2-defb44671aa0	SKU-LAPTOP-GAMING-A-9a9b	18490000
a2ef2766-dddd-46b6-a18e-7a37fe90356e	bbd42101-0b17-4327-806d-ea737eac61a4	USB Samsung Bar Plus 256GB USB 3.1 400MB/s	1	b060ae2b-e7bb-4642-a834-45e2279e5bd3	SKU-USB-SAMSUNG-BAR-97b1	390000
521cc0c3-3419-4d3e-b44a-0a99c0fe3517	bbd42101-0b17-4327-806d-ea737eac61a4	CPU Intel Core i5-14600KF	2	78a2e491-51cf-4543-8232-d0c5381ec236	SKU-CPU-INTEL-CORE--ef74	6490000
450255ca-4746-4d3f-b31d-fee501b8b98e	a876938b-da0a-4c66-8f35-8073ce2e596d	Webcam Logitech C922 Pro Stream 1080p	1	64a6114a-7047-484c-815e-28b6607a7b67	SKU-WEBCAM-LOGITECH-ed07	1790000
5e8bcd1d-cbab-44ea-bf33-6161dcc0fa6c	1663f295-4583-4fb0-8287-f7b08ef02956	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	2	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
df4eadfb-a494-4cf7-89b4-344275908f90	1663f295-4583-4fb0-8287-f7b08ef02956	Windows 11 Home 64-bit Bản quyền (OEM)	1	b3642e6a-28f8-4cc4-b754-af7855382f52	SKU-WINDOWS-11-HOME-1f32	3290000
71071b75-d11f-4bd7-8112-748562085adf	1663f295-4583-4fb0-8287-f7b08ef02956	Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm	1	705c0604-b442-47cb-8588-28a3867ad9c7	SKU-DICH-VU-BAO-HAN-ac18	990000
caf46717-f09d-4740-99eb-3c3d4f143b9f	1663f295-4583-4fb0-8287-f7b08ef02956	Laptop MSI Modern 14 C13M	2	96e83018-ce72-4850-afae-a6ee9cf11b0a	SKU-LAPTOP-MSI-MODE-4aa0	12990000
6036a31d-ea95-4974-8584-2c4907974c57	1e8cecb6-5d3f-4657-b8ab-34ccb319cb9f	Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm	2	705c0604-b442-47cb-8588-28a3867ad9c7	SKU-DICH-VU-BAO-HAN-ac18	990000
e69f1310-ddb5-4922-ab48-fd790ff91891	1e8cecb6-5d3f-4657-b8ab-34ccb319cb9f	Laptop Gaming MSI Thin GF63 12UC	1	98812a4e-4d18-49c4-8c22-dd77800a0014	SKU-LAPTOP-GAMING-M-816c	14490000
18429f01-1f15-4f7d-9567-695977d3e4f8	1e8cecb6-5d3f-4657-b8ab-34ccb319cb9f	VGA ASUS TUF Gaming GeForce RTX 4070 Super OC 12GB	1	c3a067be-034e-4887-9a9b-0538028183ed	SKU-VGA-ASUS-TUF-GA-5f0a	15990000
1e7abff5-cc55-4fae-88dc-56ba107af7a4	1e8cecb6-5d3f-4657-b8ab-34ccb319cb9f	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730	2	271aef7a-ded7-42f1-bcaa-a11913427598	SKU-PC-EZ4ENCE-VAN--699a	8500000
2d67b349-a3a4-4db0-8b5a-134c808a9b66	e10f8d63-d879-4f3d-8027-3e1754058912	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB	1	8ce781dd-627d-4baa-af20-34e22c53036a	SKU-VGA-SAPPHIRE-NI-1e9b	11990000
c1ba6def-5752-4d2d-aab4-7909fa17a3a4	e10f8d63-d879-4f3d-8027-3e1754058912	PC EZ4ENCE Mini ITX - Intel i5 14400F / RTX 4060	1	f8c5f527-0207-4609-9e15-01a26f558d4e	SKU-PC-EZ4ENCE-MINI-6e7c	20500000
71c4410f-d513-4dde-a712-f58e70c6647b	e10f8d63-d879-4f3d-8027-3e1754058912	Laptop Gaming Dell G15 5530 Alienware	1	5d92d68a-1205-4c2e-b4b9-431c95da825c	SKU-LAPTOP-GAMING-D-5ef9	25990000
b2096d20-6586-46f9-9a26-ab18b275d401	e10f8d63-d879-4f3d-8027-3e1754058912	Loa Creative Stage SE Soundbar 2.0	1	86a9d617-9ef9-42fa-aba4-dbf4ec90ddd4	SKU-LOA-CREATIVE-ST-4540	990000
ee4405a2-74dd-4652-a6e5-2f1a92c2e625	bfee08d5-b0f6-4bdb-940c-840c338054a2	Bàn phím cơ Không dây Akko 3098B Multi-modes	1	82cf2feb-9479-40b3-bc9d-a569712b5987	SKU-BAN-PHIM-C-623	1850000
f7bbd269-4abf-4e85-b3d5-e857203eb23b	215e595a-62c9-4892-b71b-d338a2ede70a	Webcam Logitech C270 HD 720p	1	2108e431-2603-4e2a-90c7-ed0aa4162d63	SKU-WEBCAM-LOGITECH-3219	590000
cb800a0c-3b90-4a80-aabf-1e52bbbac875	215e595a-62c9-4892-b71b-d338a2ede70a	Laptop Gaming HP OMEN 16-wd0013TX	2	241104f4-8a7b-4476-b231-171ac2aba2a9	SKU-LAPTOP-GAMING-H-2ea0	27990000
cb7a7893-0183-462a-906c-f332c5367e75	f97a83ec-8464-45e4-90ca-237a028b3f4a	Loa JBL Quantum Duo Gaming 2.0 RGB	2	2775e177-4e08-4f64-84a5-21bf23cda1e0	SKU-LOA-JBL-QUANTUM-79b2	1990000
bcbe35ec-3bd8-463d-aa89-f0469edaafec	f97a83ec-8464-45e4-90ca-237a028b3f4a	Đế tản nhiệt Laptop Cooler Master NotePal X-Slim II	2	e7cbcd9c-3285-4d1b-af3b-9c8f45357b69	SKU-E-TAN-NHIET-LAP-30f0	490000
d4a9912f-65fe-4fa1-befc-b046df0b78ba	236a4289-235c-41cd-a952-6cbc4fc4c9c2	Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack)	2	2c87a908-53a2-4da4-825b-1f9eea37ddb4	SKU-BO-PHAT-WIFI-ME-2bca	3790000
a3fbc9ca-d993-45d3-b5ae-6c1bd876f48b	66b3aafc-3f1f-4b98-906d-6e6b5e91f7dc	Dịch vụ Thu cũ đổi mới - Nâng cấp PC/Laptop	2	26b0c7d8-92b8-4df5-a9d1-d2bec9ae5a63	SKU-DICH-VU-THU-CU--9642	0
b4d1de86-a0b1-421b-b48d-fac2cb824f88	66b3aafc-3f1f-4b98-906d-6e6b5e91f7dc	PC EZ4ENCE Đồ Họa - AMD Ryzen 9 7950X / RTX 4080 Super	2	c07d125a-7535-4a9c-bfa9-8ac70a9f6d64	SKU-PC-EZ4ENCE-O-HO-231f	55000000
52d781af-e8e0-4547-87e5-da713b87a2bc	ee08800c-0da7-4bb7-ba12-f02a27b9d508	Lót chuột SteelSeries QcK Heavy XXL	2	a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	SKU-LOT-CHUOT-STEEL-60f1	590000
939295b7-4541-4df6-84e1-21216f072745	ee08800c-0da7-4bb7-ba12-f02a27b9d508	Lót chuột Pulsar Superglide Glass XL (Kính)	1	f9bb5c83-1ab5-48dd-9e11-d5e409134cd5	SKU-LOT-CHUOT-PULSA-a682	1290000
5c2a8014-fdd8-43aa-9702-bfaaa9e97d01	ee08800c-0da7-4bb7-ba12-f02a27b9d508	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730	1	271aef7a-ded7-42f1-bcaa-a11913427598	SKU-PC-EZ4ENCE-VAN--699a	8500000
e60a5123-8a82-4ccd-930f-1e4d7e6709ef	ee08800c-0da7-4bb7-ba12-f02a27b9d508	Lót chuột Artisan FX Hayate Otsu V2 XL Soft	2	3d5bc428-f8e9-4ede-90bd-9bd6c1bed2a3	SKU-LOT-CHUOT-ARTIS-3747	1890000
66578b84-107d-44e0-8f6e-01fe68ccf615	41e8eb5a-ce05-4ba0-af05-d22d476f545c	Loa Creative Stage SE Soundbar 2.0	1	86a9d617-9ef9-42fa-aba4-dbf4ec90ddd4	SKU-LOA-CREATIVE-ST-4540	990000
8ce7de67-694a-4b1c-a7ae-c6189dc9c5c2	41e8eb5a-ce05-4ba0-af05-d22d476f545c	Laptop Gaming ASUS ROG Zephyrus G14 GA403UI	2	d735830d-2280-42c7-93c1-a0b45225413b	SKU-LAPTOP-GAMING-A-a531	42990000
e43bd1b2-f5c4-4777-82f8-1847823a7972	65f16ab1-d0b5-4997-8039-2b82711accc3	SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2	1	7ce19412-f015-47a2-b1f3-82f6e24f9a1f	SKU-SSD-KINGSTON-NV-a28e	890000
9e4c4b00-4b8d-4cbb-957f-3e64f27344c4	5d9d6114-b8b0-49ea-91d9-b10970176213	ASUS ROG Ally X Handheld Gaming	1	e1629871-a173-4938-894a-42c789655ed3	SKU-ASUS-ROG-ALLY-X-c6db	18990000
3f9a948e-e2d7-41e3-8b5b-8e3b6ffd0440	5d9d6114-b8b0-49ea-91d9-b10970176213	Laptop Gaming ASUS TUF Gaming A15 FA507NV	1	35870f40-a432-47a1-a171-29d5d4ad0d6f	SKU-LAPTOP-GAMING-A-92f9	22990000
0ebda822-c1f7-4822-84a8-daebfb42327d	c493b6e0-b7fd-4569-b554-7c4d6c344d4d	RAM Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz	1	5331de62-a369-4a75-bb11-ca7ea2b4f754	SKU-RAM-KINGSTON-FU-4a98	1290000
9164e216-6c38-4511-b0c9-de181cbe38e0	b96fb5b7-1a25-4e24-a3cf-4122b1fc6514	Bàn phím cơ Razer Huntsman V3 Pro TKL	1	a92c95a3-be60-4f16-b8cb-c04f888afdd7	SKU-BAN-PHIM-CO-RAZ-49f1	4990000
0b0d61aa-7bb4-4dc9-b47d-0509a040ac73	b64baa80-835e-41c7-8a2b-4c375b4f1f9a	Adobe Creative Cloud All Apps 1 Năm (Đồ họa)	2	064b7ba3-82f3-49ce-a7b8-a81f3f2e7faf	SKU-ADOBE-CREATIVE--ea1c	14990000
ba5fadc9-79c9-4c0f-8609-86c059f4c759	b64baa80-835e-41c7-8a2b-4c375b4f1f9a	Đĩa Game PS5 - God of War Ragnarok	1	8777368b-e64b-4982-ac3b-ad52a1261213	SKU-IA-GAME-PS5-GOD-32e1	990000
8206d87a-0db0-49d2-8deb-0bf50d63eb9a	b64baa80-835e-41c7-8a2b-4c375b4f1f9a	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	2	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
3ab26010-d253-4b80-b272-3688db957db4	1ae04287-105d-4906-83b9-12724d935ccb	Loa Creative Stage SE Soundbar 2.0	2	86a9d617-9ef9-42fa-aba4-dbf4ec90ddd4	SKU-LOA-CREATIVE-ST-4540	990000
944a5072-4cf4-48c1-a575-af8c91e1464b	125e2ffd-1b7c-4480-b9e9-29a6b39dd78a	Lót chuột Razer Firefly V2 Pro RGB	1	9e9186f0-0af2-427d-91a9-9c9a0d020a45	SKU-LOT-CHUOT-RAZER-19cb	1590000
785e5e22-4fdc-4a59-b1a7-ea49239266ff	125e2ffd-1b7c-4480-b9e9-29a6b39dd78a	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730	1	271aef7a-ded7-42f1-bcaa-a11913427598	SKU-PC-EZ4ENCE-VAN--699a	8500000
3c1f28b3-b524-4dd7-a1a0-f3f397df2a0c	125e2ffd-1b7c-4480-b9e9-29a6b39dd78a	Đĩa Game Nintendo Switch - The Legend of Zelda: TotK	2	ee187913-76b0-4d39-91ff-17eed63a5cc2	SKU-IA-GAME-NINTEND-ab9c	1390000
ee297edc-fd3c-44a1-a4a3-25118e720ed2	125e2ffd-1b7c-4480-b9e9-29a6b39dd78a	Màn hình Dell P2422H 24 inch FHD IPS (Văn phòng)	1	e22ef11d-3c1c-487a-a8b6-2105ff60d83b	SKU-MAN-HINH-DELL-P-0ac2	4490000
dda08af8-7874-4d4f-9eec-8cc872ee47c3	8fb663d9-bb93-4b51-ba4b-4ec366246ed9	Bàn phím cơ Không dây Akko 3098B Multi-modes	1	82cf2feb-9479-40b3-bc9d-a569712b5987	SKU-BAN-PHIM-C-623	1850000
f3ca3c4c-f4bc-4cab-ac1a-6e0b7a37431e	8fb663d9-bb93-4b51-ba4b-4ec366246ed9	Chuột Corsair M75 AIR Wireless	1	d08e39ed-6dd1-4cc1-993d-c917a7c75919	SKU-CHUOT-CORSAIR-M-7e43	2690000
12cb9011-8c76-49c5-a73d-8172b8e5f462	8fb663d9-bb93-4b51-ba4b-4ec366246ed9	Tai nghe Sony WF-1000XM5 True Wireless (In-ear)	2	ca1c4675-0780-49d4-8a8a-4a495fda979f	SKU-TAI-NGHE-SONY-W-2fc2	5290000
0d400a7d-1016-4a48-87e4-c176456ef14e	8fb663d9-bb93-4b51-ba4b-4ec366246ed9	Nguồn Corsair CV550 550W 80 Plus Bronze	2	3f2f4541-6cc8-4666-b7a8-26a6a5a221e6	SKU-NGUON-CORSAIR-C-e63d	1190000
8ba5a664-295d-4f71-ab8c-b970cdaea724	896a2e0f-d0ce-4f77-a483-4fd47dfe1300	Laptop Gaming Lenovo LOQ 15IAX9	1	e091fd8f-cddc-4c18-9b7c-39c9f32a690d	SKU-LAPTOP-GAMING-L-bf9c	16490000
96aded23-0132-4632-b651-2d2c5b0a0ee9	896a2e0f-d0ce-4f77-a483-4fd47dfe1300	Tay cầm Sony DualSense Edge Wireless Controller (PS5)	1	20b719c9-41aa-4703-afc2-2043ca2007d7	SKU-TAY-CAM-SONY-DU-a318	5490000
dbd9dee7-ec44-4853-8133-36c64f63d304	896a2e0f-d0ce-4f77-a483-4fd47dfe1300	USB Samsung Bar Plus 256GB USB 3.1 400MB/s	1	b060ae2b-e7bb-4642-a834-45e2279e5bd3	SKU-USB-SAMSUNG-BAR-97b1	390000
87a98789-4598-4f05-97c5-d71d43555557	896a2e0f-d0ce-4f77-a483-4fd47dfe1300	Loa JBL Quantum Duo Gaming 2.0 RGB	1	2775e177-4e08-4f64-84a5-21bf23cda1e0	SKU-LOA-JBL-QUANTUM-79b2	1990000
8a9aa77f-8996-403f-9910-84f03e9bfe13	4e68573d-a9e1-42de-87e9-9e5e303bc5ae	Tản nhiệt nước Corsair iCUE H100i ELITE 240mm ARGB	2	4553435e-bcec-4a03-8a31-5b555153cc72	SKU-TAN-NHIET-NUOC--2315	2990000
13b458b3-8824-4959-bfb5-b5ac47d4f4ff	a93fbdd6-c74c-405e-ad09-e11a439fe38d	Dịch vụ Cài đặt Windows + Driver + Phần mềm cơ bản	1	5cdf1458-9328-4356-bad0-a0db12a96c01	SKU-DICH-VU-CAI-AT--c3c8	200000
798a93eb-696f-4126-b261-3e02a2eb6217	a93fbdd6-c74c-405e-ad09-e11a439fe38d	Dịch vụ Thu cũ đổi mới - Nâng cấp PC/Laptop	2	26b0c7d8-92b8-4df5-a9d1-d2bec9ae5a63	SKU-DICH-VU-THU-CU--9642	0
087160e9-a9e7-4c98-9433-4fdda9cdd18c	a93fbdd6-c74c-405e-ad09-e11a439fe38d	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB	1	be4e84a0-827c-4423-b422-66e7f0666055	SKU-VGA-SAPPHIRE-PU-6460	13990000
d1b5eea0-b2c2-4840-af38-c86a18f21cc4	9ae788e9-bc0c-4e91-817a-6d17726bc319	Tay cầm Logitech F310 Gamepad (PC)	1	34a1cb6c-d420-4274-bcf8-1ff35d5899ad	SKU-TAY-CAM-LOGITEC-fb6d	490000
d3bbe847-6a56-406e-840e-e4bb94c01e4e	9ae788e9-bc0c-4e91-817a-6d17726bc319	Lót chuột Pulsar Superglide Glass XL (Kính)	1	f9bb5c83-1ab5-48dd-9e11-d5e409134cd5	SKU-LOT-CHUOT-PULSA-a682	1290000
95050081-6bcf-4296-8dfc-3fc68248f83c	9ae788e9-bc0c-4e91-817a-6d17726bc319	CPU Intel Core i5-14600KF	2	78a2e491-51cf-4543-8232-d0c5381ec236	SKU-CPU-INTEL-CORE--ef74	6490000
cb7173f1-99b7-4a8e-ab49-43efbb05f633	9ae788e9-bc0c-4e91-817a-6d17726bc319	Tai nghe Logitech G PRO X 2 LIGHTSPEED (Over-ear Gaming)	2	d0ff246a-21e8-42f6-9d8b-7a9fb7c200f7	SKU-TAI-NGHE-LOGITE-70f2	4490000
fbefc244-bb87-4891-9e89-4b06cfa70b58	e9742d89-661e-49e3-bfbd-c4d42960059f	Laptop Gaming HP Victus 15-fa1093TX	1	459ae894-3e47-46f1-bdb0-f76f98701fa0	SKU-LAPTOP-GAMING-H-6d56	16490000
9c1b9182-6b1b-4b72-b96e-6255473ee848	8964f2bb-1169-4cb1-b3c6-cb0f74c58548	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)	1	02dab16b-b2ed-4fec-acfe-fdc1791badea	SKU-MAN-HINH-ASUS-P-2c94	11990000
9f24872f-98cb-4b74-913b-d2f8088e145f	8964f2bb-1169-4cb1-b3c6-cb0f74c58548	Pin dự phòng Anker PowerCore III Elite 25600mAh 87W PD	2	40f7fe07-d2d7-4aee-96fa-b33c64b36e46	SKU-PIN-DU-PHONG-AN-798c	1690000
c72dda7d-1476-4f9b-930e-fb4a71e6976d	8964f2bb-1169-4cb1-b3c6-cb0f74c58548	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB	2	be4e84a0-827c-4423-b422-66e7f0666055	SKU-VGA-SAPPHIRE-PU-6460	13990000
e7909ce1-5459-40f2-b83d-546fc41f8b0e	086b66fb-11c1-4003-918e-96163cb2d870	Laptop HP Pavilion 15-eg3098TU	1	d6868dd1-aeae-40c3-9abf-6e0ed896def7	SKU-LAPTOP-HP-PAVIL-9108	14990000
fa60badf-baf4-4955-baca-0ccd415c12fb	3a0cdc80-3d22-4ec9-bf50-4e83fb616a9f	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	2	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
6d0a05ce-f1c3-4367-ba08-3c85826ed2d7	d7d86adc-4b4e-4686-9908-590d2029d7a0	Bàn phím cơ Keychron Q1 Pro QMK/VIA	1	32088110-c215-444b-be19-395d6127837c	SKU-BAN-PHIM-CO-KEY-c3e3	4290000
e722f825-c55a-4a56-b6a7-4bb534dbf7e6	d7d86adc-4b4e-4686-9908-590d2029d7a0	PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super	1	ad5a8254-ed5c-44ff-8fd6-aeacb958fd25	SKU-PC-EZ4ENCE-RGB--4431	39900000
9cdbf518-712b-432a-ad84-26f24da6897f	d7d86adc-4b4e-4686-9908-590d2029d7a0	Tai nghe Sony WH-1000XM5 Wireless (Over-ear)	1	80fb6124-82fb-4da4-bc68-32b75623079a	SKU-TAI-NGHE-SONY-W-00dd	6990000
f4146e3e-6dfc-4250-af51-7934da58285c	d7d86adc-4b4e-4686-9908-590d2029d7a0	CPU Intel Core i7-14700K	2	0c3c4fa1-df56-4204-ab8d-ffed6ca14218	SKU-CPU-INTEL-CORE--316d	9990000
04d7633f-cf7f-4fd6-ad4f-28d6aaae3f85	7213b7a1-d626-4422-aaf2-d688d4892121	Đĩa Game PS5 - God of War Ragnarok	2	8777368b-e64b-4982-ac3b-ad52a1261213	SKU-IA-GAME-PS5-GOD-32e1	990000
5d5a4c73-a14f-408c-bc09-9623f22eb031	7213b7a1-d626-4422-aaf2-d688d4892121	Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming)	2	a74a3c9d-0da6-4c3f-b835-a7f6f08d35e1	SKU-MAN-HINH-SAMSUN-253d	3190000
94ee5918-924d-4f91-b2f3-69c4b0f996b7	2a20a906-443c-46f3-ba9e-879c4a5acac4	VGA ASUS Dual GeForce RTX 4060 Ti OC 8GB	1	30754f2a-443b-474c-be38-465b92b7a07f	SKU-VGA-ASUS-DUAL-G-e5ab	10990000
a614a1e2-8faa-4ee2-bc15-21b0cc9bdac9	d70774ec-40ea-47cd-9f26-99e0ce9a9412	Laptop Gaming MSI Stealth 16 AI Studio A1VIG	1	8a2891ad-9833-4414-93ab-125a1555eac6	SKU-LAPTOP-GAMING-M-4f35	55990000
47a0dc94-7389-4ea1-b4b3-3f1b92d1abea	70a57659-505b-497f-910e-1aacafbed105	Fan Case Lian Li UNI FAN SL-INFINITY 120 RGB 3 Pack	2	fabde16d-b8eb-466f-a6cb-717231fd4095	SKU-FAN-CASE-LIAN-L-1309	1890000
60c1eafe-4898-48af-9152-f2109b0ded93	70a57659-505b-497f-910e-1aacafbed105	Webcam Razer Kiyo Pro Ultra 4K	1	2fea62ce-8a54-4e6f-87f3-fa842bc1b08b	SKU-WEBCAM-RAZER-KI-4f71	6990000
6767ef26-35a4-4149-8d1e-b1691edc461c	70a57659-505b-497f-910e-1aacafbed105	Laptop ASUS Zenbook 14 OLED UX3405MA (Đồ hoạ)	2	84619042-98d7-44a2-b6f2-f502f7f38f64	SKU-LAPTOP-ASUS-ZEN-dd27	21490000
ac6b8c2f-38e8-4f0a-ace8-3a6247f3b4ae	70a57659-505b-497f-910e-1aacafbed105	CPU AMD Ryzen 5 7600X	2	b22f86ae-8749-458a-9ae1-37fdc31234c2	SKU-CPU-AMD-RYZEN-5-ed16	4990000
4d5ca7cc-a594-4d0e-8f6d-e762805db7d0	372dadc1-0aff-447c-9198-be6d5be35b8d	Router Wifi 6 ASUS RT-AX86U Pro	2	c6c4fd6f-e742-417e-8348-f443ee4bf46c	SKU-ROUTER-WIFI-6-A-8fd1	5490000
688faaca-92f7-477b-a115-7284fbf9d90b	372dadc1-0aff-447c-9198-be6d5be35b8d	Laptop Lenovo IdeaPad Slim 5 14IAH8	2	b01bc8c5-3a1e-4488-8f48-7498343c8aa7	SKU-LAPTOP-LENOVO-I-1f07	15990000
0b43b492-bf0d-44f1-b2d3-a162aecaefbc	3d2ffded-ce6a-47c0-9fbc-769b6b2ba4f2	PC EZ4ENCE Mini ITX - Intel i5 14400F / RTX 4060	2	f8c5f527-0207-4609-9e15-01a26f558d4e	SKU-PC-EZ4ENCE-MINI-6e7c	20500000
3f22e33c-6a82-44d9-85e9-feb8717877b2	e9eb8e57-8d6d-4620-8e96-7acda901dfc8	Case ASUS TUF Gaming GT302 ARGB Black	1	d3be33d4-bf09-47a1-9397-bb7d39e9a9fc	SKU-CASE-ASUS-TUF-G-0865	2490000
61e4ea2d-5070-4d4d-ba9c-b207a133713e	e9eb8e57-8d6d-4620-8e96-7acda901dfc8	Nintendo Switch OLED Model Mario Red Edition	2	a3f5dcef-448b-4f7a-b668-03a47d0beffb	SKU-NINTENDO-SWITCH-0dcb	8990000
ddb2ff5f-a687-4ade-8463-14ab3ed3a63e	e9eb8e57-8d6d-4620-8e96-7acda901dfc8	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G	1	c1231ae8-05fb-4d6c-9fd4-3bfea6bde52d	SKU-VGA-GIGABYTE-GE-b87a	22990000
58ba40b7-d888-49b0-97df-a245b3fa14a1	49ee87b1-fc08-4002-a1a7-ae72f88cca9f	Loa Creative Pebble V3 USB-C 2.0	1	47ab71e4-e7ac-4b80-ac32-de8a8348fb6e	SKU-LOA-CREATIVE-PE-d6a1	890000
c7333328-9d11-4f20-933f-aef1b3ce29a2	49ee87b1-fc08-4002-a1a7-ae72f88cca9f	Laptop ASUS VivoBook 15 OLED A1505VA	2	b376e183-80ba-465a-a979-2f21ed2db366	SKU-LAPTOP-ASUS-VIV-e6e2	17490000
dc68665f-deaa-4b8e-b5e5-b811cb16e28d	49ee87b1-fc08-4002-a1a7-ae72f88cca9f	Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack)	2	2c87a908-53a2-4da4-825b-1f9eea37ddb4	SKU-BO-PHAT-WIFI-ME-2bca	3790000
f9d304bb-4ff2-4862-8b78-912a9fdc8858	49ee87b1-fc08-4002-a1a7-ae72f88cca9f	Màn hình LG 3000Hz	1	72be7bef-4187-4fa2-a822-9168d58b11a2	SKU-MAN-HINH-L-539	2790000
cef0c8c5-4867-4a31-b395-a005c91cc1d9	f772aaad-02f8-4449-a31e-9cbd384d41f0	Switch TP-Link TL-SG1005D 5 Port Gigabit	2	c10cad36-d053-4df7-9a35-73c9c3981139	SKU-SWITCH-TP-LINK--42a3	290000
d39d3abf-39f2-4610-ba92-d143f1400971	3b28aff0-2ad8-456c-b649-96e48a39a979	Tai nghe Sony WF-1000XM5 True Wireless (In-ear)	2	ca1c4675-0780-49d4-8a8a-4a495fda979f	SKU-TAI-NGHE-SONY-W-2fc2	5290000
6a4d5aa1-2865-4d68-bde5-7e250aeb76f8	3b28aff0-2ad8-456c-b649-96e48a39a979	PC EZ4ENCE Hi-End - Intel i9 14900K / RTX 4090	1	d51436f9-5f08-4e7b-98dc-175f81c3c91c	SKU-PC-EZ4ENCE-HI-E-79ef	72000000
f6db3de2-729c-4033-a36d-2ea86e8cb9f4	7b611ce5-01ac-4f1a-ac43-e59548029a5a	CPU AMD Ryzen 9 7950X	1	2108c637-8b4b-45f2-9dd1-ad3c59778d64	SKU-CPU-AMD-RYZEN-9-8b3a	12990000
bace3953-b956-4676-b422-6331ba681ad8	7b611ce5-01ac-4f1a-ac43-e59548029a5a	Laptop Gaming MSI Stealth 16 AI Studio A1VIG	2	8a2891ad-9833-4414-93ab-125a1555eac6	SKU-LAPTOP-GAMING-M-4f35	55990000
c0cbe48f-eff9-431e-938d-e30d05329bfc	446ff316-fcf0-4ef2-b3ea-87c154be8277	Laptop ASUS Zenbook 14 OLED UX3405MA (Đồ hoạ)	2	84619042-98d7-44a2-b6f2-f502f7f38f64	SKU-LAPTOP-ASUS-ZEN-dd27	21490000
f3e5f77a-a78c-4d6f-909c-78047037bf81	446ff316-fcf0-4ef2-b3ea-87c154be8277	Mainboard ASUS ROG STRIX B760-F GAMING WIFI	1	0cf34fc2-f34a-4514-9721-13abdc0a0fea	SKU-MAINBOARD-ASUS--24db	6290000
f9a69edc-3f62-40d6-adf6-681a536b32dd	a18a9cc0-87ba-4cda-a909-7cc8ddc65eb1	Chuột Pulsar X2H Medium Wireless	2	8e82dd6b-4172-43d5-9506-b2ea532e344a	SKU-CHUOT-PULSAR-X2-707b	2190000
bb9d59cc-5389-4585-9b1e-551d009d4e29	1f52f76e-ac8e-4e83-9a1d-7b3ad8e3f101	Lót chuột SteelSeries QcK Heavy XXL	2	a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	SKU-LOT-CHUOT-STEEL-60f1	590000
a9878e66-2324-4cc1-9638-c71ba645012b	1f52f76e-ac8e-4e83-9a1d-7b3ad8e3f101	Tản nhiệt khí DeepCool AK620 Digital	1	e568031c-83fc-4aee-aca3-8754733254ec	SKU-TAN-NHIET-KHI-D-17a6	1590000
ea3f8553-8394-48a0-9eaf-03abbbaf281e	1f52f76e-ac8e-4e83-9a1d-7b3ad8e3f101	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	2	846271dc-fe28-4bb7-98f5-27c656af006a	SKU-RAM-GSKILL-TRID-04d8	2990000
ccd16ceb-b092-49b1-a17c-62f57f077c1c	967cbe36-50f5-4c61-9209-7c46f344c52e	Tản nhiệt nước Corsair iCUE H150i ELITE LCD XT	1	f1700d30-2877-49cf-ad67-5b402a3f1a57	SKU-TAN-NHIET-NUOC--cbd0	6490000
cf9a2373-bca5-407f-89b8-487c83f8b9aa	967cbe36-50f5-4c61-9209-7c46f344c52e	PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super	1	ad5a8254-ed5c-44ff-8fd6-aeacb958fd25	SKU-PC-EZ4ENCE-RGB--4431	39900000
b3340af8-3b4e-42b3-a1fd-fdf8675a3f8f	2bed18f2-de44-43e0-b98c-5ef707cb7411	Nintendo Switch OLED Model Mario Red Edition	1	a3f5dcef-448b-4f7a-b668-03a47d0beffb	SKU-NINTENDO-SWITCH-0dcb	8990000
17f7f28c-113a-4d32-b84c-0cc2b59bfaf2	2bed18f2-de44-43e0-b98c-5ef707cb7411	PC EZ4ENCE Hi-End - Intel i9 14900K / RTX 4090	2	d51436f9-5f08-4e7b-98dc-175f81c3c91c	SKU-PC-EZ4ENCE-HI-E-79ef	72000000
63bbf5b0-63cf-4589-b9fb-7d8203494d86	92e67867-7e18-41dd-b288-ff55e108e997	Laptop Gaming Acer Predator Helios Neo 16 PHN16-72	1	2eb02c56-0825-4d5c-83cf-0f2a6ba7bd31	SKU-LAPTOP-GAMING-A-ab24	33990000
999b1167-918b-45c4-ba17-dc77ca02551a	92e67867-7e18-41dd-b288-ff55e108e997	Webcam Razer Kiyo Pro Ultra 4K	1	2fea62ce-8a54-4e6f-87f3-fa842bc1b08b	SKU-WEBCAM-RAZER-KI-4f71	6990000
7f97dd49-e951-4400-bc90-7746049f683e	92e67867-7e18-41dd-b288-ff55e108e997	Máy chơi game Sony PlayStation 5 Slim (PS5 Slim)	2	cf79de01-d2fb-446e-9cd1-bbbd4d841ea3	SKU-MAY-CHOI-GAME-S-9710	12990000
63f3dfd2-f891-4ce1-9b5e-c7c79982f47f	b3e2b620-4936-4ebf-85bb-eeebcf719583	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)	2	02dab16b-b2ed-4fec-acfe-fdc1791badea	SKU-MAN-HINH-ASUS-P-2c94	11990000
44e98842-29a9-413f-b040-7015a07164cd	b3e2b620-4936-4ebf-85bb-eeebcf719583	Laptop ASUS VivoBook 15 OLED A1505VA	2	b376e183-80ba-465a-a979-2f21ed2db366	SKU-LAPTOP-ASUS-VIV-e6e2	17490000
712a891b-03e5-4ae8-9d4e-5c0f4eaa21d5	b3e2b620-4936-4ebf-85bb-eeebcf719583	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	2	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
9aed6b42-543a-494b-8d11-516449b5a415	b3e2b620-4936-4ebf-85bb-eeebcf719583	Macbook Pro M3 14 inch	1	298e1407-dd9b-4ca5-9050-a838ab8f82de	SKU-MACBOOK-PRO-M3--b8b4	37990000
baa659b3-6b13-47a8-a726-50bbac548470	a3888227-70e5-485c-8d74-b6abbd0d30f6	Laptop Gaming Acer Nitro V 15 ANV15-51	2	6f2ea8f0-b128-4fc4-b9c2-defb44671aa0	SKU-LAPTOP-GAMING-A-9a9b	18490000
1a03e640-491e-4c7a-811a-355c63fd9422	a3888227-70e5-485c-8d74-b6abbd0d30f6	Laptop Gaming ASUS TUF Gaming A15 FA507NV	2	35870f40-a432-47a1-a171-29d5d4ad0d6f	SKU-LAPTOP-GAMING-A-92f9	22990000
b000b0c3-d08f-43f4-a0cb-e69df18e963b	a3888227-70e5-485c-8d74-b6abbd0d30f6	Microphone Elgato Wave:3 Premium USB Condenser	2	624567ac-22aa-4c37-ba48-b16bee94251e	SKU-MICROPHONE-ELGA-0ad7	3690000
a6a8e6a0-1d11-44db-9cd7-a73ba3255685	def01526-9149-48de-9d25-4a5da59a54ac	Nguồn DeepCool PX1000G 1000W 80 Plus Gold - Full Modular	2	88dbdb40-9e09-430f-85bc-f823be2bbf77	SKU-NGUON-DEEPCOOL--be48	2990000
25e66ec6-72a1-4303-9532-cbe0f8540a6e	def01526-9149-48de-9d25-4a5da59a54ac	CPU AMD Ryzen 7 7800X3D	2	945a603e-7e0f-46b0-bfb6-95e20f480480	SKU-CPU-AMD-RYZEN-7-0fd0	9490000
f7071b16-b805-41e0-be92-d3b8cf939a9d	def01526-9149-48de-9d25-4a5da59a54ac	Tay cầm Sony DualSense Edge Wireless Controller (PS5)	2	20b719c9-41aa-4703-afc2-2043ca2007d7	SKU-TAY-CAM-SONY-DU-a318	5490000
31c37101-f37a-4377-8d6a-8af59ac48e46	c121893f-9276-4577-91c9-0751f870d949	PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super	1	ad5a8254-ed5c-44ff-8fd6-aeacb958fd25	SKU-PC-EZ4ENCE-RGB--4431	39900000
f1570fc5-3d1d-4a23-b25a-9fbcbeb93dac	c121893f-9276-4577-91c9-0751f870d949	Case Lian Li LANCOOL III RGB White	2	f5beff7a-1284-45b8-a4c6-35a924eff911	SKU-CASE-LIAN-LI-LA-2c67	3290000
17c78eba-21c3-4883-b724-c971dc07d01e	c121893f-9276-4577-91c9-0751f870d949	Đĩa Game PS5 - God of War Ragnarok	2	8777368b-e64b-4982-ac3b-ad52a1261213	SKU-IA-GAME-PS5-GOD-32e1	990000
d956acb4-5ee7-4959-af58-90ed79f4ccb8	80dd52aa-4e24-40ad-b0a6-26f60b055a09	Laptop Acer Swift 3 SF314-512	1	c508ce3f-183d-48f4-9057-58b3237a9c0f	SKU-LAPTOP-ACER-SWI-2713	15990000
ace08581-6230-4531-b63c-5a5d5ad4e424	80dd52aa-4e24-40ad-b0a6-26f60b055a09	Case Corsair 5000D Airflow Black	2	b91e005c-c743-4ac0-94d5-6dade8d87dd8	SKU-CASE-CORSAIR-50-2659	3690000
0e627605-7dd0-4103-a8bd-7461ca5427e8	80dd52aa-4e24-40ad-b0a6-26f60b055a09	Nguồn DeepCool PK650D 650W 80 Plus Bronze	1	4766d7c8-79cf-4256-b0cb-7acaa5eaf4a1	SKU-NGUON-DEEPCOOL--6412	1290000
ffa9207a-8f6e-4cc2-a8b4-2eaa816d3e23	4e1fd4d0-775e-4db5-af2e-3f09a07aefc8	Màn hình MSI MAG 274QRF QD E2 27 inch 2K 180Hz (Gaming)	2	d2717150-b101-4683-8f6f-ca1e68e9ea47	SKU-MAN-HINH-MSI-MA-f886	7490000
eccee2dd-5a65-4c97-9fbd-f8083f629c88	4e1fd4d0-775e-4db5-af2e-3f09a07aefc8	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB	1	8ce781dd-627d-4baa-af20-34e22c53036a	SKU-VGA-SAPPHIRE-NI-1e9b	11990000
b4efcd1f-bb93-4dee-a34d-b7da96b446b8	4e1fd4d0-775e-4db5-af2e-3f09a07aefc8	CPU AMD Ryzen 9 7950X	1	2108c637-8b4b-45f2-9dd1-ad3c59778d64	SKU-CPU-AMD-RYZEN-9-8b3a	12990000
46be8e88-fae2-4f6f-98f3-479bb6f520b9	f028eca6-4e35-4e2f-b682-376d5a1fa2d1	USB Samsung Bar Plus 256GB USB 3.1 400MB/s	1	b060ae2b-e7bb-4642-a834-45e2279e5bd3	SKU-USB-SAMSUNG-BAR-97b1	390000
6fba3535-55b1-4498-ae3a-db4d5056246d	f028eca6-4e35-4e2f-b682-376d5a1fa2d1	CPU Intel Core i5-14600KF	2	78a2e491-51cf-4543-8232-d0c5381ec236	SKU-CPU-INTEL-CORE--ef74	6490000
07309af6-e7c5-49b0-95df-555602adf7c6	f028eca6-4e35-4e2f-b682-376d5a1fa2d1	Laptop Acer Swift 3 SF314-512	2	c508ce3f-183d-48f4-9057-58b3237a9c0f	SKU-LAPTOP-ACER-SWI-2713	15990000
c4be8cef-8b2b-4ecc-82ca-8670438f57dd	f028eca6-4e35-4e2f-b682-376d5a1fa2d1	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	2	846271dc-fe28-4bb7-98f5-27c656af006a	SKU-RAM-GSKILL-TRID-04d8	2990000
2ab1a454-6415-4b88-a5e6-3653db4c285b	2747b6a3-ec20-4295-b358-233928ac01d7	Laptop HP Pavilion 15-eg3098TU	1	d6868dd1-aeae-40c3-9abf-6e0ed896def7	SKU-LAPTOP-HP-PAVIL-9108	14990000
5112cd3a-855b-4eba-a533-164c428faf37	2747b6a3-ec20-4295-b358-233928ac01d7	Bàn phím cơ Keychron Q1 Pro QMK/VIA	1	32088110-c215-444b-be19-395d6127837c	SKU-BAN-PHIM-CO-KEY-c3e3	4290000
84a149a3-5b79-4c06-8093-ea92a135e8c0	2747b6a3-ec20-4295-b358-233928ac01d7	Laptop Gaming HP OMEN 16-wd0013TX	2	241104f4-8a7b-4476-b231-171ac2aba2a9	SKU-LAPTOP-GAMING-H-2ea0	27990000
e057b7e0-80aa-4cf5-9b68-d02d4a7591a9	af7700ad-d4d1-446b-9599-0c5716afd12d	Laptop Gaming HP OMEN 16-wd0013TX	2	241104f4-8a7b-4476-b231-171ac2aba2a9	SKU-LAPTOP-GAMING-H-2ea0	27990000
3821b6c0-39e7-4b34-a1f5-5fdb3ee0bbfb	af7700ad-d4d1-446b-9599-0c5716afd12d	Tay cầm Sony DualSense Edge Wireless Controller (PS5)	2	20b719c9-41aa-4703-afc2-2043ca2007d7	SKU-TAY-CAM-SONY-DU-a318	5490000
a3a43e2a-1b61-4a29-a01c-77ad77055f9d	7bfed3d4-42e7-4da0-8b60-2b335985376f	Bàn phím cơ Keychron Q1 Pro QMK/VIA	2	32088110-c215-444b-be19-395d6127837c	SKU-BAN-PHIM-CO-KEY-c3e3	4290000
5ea107d1-dc58-4c80-be18-d2de9ec6a2a9	7bfed3d4-42e7-4da0-8b60-2b335985376f	Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm	1	705c0604-b442-47cb-8588-28a3867ad9c7	SKU-DICH-VU-BAO-HAN-ac18	990000
23edcb76-8946-477a-8751-153c8e32164e	7bfed3d4-42e7-4da0-8b60-2b335985376f	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	1	c0e9407b-12c2-4d6c-a2f2-663ec066e280	SKU-PC-EZ4ENCE-GAMI-50e6	32900000
f67b8ab4-c0fc-431a-9287-0526de4ff7a8	7bfed3d4-42e7-4da0-8b60-2b335985376f	Màn hình ASUS ProArt PA148CTV 14 inch FHD Touch (Cảm ứng)	1	a8cf303d-2c0d-4918-95dd-4e70d62090eb	SKU-MAN-HINH-ASUS-P-2e87	8990000
e0741f4c-4fa6-4812-8a0f-8ef0a453707d	4da02077-1f22-4602-87ed-3272760876f6	Tay cầm Logitech F310 Gamepad (PC)	1	34a1cb6c-d420-4274-bcf8-1ff35d5899ad	SKU-TAY-CAM-LOGITEC-fb6d	490000
4388f333-8f72-4515-a738-184ca10ae07c	4da02077-1f22-4602-87ed-3272760876f6	Macbook Pro M3 14 inch	2	298e1407-dd9b-4ca5-9050-a838ab8f82de	SKU-MACBOOK-PRO-M3--b8b4	37990000
70dc3a38-6c2a-437a-9e76-c8c16231f3b6	4da02077-1f22-4602-87ed-3272760876f6	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB	2	be4e84a0-827c-4423-b422-66e7f0666055	SKU-VGA-SAPPHIRE-PU-6460	13990000
ed259306-127d-4ce6-b8da-42215df3d0bc	4da02077-1f22-4602-87ed-3272760876f6	Lót chuột SteelSeries QcK Heavy XXL	1	a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	SKU-LOT-CHUOT-STEEL-60f1	590000
442ddd66-7d68-4cbc-b10e-e0c400047426	3d38a7cf-fd2b-4f28-826d-fcf671cb4443	Laptop Gaming MSI Thin GF63 12UC	1	98812a4e-4d18-49c4-8c22-dd77800a0014	SKU-LAPTOP-GAMING-M-816c	14490000
0f5a0bb5-8416-45dd-a301-efbf5e3e5ccb	3d38a7cf-fd2b-4f28-826d-fcf671cb4443	Loa Creative Pebble V3 USB-C 2.0	2	47ab71e4-e7ac-4b80-ac32-de8a8348fb6e	SKU-LOA-CREATIVE-PE-d6a1	890000
84a21718-640f-4e97-be36-f8343af38ea2	3d38a7cf-fd2b-4f28-826d-fcf671cb4443	RAM Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz	2	5331de62-a369-4a75-bb11-ca7ea2b4f754	SKU-RAM-KINGSTON-FU-4a98	1290000
2d736f31-8419-41e7-a7b3-2c49902289fc	b1de1dde-d36b-4628-bac4-c6afcaa343e9	Bàn phím cơ Logitech G Pro X TKL LIGHTSPEED	1	4c4745cc-8e8f-499e-93d5-c60814e442ce	SKU-BAN-PHIM-CO-LOG-c8e1	2990000
ce8ec2cf-f425-42a2-aa7b-9fc0fd0479f0	b1de1dde-d36b-4628-bac4-c6afcaa343e9	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)	2	02dab16b-b2ed-4fec-acfe-fdc1791badea	SKU-MAN-HINH-ASUS-P-2c94	11990000
691596f7-6dc1-49e2-85bd-0153605a359d	b1de1dde-d36b-4628-bac4-c6afcaa343e9	VGA MSI GeForce RTX 4080 Super VENTUS 3X OC 16G	2	7bb8de71-6b77-4d15-9b07-e26ebf34d15c	SKU-VGA-MSI-GEFORCE-72a3	28490000
54096bef-80d6-420d-8b58-63838faae6d4	f38a6604-bcb7-4afd-b0a0-50a9b09217d8	Nguồn Corsair RM750e 750W 80 Plus Gold - Full Modular	1	a90ca3cc-9e1c-47a9-b468-73feac4c178e	SKU-NGUON-CORSAIR-R-f21f	2490000
0aa6c24e-0cd5-47d8-b0af-ebe77426169b	f38a6604-bcb7-4afd-b0a0-50a9b09217d8	Tai nghe Corsair HS80 MAX Wireless (Over-ear Gaming)	2	cbfd6777-6d2b-4fc0-a395-f821a6ae44e3	SKU-TAI-NGHE-CORSAI-e7f3	3490000
61a6d7a0-8f1f-48e7-8f3d-739489a1ba23	f38a6604-bcb7-4afd-b0a0-50a9b09217d8	SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2	1	7ce19412-f015-47a2-b1f3-82f6e24f9a1f	SKU-SSD-KINGSTON-NV-a28e	890000
b7745475-f28c-4255-a6b4-f897f89a25ea	408bdff2-1d8a-49fb-b208-50055064f0b3	Chuột Logitech G502 X PLUS LIGHTSPEED	1	5b1f5aff-db50-42c2-9cae-f129acb7c371	SKU-CHUOT-LOGITECH--a5e6	2990000
0d7b48ce-1875-47ee-bfae-b812b51bed4b	408bdff2-1d8a-49fb-b208-50055064f0b3	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C	2	eed1d596-ea85-4971-9a95-16bb2549e49a	SKU-MAN-HINH-DELL-U-efa4	11490000
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status_history (id, order_id, status, description, created_at) FROM stdin;
f36c4355-9464-4659-b378-0d96dc57cf6a	cc9a5b6c-a8e8-4397-84c3-a97140794590	PENDING	Đơn hàng đã được tạo thành công	2026-06-17 18:35:58.399871+07
d73c468e-b098-4dd0-8e6b-d7b0104a53f0	d95cedaa-646a-4e2b-b525-ccc20b454ec3	PENDING	Đơn hàng đã được tạo thành công	2026-06-17 18:36:42.978445+07
d4dcf261-2f98-49af-8c70-903f437d95e2	e4fdbd6f-6bad-40ce-8072-f88fea5d85b2	PENDING	Đơn hàng đã được tạo thành công	2026-06-17 19:25:54.096706+07
e4ead111-b8a4-442c-aa84-2ff83b97d532	e4fdbd6f-6bad-40ce-8072-f88fea5d85b2	CONFIRMED	Trạng thái cập nhật thành CONFIRMED bởi Admin	2026-06-17 19:31:05.937722+07
319a54c0-9632-4a24-9432-7948f1739c36	d95cedaa-646a-4e2b-b525-ccc20b454ec3	DELIVERED	Trạng thái cập nhật thành DELIVERED bởi Admin	2026-06-17 19:31:16.324674+07
dd232cf8-f994-4d20-813b-85a3c1879c07	e0b35f19-2653-457e-9aed-05bfb9170bc9	PENDING	Đơn hàng đã được tạo thành công	2026-06-19 14:00:55.862366+07
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, address_id, status, payment_method, payment_status, payment_transaction_id, total_amount, shipping_fee, note, created_at, updated_at, promotion_id, discount_amount, shipping_provider) FROM stdin;
cc9a5b6c-a8e8-4397-84c3-a97140794590	662b1cd3-dbf4-4d88-acf9-fa0749b000d0	d0c816d5-1f71-4cc6-bf75-a8d5d4351fba	PENDING	COD	UNPAID	\N	111990000	30000	Test note	2026-06-17 18:35:58.399871+07	2026-06-17 18:35:58.399871+07	\N	0	\N
e4fdbd6f-6bad-40ce-8072-f88fea5d85b2	5d9f851d-dc99-4bdc-8f48-35f154bd4642	c1ab6478-6998-4416-928c-762052db54f6	CONFIRMED	COD	UNPAID	\N	3290000	0		2026-06-17 19:25:54.096706+07	2026-06-17 19:31:05.937722+07	\N	0	ghn_standard
d95cedaa-646a-4e2b-b525-ccc20b454ec3	5d9f851d-dc99-4bdc-8f48-35f154bd4642	939e76cb-992e-4655-922c-d70e76d6d3ef	DELIVERED	COD	UNPAID	\N	3290000	0		2026-06-17 18:36:42.978445+07	2026-06-17 19:31:16.324674+07	\N	0	ghn_standard
e0b35f19-2653-457e-9aed-05bfb9170bc9	5d9f851d-dc99-4bdc-8f48-35f154bd4642	c1ab6478-6998-4416-928c-762052db54f6	PENDING	PAYPAL	UNPAID	\N	3290000	0		2026-06-19 14:00:55.862366+07	2026-06-19 14:00:55.862366+07	\N	0	ghn_standard
e56629cd-260a-41c1-a91c-765c5f23af56	54664a35-d7b7-47ca-a380-cc2ae6a9e862	0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	DELIVERED	COD	UNPAID	\N	3190000	0	\N	2026-06-26 15:11:49.485399+07	2026-06-26 15:11:49.464966+07	\N	0	\N
8fece50f-63e6-4c41-8ce1-4a476ce4e709	48086f9d-9440-449b-9047-186cb5da6f0f	44244090-d7f5-4454-9239-68d535999781	SHIPPING	COD	UNPAID	\N	119840000	0	\N	2026-06-23 15:11:49.49365+07	2026-06-26 15:11:49.464966+07	\N	0	\N
4dab6211-e7a4-475f-913a-7ef8c8b47b75	6d1849b0-a680-4b82-8c20-2fef553a3c35	88744b11-3383-4158-8119-1af01c2c82a2	DELIVERED	COD	UNPAID	\N	4770000	0	\N	2026-04-23 15:11:49.498442+07	2026-06-26 15:11:49.464966+07	\N	0	\N
af3fa225-3e37-4b39-96b7-880f0fe7a2c4	f666787a-c092-495e-882b-71680be7276a	8ed1654e-f19f-4b41-bdb4-545683bd9d4c	PENDING	COD	UNPAID	\N	35000000	0	\N	2026-05-22 15:11:49.500817+07	2026-06-26 15:11:49.464966+07	\N	0	\N
c0897d3b-5ae4-4e91-be7e-d2355abbcee0	15550699-3c15-4611-8ab0-819e4dbbd4be	53e8ff5c-b880-4b57-bfc3-04db1c5870f6	DELIVERED	COD	UNPAID	\N	84840000	0	\N	2026-04-07 15:11:49.504057+07	2026-06-26 15:11:49.464966+07	\N	0	\N
8f406cd8-293b-4017-b500-d75417333e06	d2d8c4d9-af31-4102-af4e-fcf0b91885ab	e74340da-8e6b-4954-8317-1be97721a64e	DELIVERED	COD	UNPAID	\N	1190000	0	\N	2026-05-02 15:11:49.506525+07	2026-06-26 15:11:49.464966+07	\N	0	\N
90c14938-68ab-4e85-9f44-3fcfd7142757	00e2ab3a-4e07-41a8-9667-6908486c983f	4acdb2a0-e2d0-4001-8183-9433dc78c8a7	CANCELLED	COD	UNPAID	\N	1990000	0	\N	2026-04-23 15:11:49.509118+07	2026-06-26 15:11:49.464966+07	\N	0	\N
2c7e0e21-46c7-4dda-9501-f495ce25ab23	7ef618fc-4aea-488f-83eb-ff6673688916	8282a925-5490-4cfe-a726-86cc0846ce22	SHIPPING	COD	UNPAID	\N	18540000	0	\N	2026-06-03 15:11:49.512126+07	2026-06-26 15:11:49.464966+07	\N	0	\N
56b63fda-8ec6-44df-a029-5b161035d88a	54664a35-d7b7-47ca-a380-cc2ae6a9e862	0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	DELIVERED	COD	UNPAID	\N	29980000	0	\N	2026-04-25 15:11:49.513984+07	2026-06-26 15:11:49.464966+07	\N	0	\N
bf95e36b-c583-4ca8-adb8-ab5b3bad7e3a	5a4ff4c2-1bf2-4148-a789-6010e6ced4fe	d5d96109-9349-4f34-b646-143c5a30c427	DELIVERED	COD	UNPAID	\N	24040000	0	\N	2026-04-23 15:11:49.517237+07	2026-06-26 15:11:49.464966+07	\N	0	\N
3dcb864c-914f-4eb3-88a9-13fa4d390f22	06f64d50-a4de-4876-bfa0-839c64540eed	803eb945-9e59-4700-b6f7-cbf81a62666b	CONFIRMED	COD	UNPAID	\N	49850000	0	\N	2026-06-14 15:11:49.520042+07	2026-06-26 15:11:49.464966+07	\N	0	\N
cd5ea597-64eb-4fe4-a530-c1441779c134	c654bd54-f3da-4ac9-8d8f-399ea2de06a9	05e69232-0a9c-4801-addc-9c8e1b328907	CONFIRMED	COD	UNPAID	\N	37990000	0	\N	2026-05-22 15:11:49.52257+07	2026-06-26 15:11:49.464966+07	\N	0	\N
294701fb-4f92-495f-a392-f0e4249ea232	06f64d50-a4de-4876-bfa0-839c64540eed	803eb945-9e59-4700-b6f7-cbf81a62666b	DELIVERED	COD	UNPAID	\N	61530000	0	\N	2026-04-05 15:11:49.526212+07	2026-06-26 15:11:49.464966+07	\N	0	\N
cfe3f8af-f153-4e6a-81a3-835c3ea05664	637c516b-f30a-46c7-bb6d-855016d4da84	a8666abc-4a0e-4a71-996f-db7883351ec4	PENDING	COD	UNPAID	\N	17270000	0	\N	2026-04-19 15:11:49.528481+07	2026-06-26 15:11:49.464966+07	\N	0	\N
a46c0f73-7329-408b-bbf1-ea4c65f8b517	54664a35-d7b7-47ca-a380-cc2ae6a9e862	0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	DELIVERED	COD	UNPAID	\N	12580000	0	\N	2026-04-02 15:11:49.531563+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f0b12036-cca6-4ae8-9d84-999147fe1bd6	d2d8c4d9-af31-4102-af4e-fcf0b91885ab	e74340da-8e6b-4954-8317-1be97721a64e	CANCELLED	COD	UNPAID	\N	27270000	0	\N	2026-06-06 15:11:49.534121+07	2026-06-26 15:11:49.464966+07	\N	0	\N
19da3953-1eed-42b0-896d-2fec69791b77	54664a35-d7b7-47ca-a380-cc2ae6a9e862	0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	CANCELLED	COD	UNPAID	\N	70720000	0	\N	2026-05-02 15:11:49.53706+07	2026-06-26 15:11:49.464966+07	\N	0	\N
df5517da-7125-4313-b5f0-3ccbae598b47	c892a72f-7962-47db-a4d0-345461ef316f	d171a46a-e3b7-4cbf-a0d5-9a465cfc16ee	CANCELLED	COD	UNPAID	\N	85240000	0	\N	2026-05-12 15:11:49.5404+07	2026-06-26 15:11:49.464966+07	\N	0	\N
6e896218-64c3-44f1-abb2-f6c669a04e7a	8b9b0724-8d15-48e7-8465-e1ae3e2d625c	0a6585c8-404f-43ca-8fad-205fdae51325	DELIVERED	COD	UNPAID	\N	59040000	0	\N	2026-04-15 15:11:49.544048+07	2026-06-26 15:11:49.464966+07	\N	0	\N
74124ec6-33a0-40df-b205-ac4e3b9d298a	00e2ab3a-4e07-41a8-9667-6908486c983f	4acdb2a0-e2d0-4001-8183-9433dc78c8a7	SHIPPING	COD	UNPAID	\N	55000000	0	\N	2026-04-10 15:11:49.546127+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f64c6b50-3633-4240-981d-c8550602a5de	c892a72f-7962-47db-a4d0-345461ef316f	d171a46a-e3b7-4cbf-a0d5-9a465cfc16ee	DELIVERED	COD	UNPAID	\N	7870000	0	\N	2026-05-11 15:11:49.548659+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f4fef4e3-1f22-4c9d-b35f-d945286d9557	f1fcf118-37f4-45ce-b44c-ee70f694535f	9d128a5e-0be2-4fdc-b599-462817569f74	DELIVERED	COD	UNPAID	\N	10580000	0	\N	2026-06-06 15:11:49.550447+07	2026-06-26 15:11:49.464966+07	\N	0	\N
869b20e9-da85-4a3f-a3f0-da2ad0401165	c892a72f-7962-47db-a4d0-345461ef316f	d171a46a-e3b7-4cbf-a0d5-9a465cfc16ee	DELIVERED	COD	UNPAID	\N	13960000	0	\N	2026-05-03 15:11:49.553799+07	2026-06-26 15:11:49.464966+07	\N	0	\N
0bfc586c-f950-497f-8b21-00b2b90160ca	f666787a-c092-495e-882b-71680be7276a	8ed1654e-f19f-4b41-bdb4-545683bd9d4c	SHIPPING	COD	UNPAID	\N	6270000	0	\N	2026-06-01 15:11:49.55714+07	2026-06-26 15:11:49.464966+07	\N	0	\N
54a34b41-b409-481a-b99c-bd063bd65f0b	10a8bd2b-cbad-4de4-9c54-6054c558e047	cb646f99-cc69-4605-b411-21443ac97531	SHIPPING	COD	UNPAID	\N	15330000	0	\N	2026-04-15 15:11:49.56065+07	2026-06-26 15:11:49.464966+07	\N	0	\N
4675d0a2-0075-4c40-a87d-0bf188ed3400	f666787a-c092-495e-882b-71680be7276a	8ed1654e-f19f-4b41-bdb4-545683bd9d4c	SHIPPING	COD	UNPAID	\N	98960000	0	\N	2026-05-17 15:11:49.563333+07	2026-06-26 15:11:49.464966+07	\N	0	\N
2231fde4-4904-4b4f-9265-2c5c9b3fffe2	f666787a-c092-495e-882b-71680be7276a	8ed1654e-f19f-4b41-bdb4-545683bd9d4c	CANCELLED	COD	UNPAID	\N	61840000	0	\N	2026-04-07 15:11:49.566837+07	2026-06-26 15:11:49.464966+07	\N	0	\N
639d87c0-16ac-411d-9160-5fb55181d1d4	637c516b-f30a-46c7-bb6d-855016d4da84	a8666abc-4a0e-4a71-996f-db7883351ec4	PENDING	COD	UNPAID	\N	25570000	0	\N	2026-05-26 15:11:49.569772+07	2026-06-26 15:11:49.464966+07	\N	0	\N
bfff3c43-54c5-4a1f-a16f-0e55b022cffa	8d3cdbd8-41e9-40d9-be4b-f866ef1de910	8bf63e43-6c4b-41dd-bda8-e64ebd982e36	DELIVERED	COD	UNPAID	\N	15990000	0	\N	2026-05-09 15:11:49.57201+07	2026-06-26 15:11:49.464966+07	\N	0	\N
95b648b9-c0fe-4438-aad9-1b4f2f3ea557	d2d8c4d9-af31-4102-af4e-fcf0b91885ab	e74340da-8e6b-4954-8317-1be97721a64e	PENDING	COD	UNPAID	\N	60130000	0	\N	2026-05-25 15:11:49.575716+07	2026-06-26 15:11:49.464966+07	\N	0	\N
4f466c67-3713-4532-b7bb-3bcdf1f71267	f666787a-c092-495e-882b-71680be7276a	8ed1654e-f19f-4b41-bdb4-545683bd9d4c	SHIPPING	COD	UNPAID	\N	4580000	0	\N	2026-06-02 15:11:49.577598+07	2026-06-26 15:11:49.464966+07	\N	0	\N
1da4fafe-523d-4288-9177-c88f7a7d6dbc	54664a35-d7b7-47ca-a380-cc2ae6a9e862	0fd67e90-5ff1-4dbe-bbc9-d9a7b043a36b	DELIVERED	COD	UNPAID	\N	33320000	0	\N	2026-04-29 15:11:49.580764+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f5e2907d-215b-4324-8929-45d06e7cbd9f	10a8bd2b-cbad-4de4-9c54-6054c558e047	cb646f99-cc69-4605-b411-21443ac97531	DELIVERED	COD	UNPAID	\N	3330000	0	\N	2026-06-23 15:11:49.58287+07	2026-06-26 15:11:49.464966+07	\N	0	\N
ba9baccd-b0ff-45c6-ab04-35e328c48ce9	81366434-e5cb-4bd3-90a4-7ad68cd85836	8f77ef2e-9329-48a4-8288-881636bb2959	DELIVERED	COD	UNPAID	\N	78150000	0	\N	2026-05-05 15:11:49.586047+07	2026-06-26 15:11:49.464966+07	\N	0	\N
623cdc71-cb2b-4b7d-a8f8-db224ee64962	06f64d50-a4de-4876-bfa0-839c64540eed	803eb945-9e59-4700-b6f7-cbf81a62666b	DELIVERED	COD	UNPAID	\N	68360000	0	\N	2026-04-24 15:11:49.589953+07	2026-06-26 15:11:49.464966+07	\N	0	\N
34516fcc-8fc9-4e26-9269-0532a30589d1	81366434-e5cb-4bd3-90a4-7ad68cd85836	8f77ef2e-9329-48a4-8288-881636bb2959	DELIVERED	COD	UNPAID	\N	25740000	0	\N	2026-06-13 15:11:49.593587+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f01cdd59-fab9-4ea4-a4ed-c3c8ed331ac9	06f64d50-a4de-4876-bfa0-839c64540eed	803eb945-9e59-4700-b6f7-cbf81a62666b	DELIVERED	COD	UNPAID	\N	28670000	0	\N	2026-04-13 15:11:49.597494+07	2026-06-26 15:11:49.464966+07	\N	0	\N
42ca0264-8218-4b2c-b421-335ecacfd8a5	8b9b0724-8d15-48e7-8465-e1ae3e2d625c	0a6585c8-404f-43ca-8fad-205fdae51325	DELIVERED	COD	UNPAID	\N	32980000	0	\N	2026-05-25 15:11:49.599682+07	2026-06-26 15:11:49.464966+07	\N	0	\N
ba496ecd-f111-4de6-80b2-512c54497919	00e2ab3a-4e07-41a8-9667-6908486c983f	4acdb2a0-e2d0-4001-8183-9433dc78c8a7	CANCELLED	COD	UNPAID	\N	33730000	0	\N	2026-05-17 15:11:49.603548+07	2026-06-26 15:11:49.464966+07	\N	0	\N
bbd42101-0b17-4327-806d-ea737eac61a4	637c516b-f30a-46c7-bb6d-855016d4da84	a8666abc-4a0e-4a71-996f-db7883351ec4	SHIPPING	COD	UNPAID	\N	40440000	0	\N	2026-04-04 15:11:49.607253+07	2026-06-26 15:11:49.464966+07	\N	0	\N
a876938b-da0a-4c66-8f35-8073ce2e596d	637c516b-f30a-46c7-bb6d-855016d4da84	a8666abc-4a0e-4a71-996f-db7883351ec4	DELIVERED	COD	UNPAID	\N	1790000	0	\N	2026-04-19 15:11:49.609807+07	2026-06-26 15:11:49.464966+07	\N	0	\N
1663f295-4583-4fb0-8287-f7b08ef02956	8d3cdbd8-41e9-40d9-be4b-f866ef1de910	8bf63e43-6c4b-41dd-bda8-e64ebd982e36	PENDING	COD	UNPAID	\N	96060000	0	\N	2026-04-09 15:11:49.613215+07	2026-06-26 15:11:49.464966+07	\N	0	\N
1e8cecb6-5d3f-4657-b8ab-34ccb319cb9f	8d3cdbd8-41e9-40d9-be4b-f866ef1de910	8bf63e43-6c4b-41dd-bda8-e64ebd982e36	PENDING	COD	UNPAID	\N	49460000	0	\N	2026-06-03 15:11:49.616421+07	2026-06-26 15:11:49.464966+07	\N	0	\N
e10f8d63-d879-4f3d-8027-3e1754058912	06f64d50-a4de-4876-bfa0-839c64540eed	803eb945-9e59-4700-b6f7-cbf81a62666b	DELIVERED	COD	UNPAID	\N	59470000	0	\N	2026-05-03 15:11:49.620314+07	2026-06-26 15:11:49.464966+07	\N	0	\N
bfee08d5-b0f6-4bdb-940c-840c338054a2	5a4ff4c2-1bf2-4148-a789-6010e6ced4fe	d5d96109-9349-4f34-b646-143c5a30c427	DELIVERED	COD	UNPAID	\N	1850000	0	\N	2026-05-19 15:11:49.623099+07	2026-06-26 15:11:49.464966+07	\N	0	\N
215e595a-62c9-4892-b71b-d338a2ede70a	8d3cdbd8-41e9-40d9-be4b-f866ef1de910	8bf63e43-6c4b-41dd-bda8-e64ebd982e36	DELIVERED	COD	UNPAID	\N	56570000	0	\N	2026-06-10 15:11:49.626008+07	2026-06-26 15:11:49.464966+07	\N	0	\N
f97a83ec-8464-45e4-90ca-237a028b3f4a	81366434-e5cb-4bd3-90a4-7ad68cd85836	8f77ef2e-9329-48a4-8288-881636bb2959	DELIVERED	COD	UNPAID	\N	4960000	0	\N	2026-06-14 15:11:49.628294+07	2026-06-26 15:11:49.464966+07	\N	0	\N
236a4289-235c-41cd-a952-6cbc4fc4c9c2	81366434-e5cb-4bd3-90a4-7ad68cd85836	8f77ef2e-9329-48a4-8288-881636bb2959	CANCELLED	COD	UNPAID	\N	7580000	0	\N	2026-06-18 15:11:49.630329+07	2026-06-26 15:11:49.464966+07	\N	0	\N
66b3aafc-3f1f-4b98-906d-6e6b5e91f7dc	f1fcf118-37f4-45ce-b44c-ee70f694535f	9d128a5e-0be2-4fdc-b599-462817569f74	CANCELLED	COD	UNPAID	\N	110000000	0	\N	2026-04-04 15:11:49.63327+07	2026-06-26 15:11:49.464966+07	\N	0	\N
ee08800c-0da7-4bb7-ba12-f02a27b9d508	c654bd54-f3da-4ac9-8d8f-399ea2de06a9	05e69232-0a9c-4801-addc-9c8e1b328907	PENDING	COD	UNPAID	\N	14750000	0	\N	2026-04-23 15:11:49.637784+07	2026-06-26 15:11:49.464966+07	\N	0	\N
41e8eb5a-ce05-4ba0-af05-d22d476f545c	87a3416a-2f28-4cd5-acfa-74ebdc0774a5	52a71950-e389-429f-8895-3cd5fc2ba65a	SHIPPING	COD	UNPAID	\N	88760000	0	\N	2026-06-14 15:12:24.867298+07	2026-06-26 15:12:24.846927+07	\N	0	\N
65f16ab1-d0b5-4997-8039-2b82711accc3	300bfb37-10ee-421b-bd97-7e6dfc8c9689	1540f746-0a64-4542-a019-df099ec2afcc	PENDING	COD	UNPAID	\N	890000	0	\N	2026-04-02 15:12:24.871773+07	2026-06-26 15:12:24.846927+07	\N	0	\N
5d9d6114-b8b0-49ea-91d9-b10970176213	93556805-fdab-45e1-9be6-e47684eec120	7b978ba1-a274-42fa-89e7-059adb2ff152	DELIVERED	COD	UNPAID	\N	41980000	0	\N	2026-05-06 15:12:24.87635+07	2026-06-26 15:12:24.846927+07	\N	0	\N
c493b6e0-b7fd-4569-b554-7c4d6c344d4d	6d7d98d9-ac6c-48ed-bf4d-dc0d0dd172a9	2a6d2b45-9f28-4a0e-bc98-58dfdd764637	CONFIRMED	COD	UNPAID	\N	1290000	0	\N	2026-04-28 15:12:24.878462+07	2026-06-26 15:12:24.846927+07	\N	0	\N
b96fb5b7-1a25-4e24-a3cf-4122b1fc6514	7d04da9b-ef68-4f38-af0c-46300b51de79	d9fc82e6-1982-4548-8e80-020e86c40e74	DELIVERED	COD	UNPAID	\N	4990000	0	\N	2026-06-01 15:12:24.88061+07	2026-06-26 15:12:24.846927+07	\N	0	\N
b64baa80-835e-41c7-8a2b-4c375b4f1f9a	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	DELIVERED	COD	UNPAID	\N	96770000	0	\N	2026-04-22 15:12:24.88338+07	2026-06-26 15:12:24.846927+07	\N	0	\N
1ae04287-105d-4906-83b9-12724d935ccb	c86c4f6a-9868-4c21-b6d9-ec6d558373da	f15d6a96-8944-49f8-b778-0ebc82c40ced	DELIVERED	COD	UNPAID	\N	1980000	0	\N	2026-06-23 15:12:24.885262+07	2026-06-26 15:12:24.846927+07	\N	0	\N
125e2ffd-1b7c-4480-b9e9-29a6b39dd78a	79a1ee4a-f0b3-4555-b652-943bfd259924	157fecc1-b935-411b-9f13-038265f12130	SHIPPING	COD	UNPAID	\N	17360000	0	\N	2026-05-18 15:12:24.888972+07	2026-06-26 15:12:24.846927+07	\N	0	\N
8fb663d9-bb93-4b51-ba4b-4ec366246ed9	cc19e280-d5c7-4616-a117-ca29341ea383	b414d319-e839-4978-a619-cea4811c566e	DELIVERED	COD	UNPAID	\N	17500000	0	\N	2026-04-24 15:12:24.892809+07	2026-06-26 15:12:24.846927+07	\N	0	\N
896a2e0f-d0ce-4f77-a483-4fd47dfe1300	626b7614-6d6e-4c9b-a10f-7fd2b837422f	5a489ce2-75ca-4fdc-8e15-d183f2ddd6a2	DELIVERED	COD	UNPAID	\N	24360000	0	\N	2026-06-26 15:12:24.896215+07	2026-06-26 15:12:24.846927+07	\N	0	\N
4e68573d-a9e1-42de-87e9-9e5e303bc5ae	cc19e280-d5c7-4616-a117-ca29341ea383	b414d319-e839-4978-a619-cea4811c566e	CONFIRMED	COD	UNPAID	\N	5980000	0	\N	2026-04-27 15:12:24.898233+07	2026-06-26 15:12:24.846927+07	\N	0	\N
a93fbdd6-c74c-405e-ad09-e11a439fe38d	626b7614-6d6e-4c9b-a10f-7fd2b837422f	5a489ce2-75ca-4fdc-8e15-d183f2ddd6a2	SHIPPING	COD	UNPAID	\N	14190000	0	\N	2026-06-09 15:12:24.902608+07	2026-06-26 15:12:24.846927+07	\N	0	\N
9ae788e9-bc0c-4e91-817a-6d17726bc319	292ae0da-38e8-4f6b-ab48-f6e33069a3ce	f16f1103-aff8-40e8-b242-e5185b5e7cde	DELIVERED	COD	UNPAID	\N	23740000	0	\N	2026-04-21 15:12:24.906376+07	2026-06-26 15:12:24.846927+07	\N	0	\N
e9742d89-661e-49e3-bfbd-c4d42960059f	a9a9dce7-d12e-416b-b95d-f8d0b878e5a3	54d8e9da-b991-4e3c-96d8-14adfd3f1576	DELIVERED	COD	UNPAID	\N	16490000	0	\N	2026-05-06 15:12:24.908623+07	2026-06-26 15:12:24.846927+07	\N	0	\N
8964f2bb-1169-4cb1-b3c6-cb0f74c58548	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	SHIPPING	COD	UNPAID	\N	43350000	0	\N	2026-04-21 15:12:24.911582+07	2026-06-26 15:12:24.846927+07	\N	0	\N
086b66fb-11c1-4003-918e-96163cb2d870	93556805-fdab-45e1-9be6-e47684eec120	7b978ba1-a274-42fa-89e7-059adb2ff152	DELIVERED	COD	UNPAID	\N	14990000	0	\N	2026-06-22 15:12:24.91341+07	2026-06-26 15:12:24.846927+07	\N	0	\N
3a0cdc80-3d22-4ec9-bf50-4e83fb616a9f	2b426ae4-21c8-46de-ab4a-9a3e5d38c376	cd41e729-7571-4179-9a30-aaa1f97b78eb	SHIPPING	COD	UNPAID	\N	65800000	0	\N	2026-04-05 15:12:24.915419+07	2026-06-26 15:12:24.846927+07	\N	0	\N
d7d86adc-4b4e-4686-9908-590d2029d7a0	6d7d98d9-ac6c-48ed-bf4d-dc0d0dd172a9	2a6d2b45-9f28-4a0e-bc98-58dfdd764637	DELIVERED	COD	UNPAID	\N	71160000	0	\N	2026-06-06 15:12:24.918552+07	2026-06-26 15:12:24.846927+07	\N	0	\N
7213b7a1-d626-4422-aaf2-d688d4892121	93556805-fdab-45e1-9be6-e47684eec120	7b978ba1-a274-42fa-89e7-059adb2ff152	DELIVERED	COD	UNPAID	\N	8360000	0	\N	2026-06-25 15:12:24.920891+07	2026-06-26 15:12:24.846927+07	\N	0	\N
2a20a906-443c-46f3-ba9e-879c4a5acac4	5f222848-9f66-44eb-a46a-26bd4b138164	6d65833e-4fd6-43cd-b9d0-024f3fdc59bf	DELIVERED	COD	UNPAID	\N	10990000	0	\N	2026-04-01 15:12:24.923682+07	2026-06-26 15:12:24.846927+07	\N	0	\N
d70774ec-40ea-47cd-9f26-99e0ce9a9412	292ae0da-38e8-4f6b-ab48-f6e33069a3ce	f16f1103-aff8-40e8-b242-e5185b5e7cde	SHIPPING	COD	UNPAID	\N	55990000	0	\N	2026-05-04 15:12:24.925858+07	2026-06-26 15:12:24.846927+07	\N	0	\N
70a57659-505b-497f-910e-1aacafbed105	68fd3c58-bfb6-4cd8-ad59-02d3568c249a	3d7c401e-3ca1-4b85-ae19-aa7324315881	PENDING	COD	UNPAID	\N	63730000	0	\N	2026-06-15 15:12:24.929026+07	2026-06-26 15:12:24.846927+07	\N	0	\N
372dadc1-0aff-447c-9198-be6d5be35b8d	292ae0da-38e8-4f6b-ab48-f6e33069a3ce	f16f1103-aff8-40e8-b242-e5185b5e7cde	DELIVERED	COD	UNPAID	\N	42960000	0	\N	2026-06-11 15:12:24.931891+07	2026-06-26 15:12:24.846927+07	\N	0	\N
3d2ffded-ce6a-47c0-9fbc-769b6b2ba4f2	5f222848-9f66-44eb-a46a-26bd4b138164	6d65833e-4fd6-43cd-b9d0-024f3fdc59bf	DELIVERED	COD	UNPAID	\N	41000000	0	\N	2026-05-28 15:12:24.934306+07	2026-06-26 15:12:24.846927+07	\N	0	\N
e9eb8e57-8d6d-4620-8e96-7acda901dfc8	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	SHIPPING	COD	UNPAID	\N	43460000	0	\N	2026-04-26 15:12:24.937566+07	2026-06-26 15:12:24.846927+07	\N	0	\N
49ee87b1-fc08-4002-a1a7-ae72f88cca9f	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	DELIVERED	COD	UNPAID	\N	46240000	0	\N	2026-06-12 15:12:24.941194+07	2026-06-26 15:12:24.846927+07	\N	0	\N
f772aaad-02f8-4449-a31e-9cbd384d41f0	cc19e280-d5c7-4616-a117-ca29341ea383	b414d319-e839-4978-a619-cea4811c566e	CONFIRMED	COD	UNPAID	\N	580000	0	\N	2026-06-16 15:12:24.94367+07	2026-06-26 15:12:24.846927+07	\N	0	\N
3b28aff0-2ad8-456c-b649-96e48a39a979	a9a9dce7-d12e-416b-b95d-f8d0b878e5a3	54d8e9da-b991-4e3c-96d8-14adfd3f1576	DELIVERED	COD	UNPAID	\N	82580000	0	\N	2026-04-22 15:12:24.946284+07	2026-06-26 15:12:24.846927+07	\N	0	\N
7b611ce5-01ac-4f1a-ac43-e59548029a5a	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	PENDING	COD	UNPAID	\N	124970000	0	\N	2026-05-16 15:12:24.948624+07	2026-06-26 15:12:24.846927+07	\N	0	\N
446ff316-fcf0-4ef2-b3ea-87c154be8277	93556805-fdab-45e1-9be6-e47684eec120	7b978ba1-a274-42fa-89e7-059adb2ff152	SHIPPING	COD	UNPAID	\N	49270000	0	\N	2026-05-18 15:12:24.951009+07	2026-06-26 15:12:24.846927+07	\N	0	\N
a18a9cc0-87ba-4cda-a909-7cc8ddc65eb1	28fe64c6-5d2f-47a8-8014-632f76cac6c6	4593ee48-4dea-4b6b-b8a3-fc5d912374d6	DELIVERED	COD	UNPAID	\N	4380000	0	\N	2026-04-13 15:12:24.953193+07	2026-06-26 15:12:24.846927+07	\N	0	\N
1f52f76e-ac8e-4e83-9a1d-7b3ad8e3f101	2b426ae4-21c8-46de-ab4a-9a3e5d38c376	cd41e729-7571-4179-9a30-aaa1f97b78eb	PENDING	COD	UNPAID	\N	8750000	0	\N	2026-05-18 15:12:24.956602+07	2026-06-26 15:12:24.846927+07	\N	0	\N
967cbe36-50f5-4c61-9209-7c46f344c52e	1b94e300-e05d-411e-a90a-49e4dbe9470e	9407380b-8487-44f0-8caa-cce4c9b9f231	DELIVERED	COD	UNPAID	\N	46390000	0	\N	2026-05-09 15:12:24.95921+07	2026-06-26 15:12:24.846927+07	\N	0	\N
2bed18f2-de44-43e0-b98c-5ef707cb7411	28fe64c6-5d2f-47a8-8014-632f76cac6c6	4593ee48-4dea-4b6b-b8a3-fc5d912374d6	CONFIRMED	COD	UNPAID	\N	152990000	0	\N	2026-05-31 15:12:24.96181+07	2026-06-26 15:12:24.846927+07	\N	0	\N
92e67867-7e18-41dd-b288-ff55e108e997	8884b7ed-21b9-40de-9f2a-b52fe6078c31	f5a847ff-a9de-48e0-9f2f-f720772817b6	DELIVERED	COD	UNPAID	\N	66960000	0	\N	2026-06-26 15:12:24.964963+07	2026-06-26 15:12:24.846927+07	\N	0	\N
b3e2b620-4936-4ebf-85bb-eeebcf719583	6d7d98d9-ac6c-48ed-bf4d-dc0d0dd172a9	2a6d2b45-9f28-4a0e-bc98-58dfdd764637	CONFIRMED	COD	UNPAID	\N	162750000	0	\N	2026-04-22 15:12:24.968385+07	2026-06-26 15:12:24.846927+07	\N	0	\N
a3888227-70e5-485c-8d74-b6abbd0d30f6	c86c4f6a-9868-4c21-b6d9-ec6d558373da	f15d6a96-8944-49f8-b778-0ebc82c40ced	SHIPPING	COD	UNPAID	\N	90340000	0	\N	2026-05-27 15:12:24.971721+07	2026-06-26 15:12:24.846927+07	\N	0	\N
def01526-9149-48de-9d25-4a5da59a54ac	7d04da9b-ef68-4f38-af0c-46300b51de79	d9fc82e6-1982-4548-8e80-020e86c40e74	SHIPPING	COD	UNPAID	\N	35940000	0	\N	2026-05-22 15:12:24.975565+07	2026-06-26 15:12:24.846927+07	\N	0	\N
c121893f-9276-4577-91c9-0751f870d949	300bfb37-10ee-421b-bd97-7e6dfc8c9689	1540f746-0a64-4542-a019-df099ec2afcc	CANCELLED	COD	UNPAID	\N	48460000	0	\N	2026-05-16 15:12:24.978784+07	2026-06-26 15:12:24.846927+07	\N	0	\N
80dd52aa-4e24-40ad-b0a6-26f60b055a09	8884b7ed-21b9-40de-9f2a-b52fe6078c31	f5a847ff-a9de-48e0-9f2f-f720772817b6	SHIPPING	COD	UNPAID	\N	24660000	0	\N	2026-04-08 15:12:24.982278+07	2026-06-26 15:12:24.846927+07	\N	0	\N
4e1fd4d0-775e-4db5-af2e-3f09a07aefc8	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	CANCELLED	COD	UNPAID	\N	39960000	0	\N	2026-06-15 15:12:24.985583+07	2026-06-26 15:12:24.846927+07	\N	0	\N
f028eca6-4e35-4e2f-b682-376d5a1fa2d1	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	63249c88-9baf-4cde-9601-f82578135e6e	DELIVERED	COD	UNPAID	\N	51330000	0	\N	2026-06-01 15:12:24.989903+07	2026-06-26 15:12:24.846927+07	\N	0	\N
2747b6a3-ec20-4295-b358-233928ac01d7	28fe64c6-5d2f-47a8-8014-632f76cac6c6	4593ee48-4dea-4b6b-b8a3-fc5d912374d6	SHIPPING	COD	UNPAID	\N	75260000	0	\N	2026-03-28 15:12:24.993297+07	2026-06-26 15:12:24.846927+07	\N	0	\N
af7700ad-d4d1-446b-9599-0c5716afd12d	68b21c3a-04e9-495e-926c-a460ff4de48b	b3e3d898-5ac4-4efa-a8e6-313f762e83f1	PENDING	COD	UNPAID	\N	66960000	0	\N	2026-04-29 15:12:24.995987+07	2026-06-26 15:12:24.846927+07	\N	0	\N
7bfed3d4-42e7-4da0-8b60-2b335985376f	87a3416a-2f28-4cd5-acfa-74ebdc0774a5	52a71950-e389-429f-8895-3cd5fc2ba65a	DELIVERED	COD	UNPAID	\N	51460000	0	\N	2026-04-14 15:12:24.999779+07	2026-06-26 15:12:24.846927+07	\N	0	\N
4da02077-1f22-4602-87ed-3272760876f6	7d04da9b-ef68-4f38-af0c-46300b51de79	d9fc82e6-1982-4548-8e80-020e86c40e74	DELIVERED	COD	UNPAID	\N	105040000	0	\N	2026-06-25 15:12:25.003217+07	2026-06-26 15:12:24.846927+07	\N	0	\N
3d38a7cf-fd2b-4f28-826d-fcf671cb4443	79a1ee4a-f0b3-4555-b652-943bfd259924	157fecc1-b935-411b-9f13-038265f12130	DELIVERED	COD	UNPAID	\N	18850000	0	\N	2026-05-25 15:12:25.007027+07	2026-06-26 15:12:24.846927+07	\N	0	\N
b1de1dde-d36b-4628-bac4-c6afcaa343e9	2464a8eb-d330-490d-9a72-64469e478654	72e82dc2-b5b0-4656-a98c-f9f8f15b5e0e	CANCELLED	COD	UNPAID	\N	83950000	0	\N	2026-03-29 15:12:25.010551+07	2026-06-26 15:12:24.846927+07	\N	0	\N
f38a6604-bcb7-4afd-b0a0-50a9b09217d8	7d04da9b-ef68-4f38-af0c-46300b51de79	d9fc82e6-1982-4548-8e80-020e86c40e74	SHIPPING	COD	UNPAID	\N	10360000	0	\N	2026-04-04 15:12:25.013472+07	2026-06-26 15:12:24.846927+07	\N	0	\N
408bdff2-1d8a-49fb-b208-50055064f0b3	7d04da9b-ef68-4f38-af0c-46300b51de79	d9fc82e6-1982-4548-8e80-020e86c40e74	SHIPPING	COD	UNPAID	\N	25970000	0	\N	2026-04-21 15:12:25.016594+07	2026-06-26 15:12:24.846927+07	\N	0	\N
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, product_id, url, alt_text, is_primary) FROM stdin;
b8c42ba0-5994-4437-87d6-3399cd1ccdef	320dd017-8df7-4242-b586-206d64837bf6	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop	\N	t
ad5081f2-15d0-4cfb-b732-33e98d3b6606	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	https://res.cloudinary.com/dtbbbq4zr/image/upload/v1782371720/ez4gear/products/jglyzeuqcmtltybmiosw.jpg	\N	t
4d33dcb4-b2e3-47f1-ab99-2b99458e77e0	a7d1da40-140d-45e0-96f1-3d2d8e9518bf	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
bf2b00c4-a434-48c7-9967-b82040f9abbc	a7d1da40-140d-45e0-96f1-3d2d8e9518bf	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
0a5118be-838e-4a4b-b2c5-ad5ad64009fe	13a13af0-1ef6-49ad-8441-192cc24baddd	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
b5adbf02-e9c9-4e29-aaf3-a6a7b3a8447d	13a13af0-1ef6-49ad-8441-192cc24baddd	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
50da470e-4355-4594-858c-c87b9da0c525	13a13af0-1ef6-49ad-8441-192cc24baddd	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
2a592c5f-4196-4c81-8e29-f237a9730894	1a7d577b-c680-4f0d-afc3-4a8f5cc50fab	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
55695627-5e7f-4975-947e-55fcb7146f16	1a7d577b-c680-4f0d-afc3-4a8f5cc50fab	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
ca09f2a2-5e49-4aa4-969e-c53e6d205687	1c3b8f59-0e23-486f-bc23-c691dd301fa3	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
d2480e9c-d9a7-4b99-92bf-6175f2fcb889	1c3b8f59-0e23-486f-bc23-c691dd301fa3	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
774a379b-cd16-4508-8937-c3ac0775cc7a	1c3b8f59-0e23-486f-bc23-c691dd301fa3	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d778b848-c0d1-4058-8f57-612b9a5d0550	1c3b8f59-0e23-486f-bc23-c691dd301fa3	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
a521b03c-559a-4824-9789-3a8031a91423	c41bd84a-19ed-4c3b-9b33-082bc8bb64c8	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
cd64db94-9902-4b1c-8603-a28090ede24c	c41bd84a-19ed-4c3b-9b33-082bc8bb64c8	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
fbf002e0-ca5f-4194-b23b-8a2d9e30289d	49235fba-ba0f-4955-8d8e-8a9d5549a489	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
c7489c4d-7cab-4520-8e5f-e34c2144edfa	49235fba-ba0f-4955-8d8e-8a9d5549a489	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
acab4cf8-94d4-4d2f-a20c-90ac21ece11d	11c926db-4026-4998-8cde-a036257dd5e2	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
3210186d-78ec-408b-a2cf-329dd9a4bcfa	11c926db-4026-4998-8cde-a036257dd5e2	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
08c2416d-cc75-468b-84ef-b96df4f7bb68	e28f37a8-0cdb-4808-8a86-9891782c92ee	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
75a92c61-7e65-47d3-ae04-4fc06e436580	e28f37a8-0cdb-4808-8a86-9891782c92ee	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
a23d0f24-cf06-4fc8-880a-e011bde54d4b	e64046d4-49ba-48e7-9be4-84bc3b255805	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
e3c5bcc4-ac1c-43f7-ad8b-b0c63fede04e	e64046d4-49ba-48e7-9be4-84bc3b255805	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
e2e2ab16-dcd4-40cc-8ec2-1f01218df5c9	e64046d4-49ba-48e7-9be4-84bc3b255805	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
3b7fdd82-fd9c-4c6f-985e-8e5a3b90e139	e86163eb-f063-475b-916e-16226861433d	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
08fd3d27-b294-4d58-8056-2e4ed71ae705	e86163eb-f063-475b-916e-16226861433d	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
f7392009-625c-40af-9a92-abe7f7535cdb	e86163eb-f063-475b-916e-16226861433d	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
22f6a79e-3901-406b-8785-1f4fc75434f4	e86163eb-f063-475b-916e-16226861433d	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
edeafea6-ed73-4955-893e-6c1ecf6c4398	f32a6a6f-5293-4f80-b4c0-9d0d9ce16dc5	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
93f2e739-a655-44c2-8f6e-1822fd73861d	f32a6a6f-5293-4f80-b4c0-9d0d9ce16dc5	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
a4275f7b-7a62-42b2-803c-1157b6ea502d	d5ff6911-2106-4bec-aa65-78f3ae038963	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
930cd665-7242-4725-a764-b57f053f43c3	d5ff6911-2106-4bec-aa65-78f3ae038963	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
30a2cef3-12d7-4891-a1ea-a5ab4faf391d	d5ff6911-2106-4bec-aa65-78f3ae038963	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
41a88cf2-206c-4859-9f3d-1312609d30a3	0d1046f3-c815-431e-9ade-361ba0f4a5dc	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
2955bf57-9864-4d18-9376-3f041c086e7d	0d1046f3-c815-431e-9ade-361ba0f4a5dc	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
8d530fd2-fde2-4d7f-8a46-71786c1d1c49	0d1046f3-c815-431e-9ade-361ba0f4a5dc	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
b74f7e58-d135-4f29-82f5-0f53234b5c1a	f310f38e-abd7-4e83-a0cb-4e4df5411053	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
66e4bcdc-b4a2-45e7-8634-a0775a17b328	f310f38e-abd7-4e83-a0cb-4e4df5411053	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
71fb8e37-5c4f-48ee-afb8-8f2bc11d9e96	f310f38e-abd7-4e83-a0cb-4e4df5411053	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
ea389a50-4557-4cc1-9fb9-0c17cd1a93c7	11cbd1da-df88-49c5-8125-40c5214d3534	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
863ac0e4-cb21-488f-bb1f-3f34510982bf	11cbd1da-df88-49c5-8125-40c5214d3534	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
27907559-0361-4eeb-bfb8-041c1a1466c1	398f6f62-1e6f-4622-957b-124783d47dfc	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
cd6c4e0d-02b0-4079-8c06-5f895b3bb9f7	398f6f62-1e6f-4622-957b-124783d47dfc	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
6ae5202f-ef3b-408d-929e-97e0ab47ac3e	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
870cc236-ae8e-48f6-8232-1b6ee135b7a9	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
1cd69ac0-d40d-44dd-9e90-28713ac432e3	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
123016c0-a13f-499d-a371-35a6adb029d0	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
58479d24-6b9c-4906-9bb4-2453146df328	33d8fa71-584e-4520-8127-51f808ed4db0	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
05ebf0c4-e905-4331-8603-5f4136e909b2	33d8fa71-584e-4520-8127-51f808ed4db0	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
c5853c05-a766-487c-b5a0-15409a91a56f	33d8fa71-584e-4520-8127-51f808ed4db0	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
d0e1b9f6-7605-480a-966e-a1fb8ca7cbc3	6fc9965c-2fad-4774-8ba7-6759d1eade59	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
9292fa0b-0102-40c4-8f3b-9022ae8dcbd3	6fc9965c-2fad-4774-8ba7-6759d1eade59	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
7377e4e1-bfc3-42fd-a177-bf46a8cfd800	6fc9965c-2fad-4774-8ba7-6759d1eade59	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
025fdd63-c6a0-467e-b6c6-fb2861ff940a	0c684519-9458-4392-94c5-fc58c4cae36b	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
23db0537-6e12-4d4f-be74-81509bcb4d3b	0c684519-9458-4392-94c5-fc58c4cae36b	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
29c7c1d5-63d2-444e-9ae0-f2dc12c73f4b	0c684519-9458-4392-94c5-fc58c4cae36b	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
606ef7dd-58ba-4a20-8290-3dd4b20483e1	c576a465-9b71-44b4-8498-c8968ebd321f	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
42166c07-26a4-4cf7-9e1d-6f12b94a3477	c576a465-9b71-44b4-8498-c8968ebd321f	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
6ed30903-93ba-4e4c-9649-3f1abc76a757	c576a465-9b71-44b4-8498-c8968ebd321f	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d6352d10-8295-4f02-8f79-9d8b4159e109	55829253-2025-4d35-9af2-1f8b7159c8fa	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
60eabf28-1fef-4ca0-802d-fdd4bc98d11f	55829253-2025-4d35-9af2-1f8b7159c8fa	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
02c86231-0254-46a1-88cf-c9df16eab126	55829253-2025-4d35-9af2-1f8b7159c8fa	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
3c8b664c-2791-4e30-80ea-4021ca583309	55829253-2025-4d35-9af2-1f8b7159c8fa	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
ace7a2aa-d23b-45a0-994a-48dcad3de77c	c059088e-31bb-4f99-825a-a4f24f3a460a	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
8372fff2-7ce2-431f-afdc-44631be26dbc	c059088e-31bb-4f99-825a-a4f24f3a460a	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
895b6dc9-c079-47de-83c7-98e24945e14b	c059088e-31bb-4f99-825a-a4f24f3a460a	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
e436e563-29f5-4a50-b7e5-6882a1d5de25	da9c4dc2-b1ae-414b-b497-848e02cc0640	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
0721d203-12dc-4023-9b6d-8d732675588e	da9c4dc2-b1ae-414b-b497-848e02cc0640	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
6e7e7e9e-6434-4a30-9173-5075e911d266	da9c4dc2-b1ae-414b-b497-848e02cc0640	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
c2453069-1c53-440f-b77f-a2a4fa520254	da9c4dc2-b1ae-414b-b497-848e02cc0640	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
5562dd6f-ae6f-4910-8e3b-b168274bc5b7	73ccfc73-b291-4d0d-8614-2454c513c52d	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
ff76c700-7d9a-4fef-bb84-283f5487d9f3	73ccfc73-b291-4d0d-8614-2454c513c52d	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
624afc55-54b6-46fc-9970-eb1b2bb2a732	73ccfc73-b291-4d0d-8614-2454c513c52d	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
d43bb529-67cc-43c3-be9f-40648644246b	73ccfc73-b291-4d0d-8614-2454c513c52d	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
a3a38c4d-998c-4e11-8133-5e5a28cb97c7	7fa092e4-8c5e-47cb-8675-4b488afaeb03	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
a9834ecb-441a-4957-a0d9-ca9b1d79821a	7fa092e4-8c5e-47cb-8675-4b488afaeb03	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
0c6fe159-a4ae-41c6-bb96-f62a5100530b	7fa092e4-8c5e-47cb-8675-4b488afaeb03	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
97c01e3f-9276-4e9c-8623-2096e91bc4c5	b81df3c9-8378-4840-8a47-61f5938b4ea3	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
4faebd1a-6af7-46fa-a098-6e0a7bde3ee6	b81df3c9-8378-4840-8a47-61f5938b4ea3	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
98de2e6c-e64e-4947-932a-a9a92cb85da0	b81df3c9-8378-4840-8a47-61f5938b4ea3	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
31ce4665-34c2-4b8d-a8f2-176bd4794360	b81df3c9-8378-4840-8a47-61f5938b4ea3	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
acb7597c-bc30-4987-8a92-71ba8ef2f540	e946a9ce-d0ca-41d0-8676-2afb40177dce	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
0ddc18c8-33cf-4839-89a2-5bb7528344db	e946a9ce-d0ca-41d0-8676-2afb40177dce	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
499cedfe-b053-4cd3-a894-cd51b2a85046	52f8148c-0809-407b-b87e-92d33a2c2cf0	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
cd0001c7-9477-4e13-9bdf-e99d63cfec31	52f8148c-0809-407b-b87e-92d33a2c2cf0	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
f14e8af9-1d40-4df5-bf10-180c1f908cf9	33162d0f-c694-46d3-b77f-a3ac4aa79b8e	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
8c014be2-20a2-4f7a-81a1-3b3efa1fc376	33162d0f-c694-46d3-b77f-a3ac4aa79b8e	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
c0f91cc8-7b25-4030-a0d5-f173af2cad13	0df1c67e-a4b4-4dd6-850c-36bb91e038fb	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
bc34b0f0-77fc-4d9a-b288-e7109ae7799e	0df1c67e-a4b4-4dd6-850c-36bb91e038fb	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
43fc8c5b-e095-4458-a3a6-5107a798e9a0	286ac23c-cfce-4333-a698-676266445aeb	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
354b7723-572b-4453-ad7f-0db0285665e1	286ac23c-cfce-4333-a698-676266445aeb	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
a1b808a2-cc3d-4877-9525-e75abd143885	176b8c89-50c1-4a55-ad7f-79ec44f4c0b6	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
9ef4ff69-8001-444f-a8ed-9bafc84bb49e	176b8c89-50c1-4a55-ad7f-79ec44f4c0b6	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
bfd8b403-d3d6-4fd7-883f-e3301e1d4b8c	35b4e4a2-4d8a-4e1e-9158-6d5398fdaf76	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
e74ed2b5-69ef-467c-8d3f-0e2837d0828e	35b4e4a2-4d8a-4e1e-9158-6d5398fdaf76	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
78f8095d-66a9-42c1-8e86-15e3d94c65eb	610f140b-8bb6-4e6c-8558-7b92454b03a1	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
2d136781-014e-4ddd-9cae-54d4f72d7be8	610f140b-8bb6-4e6c-8558-7b92454b03a1	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
dbb86726-223e-48ba-b3a6-b928b8f77607	610f140b-8bb6-4e6c-8558-7b92454b03a1	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
fde1459c-e0a4-4410-93a1-017c799555ae	34278b7d-5e39-4e90-b90b-31bd475fdbbc	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
2715e1ce-87de-4999-9df1-a399e4d26ce5	34278b7d-5e39-4e90-b90b-31bd475fdbbc	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
92a35ba4-e82e-4f5e-9869-c16590f6c642	34278b7d-5e39-4e90-b90b-31bd475fdbbc	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
8858ccdf-ba7d-47e0-b0a6-dc4887306dd1	34278b7d-5e39-4e90-b90b-31bd475fdbbc	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
0c3271ac-b4aa-47fc-949c-776ca77c65d7	5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
637e6e16-79db-49c1-914e-559fadd63977	5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
69cfe8fa-1af4-44fb-86d9-2f3a921e164f	5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
55039b5b-45a2-4eb6-a285-1149c1f2910d	409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
eee4d2ef-7bc2-4fd0-9cea-5c07f84bf75a	409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
a95b6406-f233-45ae-91dc-caf00c8ff334	409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
d2cdd682-11d1-4a12-80a1-ef2738c9cdd8	6f96555a-0bab-45ae-af6f-1869ff95c11b	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
8661c9e2-22d8-477b-974c-70ce02dc6cf9	6f96555a-0bab-45ae-af6f-1869ff95c11b	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
0fe01230-b41f-4214-99df-db5dc6a60717	ccc7d7e7-9056-483a-adca-3db4f2c2b1d3	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
f34d23f6-79db-4f01-94dd-88b2f30f7919	ccc7d7e7-9056-483a-adca-3db4f2c2b1d3	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
88d7d87c-5428-45ee-8eb0-fc9116a24b2c	34218397-9610-4644-a1bf-75bab8578e60	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
ce0865ab-c2c7-4ad7-980b-aad26fcf2abd	34218397-9610-4644-a1bf-75bab8578e60	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
0f71c4f8-03f2-4490-b7f5-170d90989958	34218397-9610-4644-a1bf-75bab8578e60	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
39f5ff8f-ff76-468b-8475-3c337dd3e42f	34218397-9610-4644-a1bf-75bab8578e60	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
986ef7fe-5244-4cde-990f-6a7d8d83fa92	098bddd6-0521-4853-ba74-8e390485fc3b	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
17986f0f-714b-409f-98cf-d86e0984af5c	098bddd6-0521-4853-ba74-8e390485fc3b	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
ae28b485-31a8-4e00-a455-6d819ff6d9e2	098bddd6-0521-4853-ba74-8e390485fc3b	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
24022983-0d2f-4323-8bfa-5b503e5e6e56	39951c7f-2926-4aeb-b9ac-4ba0e999b485	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
5d8b20e9-be63-4e59-81ef-bf57ff5ce05f	39951c7f-2926-4aeb-b9ac-4ba0e999b485	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
9e53f578-975e-4def-a4ce-396af13f8c9d	39951c7f-2926-4aeb-b9ac-4ba0e999b485	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
d0644a1d-8f40-441c-9763-29027d071c7a	4a925c9b-a8d0-40e3-a33b-bebd0618f806	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
31faf130-3e0a-4ba1-887d-5153731ec4b7	4a925c9b-a8d0-40e3-a33b-bebd0618f806	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
966332f8-30dc-49b4-a1e1-4901e1785608	1cc41405-4ba0-4900-b91e-1da7abf75ca2	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
18575670-c000-4286-9161-dd9c077523ce	1cc41405-4ba0-4900-b91e-1da7abf75ca2	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
22e3ef0a-45ee-4127-977e-957104208b91	1cc41405-4ba0-4900-b91e-1da7abf75ca2	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
0b039b42-5ac8-4161-bee9-58b81d5a66ce	bcb5e2b2-e7da-47f6-a131-8549f379885f	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
1d3d56a6-cb52-4a73-81e3-f10a9c76f1d7	bcb5e2b2-e7da-47f6-a131-8549f379885f	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
6ef8d333-9c8e-40f0-9cd2-a6388a306bd3	a7d1da40-140d-45e0-96f1-3d2d8e9518bf	https://res.cloudinary.com/dtbbbq4zr/image/upload/v1782977039/ez4gear/products/yvtoih6jtp8ze6trwt80.png	\N	t
a62c43ac-c378-49fe-8e74-23a1442984fd	bcb5e2b2-e7da-47f6-a131-8549f379885f	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
2b896022-0eb0-4e9b-ae9b-b4943fb27b50	bcb5e2b2-e7da-47f6-a131-8549f379885f	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
21b50b2d-d772-442a-90bd-3bb736311e54	d30e93a1-7f89-456e-93c4-d8b652fc05ae	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
230e9537-5b49-4ce5-b35b-b45cecdcd968	d30e93a1-7f89-456e-93c4-d8b652fc05ae	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
b601c893-92bb-4f8d-9fe8-46ffac2f35a9	1882a154-5296-4b9d-bb7d-fa7f494598e6	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
bcba2c36-8290-40c4-a5d4-1e7034697aa1	1882a154-5296-4b9d-bb7d-fa7f494598e6	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
3d651fa0-3c22-489a-b91b-2f72b8db8836	1882a154-5296-4b9d-bb7d-fa7f494598e6	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
12ec1f5c-d850-464a-88fd-29febac75894	320dd017-8df7-4242-b586-206d64837bf6	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
f6fd8a30-deb2-498f-b684-2774b86113d2	320dd017-8df7-4242-b586-206d64837bf6	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
a8b35ec7-d4ce-4d9f-a97c-7d72fe5294c3	320dd017-8df7-4242-b586-206d64837bf6	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
fd5504a4-6bc7-42b7-b9f4-78df52e7f2fd	7d8e1672-bb2d-49f7-9304-219de80fde85	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
922ef19e-6f72-4f2e-b474-e58f4a3642a0	7d8e1672-bb2d-49f7-9304-219de80fde85	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
0589e923-76a7-4529-9153-c4dbcbeaa971	9c7dbf7a-7548-4a45-a49a-713b28c765f6	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
dc46c7bc-bfbd-4ec4-9966-315f17bb63dc	9c7dbf7a-7548-4a45-a49a-713b28c765f6	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
babac232-4863-4a48-9db2-09b28043d3bb	672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
b72c0182-2b36-41d9-a7a6-21fceabe9ae2	672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
ed40803b-d0b9-41e2-b297-25d87d8d1d04	672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
0c4f6cba-da64-41d7-b58a-805fdde7179c	3f7b0454-5005-4cb4-b956-3c3f304aae31	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
a7888317-9818-42d3-9c76-f7e844e0fbab	3f7b0454-5005-4cb4-b956-3c3f304aae31	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
7c539e8e-04b3-444e-8c33-a5190881d734	3f7b0454-5005-4cb4-b956-3c3f304aae31	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
65eb773b-59c7-4ff5-b8c8-953d553235ec	3f7b0454-5005-4cb4-b956-3c3f304aae31	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
5e7a470c-8b6e-4d79-a4c4-abfe682d619b	f6af6fa8-a4b9-4089-9e86-1c79ef262893	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
939b8241-73bc-4e14-ab09-2a75f08b3136	f6af6fa8-a4b9-4089-9e86-1c79ef262893	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
0a34469e-56c2-45d4-8101-26b82a553654	f6af6fa8-a4b9-4089-9e86-1c79ef262893	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
1f6c3197-0682-4861-8566-471b7424970f	f6af6fa8-a4b9-4089-9e86-1c79ef262893	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
dbbfffee-08f9-4de6-a2ac-8d5b40392559	76537b6b-3947-4570-bd09-9b942da18b16	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
25019ad5-4cf5-4aa5-8781-5bf6ff84f1ca	76537b6b-3947-4570-bd09-9b942da18b16	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
47d505dc-177a-4f27-b8b1-5d1e202d7f24	1a7d577b-c680-4f0d-afc3-4a8f5cc50fab	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop	\N	t
ce796cfa-1f73-4d0f-a089-491606a8b57a	c41bd84a-19ed-4c3b-9b33-082bc8bb64c8	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop	\N	t
8d930f5f-1ce7-49b9-886e-f10dfbec1f7e	f32a6a6f-5293-4f80-b4c0-9d0d9ce16dc5	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop	\N	t
94209f44-a666-49c1-8828-d317474f8ffb	e64046d4-49ba-48e7-9be4-84bc3b255805	https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop	\N	t
1f4b1356-6a03-4fd1-8893-2001a157ad67	e86163eb-f063-475b-916e-16226861433d	https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop	\N	t
56f74929-621a-4b21-b863-f4bf2873da08	d5ff6911-2106-4bec-aa65-78f3ae038963	https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop	\N	t
6370a16b-067b-480d-9b69-699442d0bf3a	e28f37a8-0cdb-4808-8a86-9891782c92ee	https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop	\N	t
9e71d739-428a-4e8b-aafb-164ed2dde74b	0d1046f3-c815-431e-9ade-361ba0f4a5dc	https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=400&h=400&fit=crop	\N	t
17e5a8bf-bbed-41ad-91ed-3ebd1023ac74	f310f38e-abd7-4e83-a0cb-4e4df5411053	https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=400&fit=crop	\N	t
6b096266-8ace-4f0c-9063-063b76682554	11cbd1da-df88-49c5-8125-40c5214d3534	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop	\N	t
3c069aed-c032-4c72-a704-c0c56c574ba5	11c926db-4026-4998-8cde-a036257dd5e2	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop	\N	t
095528fb-4ec3-4d9d-ab1d-bfaaab76e803	76537b6b-3947-4570-bd09-9b942da18b16	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
793c0faa-473b-410d-8686-0de5c179cc9e	76537b6b-3947-4570-bd09-9b942da18b16	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
b0c576da-7837-4044-b1cf-b7eb243cdfc8	068dd5c4-703a-434e-8418-c36d69a45ba7	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
991c7a0d-2469-4557-8448-0141467e0761	33d8fa71-584e-4520-8127-51f808ed4db0	https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop	\N	t
f03be11b-5455-44f3-8f03-c0d57bc8d1d4	6fc9965c-2fad-4774-8ba7-6759d1eade59	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop	\N	t
44e2d0e3-7f74-4fa2-b5f9-5f84133008e1	398f6f62-1e6f-4622-957b-124783d47dfc	https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=400&fit=crop	\N	t
c0ea054f-9a5f-44f6-8be7-b86b8ad3a34f	0c684519-9458-4392-94c5-fc58c4cae36b	https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=400&fit=crop	\N	t
e467a9d4-1b19-4132-b9cb-e2098734f213	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop	\N	t
70435779-27aa-4402-a43a-690b1d3c869e	bd7ee9ba-19e1-42eb-ba3d-2a418db77f99	https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop	\N	t
1fe9e2f7-7f94-47db-b30b-135e65a5fa99	ccbf3cdb-c33f-4369-ba0b-53f29756fe36	https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop	\N	t
462dddb9-e50f-4cd2-b453-a1347622b696	cca9603a-511c-42b6-aa58-80950c67cf81	https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=400&fit=crop	\N	t
ef35e75a-8182-4a2f-87ba-16ca342b8141	c576a465-9b71-44b4-8498-c8968ebd321f	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop	\N	t
65433350-1f88-4de3-8cf4-5107af678963	4f3f7912-6d11-4da8-a748-e3e267e5c964	https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&h=400&fit=crop	\N	t
a9ce0e05-9ae5-40a3-a4cd-05d719ceaeca	91f5fedc-a603-4b3d-b4fb-7a2349a9b2b3	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
8ba00b3a-97a8-4109-a49d-84a981b97de4	ffedbefe-4189-46cf-ad79-e0de62b77216	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop	\N	t
5e873016-b85d-4e44-958e-6746319c2c29	482ef6da-9507-4f18-a9d7-f1ed54002b33	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
0b5f3fdd-adf0-4323-9b9a-a25c09638765	f16669aa-3ed1-4c33-8405-25b37a6d760d	https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop	\N	t
447f8d75-a360-462b-8129-769cf385a73a	82265e80-b490-4908-94d4-bad608ea0710	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop	\N	t
9cb81725-ad05-467e-a820-32aad5c75b95	afedfef3-6135-4397-88fa-a47320bbe2bf	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop	\N	t
4a565f01-beb4-4626-b69e-72ed7b5fd3ee	3e1d5f73-4a62-466b-b6ab-6408bad293ca	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
27f66e6f-88c5-4499-b0b0-a4b6a2a0cb17	20c7eaea-1349-41d8-b6c3-453bc036de01	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=400&h=400&fit=crop	\N	t
8adc2ea9-d65a-4a3c-ae87-27035b3d39da	95a4a8e0-1851-461f-a567-5ccb6216e805	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop	\N	t
1eb0c65a-2bc4-4a67-9672-30024faab0d9	13a13af0-1ef6-49ad-8441-192cc24baddd	https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop	\N	t
1bc3f39c-f7d9-41b7-a8c1-056cd4466c01	ce138998-e674-46bc-8195-e9fe600ae5e3	https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop	\N	t
68ab4406-297a-4048-b318-bcd4c9bbbdad	bc639769-6888-4202-a7a8-b03453a32b7b	https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop	\N	t
7763c1ea-f1cf-479a-9ba6-5a7aeb2fe5f8	c059088e-31bb-4f99-825a-a4f24f3a460a	https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop	\N	t
935f19b9-7ce5-415e-9cd6-62bc16c6a133	da9c4dc2-b1ae-414b-b497-848e02cc0640	https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop	\N	t
05248724-e1d7-4e0a-bb87-00985da42c5e	55829253-2025-4d35-9af2-1f8b7159c8fa	https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop	\N	t
850c2412-7b2d-48dc-9aaa-63603f932ae3	52f8148c-0809-407b-b87e-92d33a2c2cf0	https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=400&fit=crop	\N	t
61e989f0-7728-4908-8b36-500ddf6f83a3	33162d0f-c694-46d3-b77f-a3ac4aa79b8e	https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop	\N	t
2d56cd2f-bb8c-4466-aae5-bc16e2f7f87b	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop	\N	t
23fac327-d285-4884-aed3-7bcc63ada12a	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop	\N	t
86c53960-1af6-439e-a019-8ffde02bbcc2	72105a2f-dd39-4f90-b944-c825c4bd9c8f	https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop	\N	t
86968db8-46ed-4820-b58f-aeca8a159505	f6a6d2a9-8021-4321-9af8-0bb6b6106d64	https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop	\N	t
6230014f-fe17-437a-81f8-e80d57b8ddbf	cba63ba3-b910-4dfb-a5e2-fd69932a9dea	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop	\N	t
42223159-f458-4e19-8ae7-9bed02e153d4	49235fba-ba0f-4955-8d8e-8a9d5549a489	https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop	\N	t
7a6759c2-e09b-422f-8adb-4d78b35af12a	1c3b8f59-0e23-486f-bc23-c691dd301fa3	https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop	\N	t
76866925-d68a-42f8-914a-1d09b3295e79	9be4ee89-47a0-4376-ac32-997a7e859e4c	https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop	\N	t
e3ee27d0-115d-4401-ad31-6d319b02293a	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop	\N	t
aab26c49-d3f6-44e7-9cc1-9571bff34f40	c29324b9-2947-46f5-9719-6128552d5ed4	https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop	\N	t
25046117-819f-40b2-bca9-e98ac081ab65	be625c9c-e0a4-4147-8bba-70d5b83fce7b	https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=400&fit=crop	\N	t
80271fae-4424-428d-97da-07917910b896	8d3b1f7a-f483-4f0a-8139-165d6463e7df	https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop	\N	t
ca7b2a99-33d8-4694-baa9-e60c2dda893d	9675afd9-7e24-4fd1-9d19-ce1817238d7a	https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop	\N	t
9f0ef1bf-50d1-4b9a-8f57-bf5fe6bd57be	c7d7b673-e0d1-4966-99c5-9b7d3792aeef	https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop	\N	t
47b8cc59-1307-42d1-ad4f-bc5be21d6523	440918d8-d3f7-4b21-8bab-4c54c05a1e54	https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop	\N	t
c1bb16bb-7b26-4f8f-a223-c5ef2715247d	32e2cc84-167b-4c65-b522-6610e60f986f	https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop	\N	t
ac251623-0b27-4b2c-8a9a-02a67d713134	b81df3c9-8378-4840-8a47-61f5938b4ea3	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop	\N	t
9e03d58f-bcb9-4aca-8671-6377c38a5f8f	35b4e4a2-4d8a-4e1e-9158-6d5398fdaf76	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop	\N	t
10e39988-6425-47e8-85c9-b1122433379c	e946a9ce-d0ca-41d0-8676-2afb40177dce	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop	\N	t
1b38baad-eec5-4c8d-9d17-60dce8b70291	610f140b-8bb6-4e6c-8558-7b92454b03a1	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop	\N	t
2e3eda83-f4cc-43b4-9c55-b2ff7d8073b0	7fa092e4-8c5e-47cb-8675-4b488afaeb03	https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=400&fit=crop	\N	t
c1c09558-7346-44d0-8ea5-371fd363032d	6f96555a-0bab-45ae-af6f-1869ff95c11b	https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop	\N	t
3477acc9-c380-4539-bf4c-5413bf32db67	38634d1c-b0de-47f3-b089-0e0d0e2c1338	https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop	\N	t
9be61a88-8ec7-456b-b7ca-6193ad3fb63c	52818677-11a3-4c2b-b70d-36608cc1741f	https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop	\N	t
361abaaf-7d3f-4f66-a780-76939c3eb792	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop	\N	t
15f7a6da-1413-4cf1-96a1-a594705ef6f7	73ccfc73-b291-4d0d-8614-2454c513c52d	https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&h=400&fit=crop	\N	t
36b3e80b-2505-4183-ac5e-4f112851a389	50d202d0-5918-4314-9035-1b7c4ca02264	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
df216874-2608-4895-8f3e-db6c61437d90	6069f04a-6357-460a-9873-7b70f720c426	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
1b1609a4-d029-4bb6-a915-acb9edcebb04	457f3063-930a-4598-bd44-3f52b933bdb3	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
75cfe1ac-fb37-47a8-ae21-7d6d6d953350	ba4d3b01-f4f7-4661-91b9-fa988776c02c	https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=400&h=400&fit=crop	\N	t
29f1f0d4-5243-4a92-bc57-e8d6b52a16b8	81518aa3-6c3f-46db-97fb-2cf3bd8de875	https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop	\N	t
57b2d65a-0b31-4530-88ab-06beaa0780c8	39951c7f-2926-4aeb-b9ac-4ba0e999b485	https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop	\N	t
5222dfbb-d03e-4c27-ac5d-a1c51b3d2d70	4a925c9b-a8d0-40e3-a33b-bebd0618f806	https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop	\N	t
8fc318a0-70d8-4864-b64f-cfdcb0a9422f	5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop	\N	t
445ad5a9-91a4-4ce5-82c9-11afa52e901d	409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop	\N	t
3098124e-71ab-4db4-9498-daac748702a4	83c6d96a-370b-496e-817c-5f32f1b4ef1e	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop	\N	t
3199f632-0183-4dc8-a7b7-4dc960d6cd5b	26024f19-c86a-45df-9102-8d24a0d93c2f	https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=400&fit=crop	\N	t
51c9d164-2ed6-44e0-bf4e-374e67302cda	9d322044-c4b0-4788-8f7a-fd28b976743e	https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop	\N	t
fcbbebdd-c6a2-4a61-9c16-2f3be532c5ae	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop	\N	t
9aeb1cd3-423c-4f0a-91ba-3f5215b2a9a3	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop	\N	t
2ea1de39-b30d-46fb-b550-85a8aeb48b08	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop	\N	t
ebedceea-043b-4727-8b75-eb4ab94adc27	7a8a80d1-4919-4b76-bdfb-9cd806867994	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop	\N	t
adbaca47-3b65-404f-b71f-18cca9b5639b	fe0f4c1b-6b4a-4261-b034-317664596603	https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=400&fit=crop	\N	t
180a5e08-1224-4a00-b2fe-4c4694484e35	050a51e3-3a04-443d-a71c-c8cbc06269d7	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop	\N	t
74ddf982-8073-4f9e-a5c5-8fc6ebc6a7cb	1d539479-cf0c-4910-9423-50fe30854007	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop	\N	t
8989a745-adfd-45ee-8a21-d3d711c6f3d7	87fb89a5-89df-4619-a16e-ab3689ffe205	https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop	\N	t
b84f2d64-fd84-485d-8eb3-d2958e0b0da2	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop	\N	t
3c7235b3-39ca-47de-a85c-464518426003	b65c484c-8f68-4c1f-8d2a-4ec92112d078	https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop	\N	t
74183521-86a7-4a7a-9531-653907fd5b3d	885f98d3-a9bd-4c40-bff8-ffbadd513f4c	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop	\N	t
1eccc9a1-51b1-4c93-a57f-4e93e0ec97e7	2b22ce02-b5cf-42d3-aab0-0e1672d36fcd	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop	\N	t
99cb56a4-0d00-407a-a834-d27a0f6ed8e2	ccc7d7e7-9056-483a-adca-3db4f2c2b1d3	https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop	\N	t
f0627c8f-7223-4279-b0df-a0a426903846	34218397-9610-4644-a1bf-75bab8578e60	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop	\N	t
dac8a104-e7e0-4644-b69b-83bc802ef687	845c9009-b37d-4c46-b372-e3c80c9c3db2	https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop	\N	t
ede22dba-d5cc-40a4-9edf-a9b09f7669cb	098bddd6-0521-4853-ba74-8e390485fc3b	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop	\N	t
d4390f5f-5473-4af6-984f-f6b500bca1bf	6190cef1-b5b5-444c-8e1f-796604aaca68	https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=400&fit=crop	\N	t
658c3ab0-b4eb-4152-9af1-c38feee55f33	1cc41405-4ba0-4900-b91e-1da7abf75ca2	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop	\N	t
cd3ea640-4f01-4837-8b30-ddcfa9017eeb	bcb5e2b2-e7da-47f6-a131-8549f379885f	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
f6e46960-79cb-414c-bcba-a92fc8ad0538	d30e93a1-7f89-456e-93c4-d8b652fc05ae	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
08e0a4d2-ea56-4a58-bd9a-95126a02263e	7d8e1672-bb2d-49f7-9304-219de80fde85	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
1bae42a2-2668-441a-8b3a-cca87d4e23d0	edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
91cd7dcf-adc6-4ca9-bf45-fed5059a5adc	a7927cc6-5d6f-4374-9b27-816b3e81f15c	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
3ffc38ed-ce0c-4af7-93e0-dac773fdf4d5	a98effb9-182e-4466-b8d3-1f471b02c55b	https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop	\N	t
8e98507c-d447-432f-aba4-3af663daf36e	9c7dbf7a-7548-4a45-a49a-713b28c765f6	https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop	\N	t
90951474-1cb4-4786-99ea-4db2dbd8bc7d	1882a154-5296-4b9d-bb7d-fa7f494598e6	https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop	\N	t
f0019547-d7fc-4629-b444-b319e6b1fb5c	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop	\N	t
926de6a8-b86f-46c5-b1d8-7c82cfeed5e4	672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop	\N	t
83eefd53-15b4-4499-8e8b-75423108146c	db59063b-8f08-4126-bee0-9e40204289c1	https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop	\N	t
dac100ab-843a-4530-be52-06e735930810	3f7b0454-5005-4cb4-b956-3c3f304aae31	https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop	\N	t
2051f356-faf2-4891-b8b2-2c8ba31b3697	f6af6fa8-a4b9-4089-9e86-1c79ef262893	https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop	\N	t
3421d453-6d47-4939-814d-865059ba6d22	76537b6b-3947-4570-bd09-9b942da18b16	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop	\N	t
9cc6662d-70f2-4f84-8753-4d785cff0776	02602a91-6128-415e-a01d-da2791406a78	https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop	\N	t
57bcc41d-de86-4f5c-8749-86ee80aa034a	e51e16e8-c20d-47e8-b0d6-6c50801315e5	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop	\N	t
387ea362-946e-4f68-8f0d-1f790bf734e1	0e5e45c2-756b-4d85-af2c-0fc48c6c54b8	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop	\N	t
6c36c73d-248d-4a8b-981c-9b04d62c7e2d	937791f1-7e3b-4241-bc06-f57f4fe25e5a	https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop	\N	t
bb14810d-9a58-402c-a165-12b51198c664	0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	https://images.unsplash.com/photo-1596566193621-b2a2da5b8831?w=400&h=400&fit=crop	\N	t
bfa87bd6-11b1-4a17-b031-1ce658add1c5	3847dc6e-c5e8-4bdb-8185-21d8372881c9	https://images.unsplash.com/photo-1596566193621-b2a2da5b8831?w=400&h=400&fit=crop	\N	t
d576cf38-1172-491f-8874-db3fb9c03fd2	068dd5c4-703a-434e-8418-c36d69a45ba7	https://images.unsplash.com/photo-1596566193621-b2a2da5b8831?w=400&h=400&fit=crop	\N	t
7a6bc118-4864-4cbf-9301-9cfeeeeb6cf0	06468595-c453-4871-98c2-d72e4fd870b1	https://images.unsplash.com/photo-1596566193621-b2a2da5b8831?w=400&h=400&fit=crop	\N	t
35681106-6c32-4d90-a158-345d8fd137d4	5118873c-0d24-413d-926b-2c705669bab4	https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop	\N	t
0669b692-d705-4410-af06-8f7de06bee96	ebe47211-86b4-496f-96ff-b2c7ca3375fc	https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop	\N	t
25f72da4-ba73-4c04-b9bc-4542db3c460c	8fdf2af3-f915-4b74-8380-6429cce20cfa	https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop	\N	t
b9c6c34a-2315-4938-8e26-9b6e803939a9	ce7c1b83-b3f5-4f80-a9da-d19aa6b7e82b	https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop	\N	t
fb22ca2f-36ec-47a9-a79e-e0fa6f7192a5	0aa31f11-34b9-41f8-b814-64c6f868d96c	https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop	\N	t
acda6cc9-1274-4943-b50a-2ad3d5551546	286ac23c-cfce-4333-a698-676266445aeb	https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop	\N	t
e6d77ad7-66dd-43b4-9438-a398d0e7a498	0df1c67e-a4b4-4dd6-850c-36bb91e038fb	https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=400&fit=crop	\N	t
4d4339b4-e3c6-4bed-8eb5-b055041a8525	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	https://images.unsplash.com/photo-1624571409024-feafa6141849?w=400&h=400&fit=crop	\N	t
c2de62ac-ab37-4432-b8d7-cfa3c4a7814b	7c2f5dfe-25fe-4210-bced-1d0a1028a66b	https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop	\N	t
e7c1a4a1-0f5f-41ec-a678-2e0baaf61f6c	2668a7fe-6351-413f-abbc-eb25ff7314fe	https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop	\N	t
f1a598b0-b9df-4dde-87b3-dde74b167f83	34278b7d-5e39-4e90-b90b-31bd475fdbbc	https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop	\N	t
cf013f5b-2624-4e93-b86b-fa8ffd964120	b7145b34-a32d-4306-93ae-7553ace984ce	https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop	\N	t
4a1fc456-a25e-4611-be07-158a53451a82	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop	\N	t
a9c97945-d9c2-418e-b53f-4da8b207c107	d77bb12f-b994-4c84-a746-2f4bb9cfd0cc	https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=400&fit=crop	\N	t
b7253444-6d35-4fe6-a6a9-a8f4ab51a923	4be28bc4-8e5b-4011-b47f-f07e0ca90501	https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop	\N	t
be4526b7-969d-40a2-9008-9597aee85881	e2dd97e0-9322-491c-b899-e307b47dd8ac	https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop	\N	t
9cebbac1-a901-43ee-86f8-7d30e4dbe22d	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop	\N	t
3d990cf6-086e-4d72-956e-b97eedac8294	ae9ba3e7-0af5-423f-a463-a8c2db440a5a	https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop	\N	t
1c0597c7-2f30-4eeb-90be-dc865ec31852	67c1b43c-db6c-4fa4-ada8-a9348692fab6	https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop	\N	t
967388d3-7471-4f3d-8b58-d1e674822060	bda8872c-1bb8-40e6-a268-6d08e19497a0	https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop	\N	t
6e8c64a7-0851-46ba-83dc-a85b8dae7b07	176b8c89-50c1-4a55-ad7f-79ec44f4c0b6	https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop	\N	t
ffcdb6b3-7e9a-4998-9c8b-dfcc7dc4bcb9	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop	\N	t
6c6bd562-66f7-46b4-b155-c0bdd19ef278	cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop	\N	t
58dee258-9928-45e4-9648-ff87eac06db3	5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=400&fit=crop	\N	t
52c9396a-9f8d-45d8-99a6-3cadd0296257	0be06c1b-b815-4277-b0d5-21da1029f30d	https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop	\N	t
8320a723-1c0d-4b2f-b2e7-8ddfbcfb4da1	004c40c5-d6e7-44a2-ae0d-b9f7785c24de	https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop	\N	t
ce06866a-2af8-436e-a704-ba6ebf8dcfe9	ae741e41-6fad-4345-bdc8-c8c6bf9b1209	https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop	\N	t
bd275c0a-59c7-4d2a-9aad-c0756c98e318	cf10157f-8d1d-4478-bc75-edaec00b87f8	https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=400&fit=crop	\N	t
76c9fc57-3b28-4b5b-860a-10c08564d8dd	8947df22-c596-4fc3-8100-91adfa301a58	https://images.unsplash.com/photo-1624571409024-feafa6141849?w=400&h=400&fit=crop	\N	t
7fb155eb-2f2d-45cc-a36e-d33acfe35d00	f8144d18-27e0-46f2-90e6-397cb695f17a	https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop	\N	t
88b1b381-6b16-4353-b0f6-b8560a1f149d	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	https://images.unsplash.com/photo-1587145820098-75c0e0f1c075?w=400&h=400&fit=crop	\N	t
073030bd-b68f-4208-936d-fea3b538cfeb	f509d38f-750d-4704-a91b-457dbe7274c9	https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=400&fit=crop	\N	t
d369c9a6-30ac-4f06-8a99-1922810d340d	068dd5c4-703a-434e-8418-c36d69a45ba7	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
e78532ef-6a0b-4dfc-b4a8-341ef51bc38a	068dd5c4-703a-434e-8418-c36d69a45ba7	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
f4962294-871d-4bb6-b024-1e954da9f2b2	068dd5c4-703a-434e-8418-c36d69a45ba7	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
bda332fb-91ae-46f0-bbb8-e1f49d7b8e0d	5118873c-0d24-413d-926b-2c705669bab4	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
34ee958b-b8c8-45bf-95ed-1805e3a1c9c3	5118873c-0d24-413d-926b-2c705669bab4	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
ee77f3c5-8007-4540-8563-86256f9aa622	5118873c-0d24-413d-926b-2c705669bab4	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
4f8695e4-f809-4d5f-92fc-12c2c09c0b22	5118873c-0d24-413d-926b-2c705669bab4	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
44f32934-c517-473d-98e8-af78a7e1630c	ebe47211-86b4-496f-96ff-b2c7ca3375fc	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
adb34dad-aec8-43fa-a93c-b790610703e8	ebe47211-86b4-496f-96ff-b2c7ca3375fc	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
9acbc8bc-ddca-4133-8328-9448168d4996	ebe47211-86b4-496f-96ff-b2c7ca3375fc	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
38ba8d66-1a3b-49d2-90ad-319e8e8e06ae	8947df22-c596-4fc3-8100-91adfa301a58	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
d9ae9d77-0fdc-43b6-94df-51f84047b350	8947df22-c596-4fc3-8100-91adfa301a58	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
b44cabb1-5d26-405c-9526-03aa749f31c3	8947df22-c596-4fc3-8100-91adfa301a58	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
28e03b2f-e56c-47d6-bda9-94a328704fa5	8947df22-c596-4fc3-8100-91adfa301a58	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
fc90cffb-04a1-4d98-b020-28ff4b3e1f4b	f509d38f-750d-4704-a91b-457dbe7274c9	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
5bd1be47-9cf5-45ca-aa36-8c010973540a	f509d38f-750d-4704-a91b-457dbe7274c9	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
52ae342c-e969-498a-b8fc-dab189d0d4c6	f509d38f-750d-4704-a91b-457dbe7274c9	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
fc7ed72b-9a17-4d61-bae3-527644c2a7cd	f509d38f-750d-4704-a91b-457dbe7274c9	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
2e92391c-28d3-4cc6-983f-790bd293de2b	440918d8-d3f7-4b21-8bab-4c54c05a1e54	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
f70b8261-f536-4d8a-a6c7-e79dc2ab23ce	440918d8-d3f7-4b21-8bab-4c54c05a1e54	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
a0adc601-d1ce-4d4d-b277-153715c70f55	ba4d3b01-f4f7-4661-91b9-fa988776c02c	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
ae874f98-ed3e-4e98-8304-351cd008b4cd	ba4d3b01-f4f7-4661-91b9-fa988776c02c	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
4386b8d0-15d4-4b2c-8a3b-2faa06488f31	1d539479-cf0c-4910-9423-50fe30854007	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
09040889-9cdb-4033-8d69-ef3a00e9a3f1	1d539479-cf0c-4910-9423-50fe30854007	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
a961c84b-031c-4185-b086-c1843a708376	1d539479-cf0c-4910-9423-50fe30854007	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
a034cbc8-184e-487c-97e2-205eabbb51a4	0aa31f11-34b9-41f8-b814-64c6f868d96c	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
698c1f58-eb19-49ed-9cf3-360843fa42af	0aa31f11-34b9-41f8-b814-64c6f868d96c	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
624ea3dd-2f4c-42cc-a783-2b3572d2f180	cf10157f-8d1d-4478-bc75-edaec00b87f8	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
209a0902-ec9f-473e-9d5c-9992ae58fe4e	cf10157f-8d1d-4478-bc75-edaec00b87f8	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
30fd6a3d-6782-4bf9-83fb-cad3fccc8e24	cf10157f-8d1d-4478-bc75-edaec00b87f8	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
b2bdc87f-2bd5-47e2-9520-a1ad68295ffc	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
ab18b21e-6e37-4af9-92b1-271b2e2e9d0e	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
e2fbbd77-5194-48bc-9387-ea826fdfddd1	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
aba4fa5d-85cc-4952-a370-26e9682d8791	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
a6064881-1b5b-4a0d-a6fc-144aee976568	20c7eaea-1349-41d8-b6c3-453bc036de01	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
8108303c-c617-415b-b5ab-00492df35b4d	20c7eaea-1349-41d8-b6c3-453bc036de01	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
3fb54946-e05a-4f79-84be-6248c02cd832	20c7eaea-1349-41d8-b6c3-453bc036de01	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
156ec802-78ea-46df-8789-b05d213f7806	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
c9d9dd5f-bb94-4f48-b981-3dfac8bab976	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d3b33b43-7d0d-49d5-a6e3-f43d209c1376	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
a61be499-9c39-4787-97d4-b5f96e9a9aac	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
0bdd1c31-883c-45b1-9f5e-a3b56c55b0ab	26024f19-c86a-45df-9102-8d24a0d93c2f	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
735f552c-120c-47cc-9ac8-302ec7fcf0e6	26024f19-c86a-45df-9102-8d24a0d93c2f	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
cf627ac2-f686-482e-8f3f-82584407fc43	2b22ce02-b5cf-42d3-aab0-0e1672d36fcd	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
40f7bd38-e796-48a9-a776-1ad3180e2401	2b22ce02-b5cf-42d3-aab0-0e1672d36fcd	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
f27353ad-e73b-4e69-b060-c179416dc835	d77bb12f-b994-4c84-a746-2f4bb9cfd0cc	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
abd0932a-1b58-4c37-a9d7-dbc92f4a55c2	d77bb12f-b994-4c84-a746-2f4bb9cfd0cc	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
2783830e-3d77-4551-a075-cd9bcd5fd7c3	e2dd97e0-9322-491c-b899-e307b47dd8ac	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
41449dfe-f8c7-4f85-96ff-77568aae3c85	e2dd97e0-9322-491c-b899-e307b47dd8ac	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
ddae9736-12c3-4d85-9fa9-563f0142ac7b	e2dd97e0-9322-491c-b899-e307b47dd8ac	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
dcd89d14-a0db-4439-9695-007970b41d23	e2dd97e0-9322-491c-b899-e307b47dd8ac	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d7a4c4de-1efa-4959-ab3e-c9fbc4365688	f16669aa-3ed1-4c33-8405-25b37a6d760d	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
bc5b5b0d-4636-4e28-95b8-c97fc4835cc5	f16669aa-3ed1-4c33-8405-25b37a6d760d	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
7aae5edf-da79-4949-aed2-f91584caa7cf	f16669aa-3ed1-4c33-8405-25b37a6d760d	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
02f247ed-84d3-4bae-afeb-da05088cc8f0	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
4d4c4943-9610-4090-a3ff-2f8498a62872	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
1f4e24e0-e0bc-43dd-940e-85d0352375a5	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
3622b26d-3b16-442f-8cad-5fba170c23b9	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
4e032994-beb7-49b8-aabf-90900de80396	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d997d3c8-b666-41f7-9219-13743627f594	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
5fa34e8f-8e8f-41cb-869f-58cff3f1e87d	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
30df7f20-ceea-46de-a7ee-5c9cc0c1dee4	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
7251a00e-676a-4588-a288-b86561641637	72105a2f-dd39-4f90-b944-c825c4bd9c8f	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
b37d5b15-0ddd-43c3-abc2-afcb76aa959a	72105a2f-dd39-4f90-b944-c825c4bd9c8f	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
38d9b2bc-b542-4857-8620-4663181b8643	72105a2f-dd39-4f90-b944-c825c4bd9c8f	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
24985073-97ee-4ba1-a190-457c712694b5	72105a2f-dd39-4f90-b944-c825c4bd9c8f	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
122b5234-487d-4d62-b001-67af1476f7c3	f6a6d2a9-8021-4321-9af8-0bb6b6106d64	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
53ff9591-6ad0-4f3d-b483-71b84458275f	f6a6d2a9-8021-4321-9af8-0bb6b6106d64	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
565bd194-8d33-4dd5-91ee-f6d170327356	f6a6d2a9-8021-4321-9af8-0bb6b6106d64	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
6a2fa40f-7c07-49e8-894d-7e708c5dcf26	c7d7b673-e0d1-4966-99c5-9b7d3792aeef	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
8fb3fa72-b07c-4ef0-8bc9-ae5ee5c06427	c7d7b673-e0d1-4966-99c5-9b7d3792aeef	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
031c8d10-decf-4aa8-9597-b15f08b3b3e3	c7d7b673-e0d1-4966-99c5-9b7d3792aeef	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
3797d846-2834-4dbb-8b23-2f17d4631e8b	8d3b1f7a-f483-4f0a-8139-165d6463e7df	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
70cb0502-778c-41e4-88d1-2190cfd6aa7a	8d3b1f7a-f483-4f0a-8139-165d6463e7df	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
b2741880-9923-4dee-baf5-b0239e4eb54e	8d3b1f7a-f483-4f0a-8139-165d6463e7df	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
a102e1dc-24a3-4bec-9125-8fd72167efea	9675afd9-7e24-4fd1-9d19-ce1817238d7a	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
ed03ea7f-b66d-4167-8393-97a5e4c7a2ec	9675afd9-7e24-4fd1-9d19-ce1817238d7a	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
cffbc22d-f37d-48c1-b845-0a3fd9f35041	9675afd9-7e24-4fd1-9d19-ce1817238d7a	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
8dafd95a-ac1f-437f-8379-6bbacc0d9306	9675afd9-7e24-4fd1-9d19-ce1817238d7a	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
4dc9d692-4672-4dde-a394-cd1c31cb4bdf	32e2cc84-167b-4c65-b522-6610e60f986f	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
c9fe23a8-4ce4-46ea-88d0-15cfb7ffc5d3	32e2cc84-167b-4c65-b522-6610e60f986f	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
ad88f91f-af97-4f7b-9529-3cb0caa5f3d6	6069f04a-6357-460a-9873-7b70f720c426	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
3e20bcc2-1639-4693-8f00-632127b5aea9	6069f04a-6357-460a-9873-7b70f720c426	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
cd82a831-ba54-47c0-bd5e-13bbd4b5844c	2668a7fe-6351-413f-abbc-eb25ff7314fe	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
4febbe42-8226-468e-bb58-9abec068866d	2668a7fe-6351-413f-abbc-eb25ff7314fe	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
a4d5c1a6-8cc6-4492-94ec-37a42bd99655	4be28bc4-8e5b-4011-b47f-f07e0ca90501	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
7ab4c1ac-432b-442a-b0b6-263ec42cb37f	4be28bc4-8e5b-4011-b47f-f07e0ca90501	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
d0712850-7d0f-4078-a42d-d634c8cf3026	4be28bc4-8e5b-4011-b47f-f07e0ca90501	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
31c1d9c5-3358-45cb-a8ee-d98991ca4a56	87fb89a5-89df-4619-a16e-ab3689ffe205	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
15f04758-3762-4574-8e65-3d67a79330ab	87fb89a5-89df-4619-a16e-ab3689ffe205	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
850ea0d1-9131-4a7e-88cb-5194b7f3c4a1	87fb89a5-89df-4619-a16e-ab3689ffe205	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
9d37be84-daee-44d3-a423-5a165ff058d4	87fb89a5-89df-4619-a16e-ab3689ffe205	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
897c2075-330b-4f05-bccc-9cd964ac9080	0e5e45c2-756b-4d85-af2c-0fc48c6c54b8	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
5367fbb0-ebff-45de-9143-8c52a413b542	0e5e45c2-756b-4d85-af2c-0fc48c6c54b8	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
9ab5cef8-face-4360-a553-47bef723e355	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
9737e05e-ab9b-4731-9f9f-82adf594481c	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
0eda6346-b244-4981-99cb-f649ee581f4e	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
b5fc082b-6c72-4efa-a70c-e88ccea95edd	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
1ef745d2-0145-42f8-8658-fe8505e3ba43	3e1d5f73-4a62-466b-b6ab-6408bad293ca	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
d2efb97c-12d7-46ce-9fae-3b09bb4c531e	3e1d5f73-4a62-466b-b6ab-6408bad293ca	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
7b3a57b0-42a1-466d-a63d-87e525168c15	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
1ad4f829-242d-4104-bcc2-51910c74ff17	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
6a3f18ff-be83-4435-ab2e-f1ab2f6681c3	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
4d97f991-19f2-42c4-b833-70053c20e310	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
2df03992-8f33-41c2-9045-19fb9cfa2c0b	5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
6753b6bf-36b4-4a6f-9a8c-210f934a8e6e	5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
f19af19a-7545-4bd4-884e-6fec7741c6ff	5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
7de19184-0cf6-422a-a2df-0e476caeafd4	cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
a0a80c44-e839-44e5-8646-da6b53a3579f	cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
57927892-7f6f-4c67-a0ed-b31722fe65a8	cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
4718422d-eff9-4f8e-9448-59fa2f04aa59	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
15230f22-7207-4a45-9565-2de207981cf8	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
a1b9bc4c-f3c2-4e12-8acf-6ed45253db7f	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
d3e998eb-5b14-4600-926c-f2ac666601ae	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
34ff9325-d146-4301-b27c-3612a7f6dd30	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
6c4e7de4-f74b-475a-b30d-c4d740973411	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
6bcfa7ca-23b5-4aba-8abd-8224c5c14c98	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
d2c304bb-0575-494f-8bd9-99dac6ca05b5	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
998bed24-16e1-46ae-a2f5-566502f0da57	3847dc6e-c5e8-4bdb-8185-21d8372881c9	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
81525863-f7ca-4706-bdf3-1f12a4235261	3847dc6e-c5e8-4bdb-8185-21d8372881c9	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
e99ce453-b496-4f53-b0a4-689c4d5c41bc	3847dc6e-c5e8-4bdb-8185-21d8372881c9	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
2366082d-b4e7-4505-9def-364e9a8e1056	3847dc6e-c5e8-4bdb-8185-21d8372881c9	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
5f0ae877-bc0b-4029-a2ff-085126d5c242	38634d1c-b0de-47f3-b089-0e0d0e2c1338	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
807bcb6b-491b-479a-9ce6-9c26face0805	38634d1c-b0de-47f3-b089-0e0d0e2c1338	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
849c8067-1268-43f9-80f7-6f125e73a791	38634d1c-b0de-47f3-b089-0e0d0e2c1338	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
b7c09682-4196-43b7-8005-0a49006b9ae1	457f3063-930a-4598-bd44-3f52b933bdb3	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
7ef0b611-330b-44bd-b68d-6317f0408c92	457f3063-930a-4598-bd44-3f52b933bdb3	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
fd76a12f-9ccf-4888-9508-3792db2651b6	482ef6da-9507-4f18-a9d7-f1ed54002b33	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
244032d0-7644-48ac-b2cf-1c1335449bb8	482ef6da-9507-4f18-a9d7-f1ed54002b33	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
ddba7d3c-89ed-456e-ae10-21e1458941dc	482ef6da-9507-4f18-a9d7-f1ed54002b33	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
24c26952-85f0-43e6-b5c9-8ecb497f9b29	482ef6da-9507-4f18-a9d7-f1ed54002b33	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
c66c2480-aa17-4232-bfac-26c37541d8a9	4f3f7912-6d11-4da8-a748-e3e267e5c964	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
bf0f5300-50a1-4900-af80-88bdb7250566	4f3f7912-6d11-4da8-a748-e3e267e5c964	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
b62f5dae-a62b-4415-90d2-f6a584022c24	4f3f7912-6d11-4da8-a748-e3e267e5c964	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
1ace8132-db5f-429d-97d7-18c1176a54f0	67c1b43c-db6c-4fa4-ada8-a9348692fab6	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
3fed2c0a-0141-4460-b714-96d54246c982	67c1b43c-db6c-4fa4-ada8-a9348692fab6	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
bf7da1e0-9257-4ac0-8d61-1a2bb37af8db	67c1b43c-db6c-4fa4-ada8-a9348692fab6	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
205c6c03-cbeb-4837-a34a-129325d66f78	67c1b43c-db6c-4fa4-ada8-a9348692fab6	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
cab970f5-9ca3-46ab-9df8-065e4d0b471e	7a8a80d1-4919-4b76-bdfb-9cd806867994	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
c208f9ba-63ff-455c-b46a-f13109074c03	7a8a80d1-4919-4b76-bdfb-9cd806867994	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
41e9562d-1bc8-4c36-b405-b7ab25fd8e93	7c2f5dfe-25fe-4210-bced-1d0a1028a66b	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
4e059a55-b47b-48e5-926e-86d0fd218471	7c2f5dfe-25fe-4210-bced-1d0a1028a66b	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
010816b7-8c9e-4608-b84b-9f4355d692e2	82265e80-b490-4908-94d4-bad608ea0710	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
7e07a3fe-5289-42f0-8ce5-0018a950da93	82265e80-b490-4908-94d4-bad608ea0710	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
b06b2d20-b333-4363-81d7-e5476791f703	82265e80-b490-4908-94d4-bad608ea0710	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
db001883-3a91-46a3-9ac7-e4a852a8726f	83c6d96a-370b-496e-817c-5f32f1b4ef1e	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
2d69213b-12f1-4c1f-bc51-6283d9b89b4e	83c6d96a-370b-496e-817c-5f32f1b4ef1e	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
107e62b3-8ab7-4049-afda-82ed97d2cbb0	83c6d96a-370b-496e-817c-5f32f1b4ef1e	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
765529bd-e873-4d10-9d97-0bf08569f660	91f5fedc-a603-4b3d-b4fb-7a2349a9b2b3	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
532bb80d-270c-4719-8d1e-88fad208df84	91f5fedc-a603-4b3d-b4fb-7a2349a9b2b3	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
a084cd20-d3c8-4e59-90e8-ae585bbe1f34	9d322044-c4b0-4788-8f7a-fd28b976743e	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
c4fbdaec-00d4-4c57-b155-b26ade19868d	9d322044-c4b0-4788-8f7a-fd28b976743e	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
ae3f8b6e-bf76-4f28-86bb-99e9c680049f	9d322044-c4b0-4788-8f7a-fd28b976743e	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
c0e59c43-79ca-492a-96b4-e728111c4aae	9d322044-c4b0-4788-8f7a-fd28b976743e	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
450d961f-667a-4d47-b7e2-f37247230209	ae741e41-6fad-4345-bdc8-c8c6bf9b1209	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
21f85ad8-dade-42e0-9d8b-ba68ade4d66e	ae741e41-6fad-4345-bdc8-c8c6bf9b1209	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
0fff5611-01d5-4fad-a8aa-43c363f36fb4	ae741e41-6fad-4345-bdc8-c8c6bf9b1209	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
db56f241-8b49-4e1d-8340-1527161339df	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
e90dfbfd-06fa-4cee-9de3-453b9b31c95f	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
2cf7159c-812c-4f65-b7fc-9e0345d4174c	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
18a08d99-38ac-48d7-9b70-dee85100f606	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
dc0e0a59-7e50-4388-aacc-d8b18099bc63	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
0513d55c-aeaf-4b3b-b48d-17a04131b05b	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
216ad2c2-4e25-44eb-8c0b-07da7c0d6222	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
d8e76547-2957-4346-b739-1a09d7ad3c81	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
3093082b-7fa1-4a60-8fe1-684328429b80	004c40c5-d6e7-44a2-ae0d-b9f7785c24de	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
e0ae18f9-7ac9-4610-9c99-b3e24c6aa18d	004c40c5-d6e7-44a2-ae0d-b9f7785c24de	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
ad63dd0a-c7f1-4439-b142-e4ec4fd2f9ec	004c40c5-d6e7-44a2-ae0d-b9f7785c24de	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
7b9f0f09-3a88-4d23-a9e8-b8cf8c75f564	0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
493d1a65-e1c0-4d42-8613-c07b6ec5ff91	0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
8b7ee2ad-5b32-41ba-877d-6daac0975b4b	0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
9101dc31-d619-452c-9e84-df5df5a95b0f	02602a91-6128-415e-a01d-da2791406a78	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
9501571f-33e0-461e-a031-09d7256494ee	02602a91-6128-415e-a01d-da2791406a78	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
767d8aba-7dae-4aa1-8b86-e4d480ea6480	02602a91-6128-415e-a01d-da2791406a78	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
24234903-82ec-4858-b1fc-fc8dd9c83fe2	02602a91-6128-415e-a01d-da2791406a78	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
45310ffb-b0f8-44da-9a76-cc3684c34058	050a51e3-3a04-443d-a71c-c8cbc06269d7	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
240a73a6-7e9d-4678-9598-c8da2bcb521e	050a51e3-3a04-443d-a71c-c8cbc06269d7	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
5ffd3ab2-1a67-4c80-8f67-c872a3723915	06468595-c453-4871-98c2-d72e4fd870b1	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
24aaea60-47b0-40fc-991d-883aa49993a0	06468595-c453-4871-98c2-d72e4fd870b1	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
6afd3d58-2100-45a4-939c-c4a081fbd581	06468595-c453-4871-98c2-d72e4fd870b1	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
de056dd6-3cab-42dc-9063-7258d52dc521	0be06c1b-b815-4277-b0d5-21da1029f30d	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
262a6e8f-37e9-4c4a-aec8-7f48806cca52	0be06c1b-b815-4277-b0d5-21da1029f30d	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
822f7764-4d18-49fb-8485-4e6dd97401c8	50d202d0-5918-4314-9035-1b7c4ca02264	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
039eb7ec-79c0-4ab1-9dd8-7bab0c62e0b7	50d202d0-5918-4314-9035-1b7c4ca02264	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
26ced337-7c8c-45c7-900f-ebabd1c4f59d	50d202d0-5918-4314-9035-1b7c4ca02264	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
7cd92fd8-e699-4df6-a70c-3185a08a7e72	52818677-11a3-4c2b-b70d-36608cc1741f	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
cc90be17-48d7-4c96-9d15-0051697854d7	52818677-11a3-4c2b-b70d-36608cc1741f	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
41fea5ed-7119-4607-9b8e-5b902b7ec455	52818677-11a3-4c2b-b70d-36608cc1741f	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
86caa28b-de83-4fad-a424-6f205f66b44c	52818677-11a3-4c2b-b70d-36608cc1741f	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
11b50d09-24ed-4a49-8acc-9e1089ecd9b1	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
73537738-92c8-461a-8413-a923ed33f6a8	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
7778fb73-1ddb-447d-8765-0db2deaa1d71	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
ad3956df-7ac2-4409-b819-e9a9eb215894	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
7cc72271-0287-4785-be52-3edbe449fc7c	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
b7cc8e39-8718-40e5-a45a-968486297ffa	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
d4e41716-496a-48bc-ad82-f9ec95ae820b	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
24a92a39-79ac-4493-9836-56e2bf2c653a	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
62087d4e-4e94-404c-ba1f-95ee9823dae1	6190cef1-b5b5-444c-8e1f-796604aaca68	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
445b69ca-74a6-416b-85d7-b35333b3b894	6190cef1-b5b5-444c-8e1f-796604aaca68	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
f4915559-e1c4-4685-8c9f-9e5d3aba27d5	6190cef1-b5b5-444c-8e1f-796604aaca68	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
13bece98-088e-4abd-b34f-e7c3df7886dd	6190cef1-b5b5-444c-8e1f-796604aaca68	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
522a93f5-c0c5-4dae-a59e-a8d6c7f86364	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
4820c8bf-8da3-4f76-831b-98c9012aa793	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
b4b277e5-6b1e-48f5-ac6e-01583b7d28bb	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
0cdc21e9-aa40-4a99-9988-17ba30bfcf72	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
a2be82ef-59e4-489b-8136-ca41f3c92dbd	81518aa3-6c3f-46db-97fb-2cf3bd8de875	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
b6fe5cbf-b100-4139-9675-f71bf51a0c6d	81518aa3-6c3f-46db-97fb-2cf3bd8de875	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
3c528508-3b75-481f-838c-46040df9aaff	81518aa3-6c3f-46db-97fb-2cf3bd8de875	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
0417c64f-f146-4d07-8055-2139cc880231	81518aa3-6c3f-46db-97fb-2cf3bd8de875	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
bedfbb9e-54d0-48d7-80a2-6f7da195f25d	845c9009-b37d-4c46-b372-e3c80c9c3db2	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
2c906198-773b-43a4-86ee-c77a80e20db0	845c9009-b37d-4c46-b372-e3c80c9c3db2	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
7939d2ad-c116-4cbd-a37b-6335b70f3918	845c9009-b37d-4c46-b372-e3c80c9c3db2	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
09b00146-2321-4f40-9845-4e3219dbf8ef	845c9009-b37d-4c46-b372-e3c80c9c3db2	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
add637d8-4425-4151-8a9f-f596c1b6a0de	885f98d3-a9bd-4c40-bff8-ffbadd513f4c	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
6e1b3892-ec7d-4c5e-8e91-4503eaa46f7c	885f98d3-a9bd-4c40-bff8-ffbadd513f4c	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
0782c2e1-bc94-4b4c-84c4-2f1c639c6d7c	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
93f7217f-8fdd-4e1e-a4f9-6ce907bccfde	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
84c5fb8e-4b5e-4e52-860e-1d98f4bb7a58	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
80ada1b5-40ac-4d6d-8634-8ae9e8910c38	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
d4fb37c5-4e29-4c3d-bddf-1b5002f5f96e	8fdf2af3-f915-4b74-8380-6429cce20cfa	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
ffc34e39-81e7-4bc2-a8a4-e8c87dd89d3b	8fdf2af3-f915-4b74-8380-6429cce20cfa	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
5113723f-4fa4-46c6-90a0-304b3e14f969	937791f1-7e3b-4241-bc06-f57f4fe25e5a	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
8ada1b25-c018-46f8-b635-7d9b8a1f04d5	937791f1-7e3b-4241-bc06-f57f4fe25e5a	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
f9e1b5a0-f7b8-4306-9aef-ad8a2d306dca	95a4a8e0-1851-461f-a567-5ccb6216e805	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
dfa780de-acfa-44b5-ade0-71ce726c61c0	95a4a8e0-1851-461f-a567-5ccb6216e805	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
d1ab12ec-e70f-4854-92cc-7c3269e14f82	9be4ee89-47a0-4376-ac32-997a7e859e4c	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
1f8e8237-fa7f-4d1f-9bfc-37069578e5df	9be4ee89-47a0-4376-ac32-997a7e859e4c	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
e1914a0e-56bb-4cf2-b439-128485a4f241	9be4ee89-47a0-4376-ac32-997a7e859e4c	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
c1abcde4-eae4-4132-bc72-804368f0ef99	9be4ee89-47a0-4376-ac32-997a7e859e4c	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
ec3e104f-50e0-47c5-b720-dd2c00d54404	a7927cc6-5d6f-4374-9b27-816b3e81f15c	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
dec21f06-4efd-40ed-ad2f-8a832c69ea70	a7927cc6-5d6f-4374-9b27-816b3e81f15c	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
1fc864dc-5f73-4aa1-8408-7bef488398ed	a7927cc6-5d6f-4374-9b27-816b3e81f15c	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
513d0352-aea9-4195-b02e-ea241e0122fd	a98effb9-182e-4466-b8d3-1f471b02c55b	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
5ccf7542-1f5c-4b99-9a80-1942fa1f9679	a98effb9-182e-4466-b8d3-1f471b02c55b	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
c40e9f86-86d1-44b2-9d10-50ca42c63289	a98effb9-182e-4466-b8d3-1f471b02c55b	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
ddb8d26f-68f0-4ad0-ba0d-cf62df03720c	ae9ba3e7-0af5-423f-a463-a8c2db440a5a	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
6670b244-ba87-4daa-b388-e0b01aa6888f	ae9ba3e7-0af5-423f-a463-a8c2db440a5a	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
1290cf39-40bc-46ca-a195-4bc1d5b29a69	ae9ba3e7-0af5-423f-a463-a8c2db440a5a	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
f60be279-1901-483a-9a89-25d5c861f37e	afedfef3-6135-4397-88fa-a47320bbe2bf	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
c84c1fed-70c0-4dad-ba50-4b0155bcd684	afedfef3-6135-4397-88fa-a47320bbe2bf	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
1409f44d-8a4f-4be5-93bd-21c3e0870b2f	afedfef3-6135-4397-88fa-a47320bbe2bf	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
669554cd-c828-424a-b767-548495651e3c	afedfef3-6135-4397-88fa-a47320bbe2bf	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
9229ce44-baaf-4ec3-8419-26c153caee44	b65c484c-8f68-4c1f-8d2a-4ec92112d078	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
842c9c73-026b-45ef-869e-e832d423f8ad	b65c484c-8f68-4c1f-8d2a-4ec92112d078	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
1ed2cce6-3839-4aff-892e-4cfa59741555	b65c484c-8f68-4c1f-8d2a-4ec92112d078	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
9a324445-eeeb-466d-a354-31a1b5b152f7	b65c484c-8f68-4c1f-8d2a-4ec92112d078	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
85080715-2276-40fc-a174-76f3f08c3773	b7145b34-a32d-4306-93ae-7553ace984ce	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
216231c3-9f09-43d9-8af9-b1b4256fe0f6	b7145b34-a32d-4306-93ae-7553ace984ce	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
7d02414a-075b-4459-a322-23ef2d28490b	b7145b34-a32d-4306-93ae-7553ace984ce	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
48ff34b2-071b-4481-a31d-47757816dedc	b7145b34-a32d-4306-93ae-7553ace984ce	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
b7760989-f8d9-4ac5-a3ef-eb33d807f57a	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
9d6a50cd-1ef5-4dbd-9f54-0836be41d632	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
5b44c1b3-8eac-4b7b-b7e6-adf79728afc9	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
9874a3e7-6590-4c89-b591-d5d813e04d73	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
bebcbaff-1a4b-44c3-b854-0515f52c6c62	bc639769-6888-4202-a7a8-b03453a32b7b	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
c78c8e0e-865f-43f7-9268-8b4aa9c10e7d	bc639769-6888-4202-a7a8-b03453a32b7b	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
cf4b753b-7723-49ed-8d5d-0b0a2665e512	bd7ee9ba-19e1-42eb-ba3d-2a418db77f99	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
f38cb3c4-722c-4f0f-b311-c72d078acbad	bd7ee9ba-19e1-42eb-ba3d-2a418db77f99	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
030f0f37-11d4-43bd-a708-af3a9a92a96c	bda8872c-1bb8-40e6-a268-6d08e19497a0	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
ea12f36e-ba6d-4830-a207-c65a4cf6486c	bda8872c-1bb8-40e6-a268-6d08e19497a0	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
c6c731c2-eecc-43e0-9c51-50eda4e9a7a8	bda8872c-1bb8-40e6-a268-6d08e19497a0	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
e4c77f72-d70a-4c5f-9760-3acfd5a92f35	bda8872c-1bb8-40e6-a268-6d08e19497a0	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
6a0715a7-b8eb-48b9-a662-a6cc1648c5e7	be625c9c-e0a4-4147-8bba-70d5b83fce7b	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
d53db259-7e78-4359-b87d-c09932b23ebb	be625c9c-e0a4-4147-8bba-70d5b83fce7b	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
470366f8-00d8-4b06-a4c4-be17088e50ff	be625c9c-e0a4-4147-8bba-70d5b83fce7b	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
5086d3b8-c0d7-4b63-afc7-37d02e4b9424	be625c9c-e0a4-4147-8bba-70d5b83fce7b	https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=800&fit=crop	\N	f
ff0bf647-f594-4b2a-bd1e-7015c2822bba	c29324b9-2947-46f5-9719-6128552d5ed4	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
af3a96cd-6d8b-479e-b7e3-a1be90d2891a	c29324b9-2947-46f5-9719-6128552d5ed4	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
01f21b84-a4f3-4a1d-a913-b024ad7b7f23	c29324b9-2947-46f5-9719-6128552d5ed4	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
e1807726-bb11-4ed1-aaaf-ad06609b757d	c29324b9-2947-46f5-9719-6128552d5ed4	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
a53113a5-959b-47a5-a1f8-3e01b1e5bda3	cba63ba3-b910-4dfb-a5e2-fd69932a9dea	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
4cc06d8b-bbd2-422c-b19e-40670a33870d	cba63ba3-b910-4dfb-a5e2-fd69932a9dea	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
92b83a2d-9097-460d-9942-6f67f547bab9	cca9603a-511c-42b6-aa58-80950c67cf81	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
fe862f7d-ce7e-4397-9920-8bf8289cad70	cca9603a-511c-42b6-aa58-80950c67cf81	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
ca28cd37-32fb-4389-a4a9-abec4caf073f	ccbf3cdb-c33f-4369-ba0b-53f29756fe36	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
888db9e4-74c2-4d8d-b85a-2e66d680c050	ccbf3cdb-c33f-4369-ba0b-53f29756fe36	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
3608b4d5-b3b6-4b52-94f5-22e10aeb8d2e	ccbf3cdb-c33f-4369-ba0b-53f29756fe36	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
89f8f098-b96d-439a-abe9-2a504e4f61a7	ce138998-e674-46bc-8195-e9fe600ae5e3	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
05fe2c08-5c53-4eaf-ac96-da531ccdd418	ce138998-e674-46bc-8195-e9fe600ae5e3	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
6eca514b-ac5c-4480-86ae-2ae938d3cede	ce7c1b83-b3f5-4f80-a9da-d19aa6b7e82b	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
8eb5792c-76bd-45e4-88e3-0b74397946db	ce7c1b83-b3f5-4f80-a9da-d19aa6b7e82b	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
e8eac19a-b18f-4c3e-a4f1-f7c089983ab7	db59063b-8f08-4126-bee0-9e40204289c1	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
3ec8cbbb-224a-48cc-9ec4-4073f199c0f5	db59063b-8f08-4126-bee0-9e40204289c1	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
5f5f3c05-3f4d-4eb8-b19f-645ec1e7335e	db59063b-8f08-4126-bee0-9e40204289c1	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
70850960-7faa-4ae3-a038-e7da4d26a393	db59063b-8f08-4126-bee0-9e40204289c1	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
7098b5bf-d9c2-444f-80ce-c70cff99b492	e51e16e8-c20d-47e8-b0d6-6c50801315e5	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
2ee0ad36-63a1-4bfc-9a4b-94e168e87b7d	e51e16e8-c20d-47e8-b0d6-6c50801315e5	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
d0c972c8-053a-4655-947a-46dab7684737	edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
362b73ea-c2b5-4f80-bffb-4c7886781233	edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
b16211a7-db89-4564-b84c-f327b4c4002f	edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
7654a348-f6de-436f-8cb1-b2eca77355f7	f8144d18-27e0-46f2-90e6-397cb695f17a	https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=800&fit=crop	\N	f
c2741b71-0324-4168-804d-c57f59c50b8d	f8144d18-27e0-46f2-90e6-397cb695f17a	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
9d57f279-d246-40ff-92b0-7c87ceed01d6	fe0f4c1b-6b4a-4261-b034-317664596603	https://images.unsplash.com/photo-1587202372634-0e984e826724?w=800&h=800&fit=crop	\N	f
ff847a7c-dae9-4d6c-b239-19f7595ba74e	fe0f4c1b-6b4a-4261-b034-317664596603	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
a60c6f67-8847-4f70-b24d-e5c74d4e3963	fe0f4c1b-6b4a-4261-b034-317664596603	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
34d27381-73c6-4d28-936c-aa6684d9156e	fe0f4c1b-6b4a-4261-b034-317664596603	https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop	\N	f
fb9d5515-e416-400b-a44f-bce522f82891	ffedbefe-4189-46cf-ad79-e0de62b77216	https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&h=800&fit=crop	\N	f
4c4df962-fba1-45d0-9cfa-88c04f417e2b	ffedbefe-4189-46cf-ad79-e0de62b77216	https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop	\N	f
53dd3950-c290-4453-aa1c-47af14085785	ffedbefe-4189-46cf-ad79-e0de62b77216	https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=800&fit=crop	\N	f
efb40ebf-88d0-4d2e-b62b-b8c905caef79	ffedbefe-4189-46cf-ad79-e0de62b77216	https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=800&fit=crop	\N	f
\.


--
-- Data for Name: product_skus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_skus (id, product_id, sku_code, price, promotional_price, stock_quantity, attributes, created_at, updated_at) FROM stdin;
b376e183-80ba-465a-a979-2f21ed2db366	a7d1da40-140d-45e0-96f1-3d2d8e9518bf	SKU-LAPTOP-ASUS-VIV-e6e2	18990000	17490000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d6868dd1-aeae-40c3-9abf-6e0ed896def7	1a7d577b-c680-4f0d-afc3-4a8f5cc50fab	SKU-LAPTOP-HP-PAVIL-9108	14990000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c508ce3f-183d-48f4-9057-58b3237a9c0f	c41bd84a-19ed-4c3b-9b33-082bc8bb64c8	SKU-LAPTOP-ACER-SWI-2713	16990000	15990000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
96e83018-ce72-4850-afae-a6ee9cf11b0a	f32a6a6f-5293-4f80-b4c0-9d0d9ce16dc5	SKU-LAPTOP-MSI-MODE-4aa0	13990000	12990000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b01bc8c5-3a1e-4488-8f48-7498343c8aa7	e64046d4-49ba-48e7-9be4-84bc3b255805	SKU-LAPTOP-LENOVO-I-1f07	15990000	\N	14	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
335c9caf-2d08-4cb7-87ae-b8527bd01026	e86163eb-f063-475b-916e-16226861433d	SKU-LAPTOP-DELL-INS-a416	13490000	12490000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b624abe8-b2a1-4fa5-9c73-7c55e8f669c4	d5ff6911-2106-4bec-aa65-78f3ae038963	SKU-MACBOOK-AIR-M2--a598	27990000	25990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
298e1407-dd9b-4ca5-9050-a838ab8f82de	e28f37a8-0cdb-4808-8a86-9891782c92ee	SKU-MACBOOK-PRO-M3--b8b4	39990000	37990000	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
84619042-98d7-44a2-b6f2-f502f7f38f64	0d1046f3-c815-431e-9ade-361ba0f4a5dc	SKU-LAPTOP-ASUS-ZEN-dd27	22990000	21490000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b228fa68-ab21-4b22-999d-dc72cdac8394	f310f38e-abd7-4e83-a0cb-4e4df5411053	SKU-LAPTOP-HP-ENVY--5e2d	19990000	\N	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d735830d-2280-42c7-93c1-a0b45225413b	11cbd1da-df88-49c5-8125-40c5214d3534	SKU-LAPTOP-GAMING-A-a531	45990000	42990000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
35870f40-a432-47a1-a171-29d5d4ad0d6f	11c926db-4026-4998-8cde-a036257dd5e2	SKU-LAPTOP-GAMING-A-92f9	24990000	22990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
8a2891ad-9833-4414-93ab-125a1555eac6	33d8fa71-584e-4520-8127-51f808ed4db0	SKU-LAPTOP-GAMING-M-4f35	55990000	\N	5	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
69b84f4f-c4cc-4f4b-85ad-5b217b497986	6fc9965c-2fad-4774-8ba7-6759d1eade59	SKU-LAPTOP-GAMING-L-6698	32990000	30990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2eb02c56-0825-4d5c-83cf-0f2a6ba7bd31	398f6f62-1e6f-4622-957b-124783d47dfc	SKU-LAPTOP-GAMING-A-ab24	35990000	33990000	7	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
6f2ea8f0-b128-4fc4-b9c2-defb44671aa0	0c684519-9458-4392-94c5-fc58c4cae36b	SKU-LAPTOP-GAMING-A-9a9b	19990000	18490000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
241104f4-8a7b-4476-b231-171ac2aba2a9	bd7ee9ba-19e1-42eb-ba3d-2a418db77f99	SKU-LAPTOP-GAMING-H-2ea0	29990000	27990000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
459ae894-3e47-46f1-bdb0-f76f98701fa0	ccbf3cdb-c33f-4369-ba0b-53f29756fe36	SKU-LAPTOP-GAMING-H-6d56	17990000	16490000	22	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
98812a4e-4d18-49c4-8c22-dd77800a0014	cca9603a-511c-42b6-aa58-80950c67cf81	SKU-LAPTOP-GAMING-M-816c	15990000	14490000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
151e6b02-44d1-44fc-95db-5ba1129e092c	c576a465-9b71-44b4-8498-c8968ebd321f	SKU-LAPTOP-GAMING-A-12a8	49990000	46990000	5	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e091fd8f-cddc-4c18-9b7c-39c9f32a690d	4f3f7912-6d11-4da8-a748-e3e267e5c964	SKU-LAPTOP-GAMING-L-bf9c	17990000	16490000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e4869bbc-b836-4102-ae34-c755d39c09a6	91f5fedc-a603-4b3d-b4fb-7a2349a9b2b3	SKU-PC-EZ4ENCE-GAMI-150b	18500000	17500000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c0e9407b-12c2-4d6c-a2f2-663ec066e280	ffedbefe-4189-46cf-ad79-e0de62b77216	SKU-PC-EZ4ENCE-GAMI-50e6	35000000	32900000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d51436f9-5f08-4e7b-98dc-175f81c3c91c	482ef6da-9507-4f18-a9d7-f1ed54002b33	SKU-PC-EZ4ENCE-HI-E-79ef	75000000	72000000	3	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
271aef7a-ded7-42f1-bcaa-a11913427598	f16669aa-3ed1-4c33-8405-25b37a6d760d	SKU-PC-EZ4ENCE-VAN--699a	8500000	\N	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c07d125a-7535-4a9c-bfa9-8ac70a9f6d64	82265e80-b490-4908-94d4-bad608ea0710	SKU-PC-EZ4ENCE-O-HO-231f	55000000	\N	5	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f8c5f527-0207-4609-9e15-01a26f558d4e	afedfef3-6135-4397-88fa-a47320bbe2bf	SKU-PC-EZ4ENCE-MINI-6e7c	22000000	20500000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0b8de500-4a52-4517-8186-ceddaaaa3fb9	3e1d5f73-4a62-466b-b6ab-6408bad293ca	SKU-PC-EZ4ENCE-CUST-41ea	120000000	\N	2	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5dc032c8-07f7-4e09-ac2f-9003077fccaf	20c7eaea-1349-41d8-b6c3-453bc036de01	SKU-PC-EZ4ENCE-FULL-a325	28000000	26500000	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ad5a8254-ed5c-44ff-8fd6-aeacb958fd25	95a4a8e0-1851-461f-a567-5ccb6216e805	SKU-PC-EZ4ENCE-RGB--4431	42000000	39900000	4	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
227bac92-d722-4d33-9aa8-fde4b3d7d3fd	13a13af0-1ef6-49ad-8441-192cc24baddd	SKU-CPU-INTEL-CORE--e8a6	2890000	\N	50	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
78a2e491-51cf-4543-8232-d0c5381ec236	ce138998-e674-46bc-8195-e9fe600ae5e3	SKU-CPU-INTEL-CORE--ef74	6990000	6490000	40	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0c3c4fa1-df56-4204-ab8d-ffed6ca14218	bc639769-6888-4202-a7a8-b03453a32b7b	SKU-CPU-INTEL-CORE--316d	10490000	9990000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
37a718f9-4b86-42a4-afe8-896f66a5f2c2	c059088e-31bb-4f99-825a-a4f24f3a460a	SKU-CPU-INTEL-CORE--cf7c	14990000	13990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b22f86ae-8749-458a-9ae1-37fdc31234c2	da9c4dc2-b1ae-414b-b497-848e02cc0640	SKU-CPU-AMD-RYZEN-5-ed16	5490000	4990000	35	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
945a603e-7e0f-46b0-bfb6-95e20f480480	55829253-2025-4d35-9af2-1f8b7159c8fa	SKU-CPU-AMD-RYZEN-7-0fd0	9990000	9490000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2108c637-8b4b-45f2-9dd1-ad3c59778d64	52f8148c-0809-407b-b87e-92d33a2c2cf0	SKU-CPU-AMD-RYZEN-9-8b3a	13990000	12990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0cf34fc2-f34a-4514-9721-13abdc0a0fea	33162d0f-c694-46d3-b77f-a3ac4aa79b8e	SKU-MAINBOARD-ASUS--24db	6290000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
82ce352d-ac63-444d-b935-36675480530a	6a639ad9-a30b-4a8f-8f9d-62e350d7e775	SKU-MAINBOARD-MSI-M-6f88	5790000	5290000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
9d0ab46f-49f5-488d-a465-3573bcecfa84	352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	SKU-MAINBOARD-GIGAB-ec50	3890000	\N	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
007ef3a7-4a19-4fb8-900e-1e429ed045a3	72105a2f-dd39-4f90-b944-c825c4bd9c8f	SKU-MAINBOARD-ASUS--67da	3690000	3390000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
72e20bd1-9ca0-42f6-8f57-7ebfbc02a8f7	f6a6d2a9-8021-4321-9af8-0bb6b6106d64	SKU-MAINBOARD-GIGAB-71f5	7290000	\N	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c3a067be-034e-4887-9a9b-0538028183ed	cba63ba3-b910-4dfb-a5e2-fd69932a9dea	SKU-VGA-ASUS-TUF-GA-5f0a	16990000	15990000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2d52e7eb-f803-4fa4-8b1d-58e3f032763b	49235fba-ba0f-4955-8d8e-8a9d5549a489	SKU-VGA-MSI-GEFORCE-c26c	8490000	7990000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c1231ae8-05fb-4d6c-9fd4-3bfea6bde52d	1c3b8f59-0e23-486f-bc23-c691dd301fa3	SKU-VGA-GIGABYTE-GE-b87a	22990000	\N	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
30754f2a-443b-474c-be38-465b92b7a07f	9be4ee89-47a0-4376-ac32-997a7e859e4c	SKU-VGA-ASUS-DUAL-G-e5ab	11990000	10990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
7bb8de71-6b77-4d15-9b07-e26ebf34d15c	5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	SKU-VGA-MSI-GEFORCE-72a3	29990000	28490000	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
be4e84a0-827c-4423-b422-66e7f0666055	c29324b9-2947-46f5-9719-6128552d5ed4	SKU-VGA-SAPPHIRE-PU-6460	14990000	13990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
8ce781dd-627d-4baa-af20-34e22c53036a	be625c9c-e0a4-4147-8bba-70d5b83fce7b	SKU-VGA-SAPPHIRE-NI-1e9b	12990000	11990000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5331de62-a369-4a75-bb11-ca7ea2b4f754	9675afd9-7e24-4fd1-9d19-ce1817238d7a	SKU-RAM-KINGSTON-FU-4a98	1290000	\N	50	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
1f9d5650-74cf-43d4-b81e-e0f20c1e028a	c7d7b673-e0d1-4966-99c5-9b7d3792aeef	SKU-RAM-CORSAIR-VEN-7d6e	3890000	3590000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e4860d43-7dbc-451c-8eb7-ecd54e1962d2	440918d8-d3f7-4b21-8bab-4c54c05a1e54	SKU-RAM-KINGSTON-FU-bc48	890000	\N	60	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
cf34c1b0-e4b0-4463-9bae-7f7f90ededb6	32e2cc84-167b-4c65-b522-6610e60f986f	SKU-RAM-KINGSTON-FU-370d	1190000	\N	40	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b680f7d0-50ef-4dcd-ae7f-4377e8060ee9	b81df3c9-8378-4840-8a47-61f5938b4ea3	SKU-SSD-SAMSUNG-990-89e0	2990000	2690000	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
77e2d837-106a-494a-b31d-ce15aebecb95	35b4e4a2-4d8a-4e1e-9158-6d5398fdaf76	SKU-SSD-WD-BLACK-SN-ecd4	4290000	3990000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
7ce19412-f015-47a2-b1f3-82f6e24f9a1f	e946a9ce-d0ca-41d0-8676-2afb40177dce	SKU-SSD-KINGSTON-NV-a28e	890000	\N	60	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5504b4ef-4dcc-4ec5-8c97-46e9309bac44	610f140b-8bb6-4e6c-8558-7b92454b03a1	SKU-SSD-SAMSUNG-870-f60d	2490000	2290000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
15be2ed6-fb27-4c6e-a378-422b32419790	7fa092e4-8c5e-47cb-8675-4b488afaeb03	SKU-HDD-SEAGATE-BAR-c4da	1490000	\N	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a90ca3cc-9e1c-47a9-b468-73feac4c178e	6f96555a-0bab-45ae-af6f-1869ff95c11b	SKU-NGUON-CORSAIR-R-f21f	2490000	\N	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
88dbdb40-9e09-430f-85bc-f823be2bbf77	38634d1c-b0de-47f3-b089-0e0d0e2c1338	SKU-NGUON-DEEPCOOL--be48	3290000	2990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3f2f4541-6cc8-4666-b7a8-26a6a5a221e6	52818677-11a3-4c2b-b70d-36608cc1741f	SKU-NGUON-CORSAIR-C-e63d	1190000	\N	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
eb0a5868-af26-49d7-99ec-3ec220569539	3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	SKU-NGUON-ASUS-ROG--34f3	3490000	3190000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
4766d7c8-79cf-4256-b0cb-7acaa5eaf4a1	73ccfc73-b291-4d0d-8614-2454c513c52d	SKU-NGUON-DEEPCOOL--6412	1290000	\N	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
da0be69a-d8e9-4426-aa6b-30811f1411f9	50d202d0-5918-4314-9035-1b7c4ca02264	SKU-CASE-NZXT-H5-FL-1a5f	2490000	\N	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b91e005c-c743-4ac0-94d5-6dade8d87dd8	6069f04a-6357-460a-9873-7b70f720c426	SKU-CASE-CORSAIR-50-2659	3990000	3690000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f5beff7a-1284-45b8-a4c6-35a924eff911	457f3063-930a-4598-bd44-3f52b933bdb3	SKU-CASE-LIAN-LI-LA-2c67	3290000	\N	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d3be33d4-bf09-47a1-9397-bb7d39e9a9fc	ba4d3b01-f4f7-4661-91b9-fa988776c02c	SKU-CASE-ASUS-TUF-G-0865	2790000	2490000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
32a46deb-eef6-4131-a73f-522578529416	81518aa3-6c3f-46db-97fb-2cf3bd8de875	SKU-TAN-NHIET-NUOC--0730	3490000	3190000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e568031c-83fc-4aee-aca3-8754733254ec	39951c7f-2926-4aeb-b9ac-4ba0e999b485	SKU-TAN-NHIET-KHI-D-17a6	1590000	\N	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f1700d30-2877-49cf-ad67-5b402a3f1a57	4a925c9b-a8d0-40e3-a33b-bebd0618f806	SKU-TAN-NHIET-NUOC--cbd0	6990000	6490000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
4553435e-bcec-4a03-8a31-5b555153cc72	5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	SKU-TAN-NHIET-NUOC--2315	3290000	2990000	14	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
fabde16d-b8eb-466f-a6cb-717231fd4095	409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	SKU-FAN-CASE-LIAN-L-1309	1890000	\N	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
02dab16b-b2ed-4fec-acfe-fdc1791badea	83c6d96a-370b-496e-817c-5f32f1b4ef1e	SKU-MAN-HINH-ASUS-P-2c94	12990000	11990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3e65ebd2-5856-45b7-86c5-3c6eac8cc0ab	26024f19-c86a-45df-9102-8d24a0d93c2f	SKU-MAN-HINH-LG-27G-b6cc	8990000	7990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
cdbe121d-6de3-4b0d-9d49-f470f1fb918e	9d322044-c4b0-4788-8f7a-fd28b976743e	SKU-MAN-HINH-SAMSUN-4ec1	32990000	29990000	5	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
eed1d596-ea85-4971-9a95-16bb2549e49a	f3c9ff32-087d-4a6d-980c-7b8da9c095f4	SKU-MAN-HINH-DELL-U-efa4	11490000	\N	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d2717150-b101-4683-8f6f-ca1e68e9ea47	3e5447a8-c56e-42f7-b565-6fbd4c868bb8	SKU-MAN-HINH-MSI-MA-f886	7990000	7490000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e22ef11d-3c1c-487a-a8b6-2105ff60d83b	25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	SKU-MAN-HINH-DELL-P-0ac2	4990000	4490000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e0eb89fa-b96a-4501-8d31-d81e1000ac14	7a8a80d1-4919-4b76-bdfb-9cd806867994	SKU-MAN-HINH-ASUS-V-9d0a	7490000	6990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a74a3c9d-0da6-4c3f-b835-a7f6f08d35e1	fe0f4c1b-6b4a-4261-b034-317664596603	SKU-MAN-HINH-SAMSUN-253d	3490000	3190000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a8cf303d-2c0d-4918-95dd-4e70d62090eb	050a51e3-3a04-443d-a71c-c8cbc06269d7	SKU-MAN-HINH-ASUS-P-2e87	8990000	\N	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
73a47609-6fc6-4855-93fb-28e2d138806c	1d539479-cf0c-4910-9423-50fe30854007	SKU-BAN-PHIM-CO-AKK-e7d8	1690000	1490000	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
32088110-c215-444b-be19-395d6127837c	87fb89a5-89df-4619-a16e-ab3689ffe205	SKU-BAN-PHIM-CO-KEY-c3e3	4290000	\N	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
4c4745cc-8e8f-499e-93d5-c60814e442ce	2ffd3508-7558-4d75-9e57-57cc3cbac6c0	SKU-BAN-PHIM-CO-LOG-c8e1	3290000	2990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a92c95a3-be60-4f16-b8cb-c04f888afdd7	b65c484c-8f68-4c1f-8d2a-4ec92112d078	SKU-BAN-PHIM-CO-RAZ-49f1	5490000	4990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3fc0528f-2040-4267-aa26-edbb6f0bca4d	885f98d3-a9bd-4c40-bff8-ffbadd513f4c	SKU-BAN-PHIM-CO-COR-a4ae	4790000	4290000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b874854f-a21f-4b3f-bb07-9bb60e00ed6c	2b22ce02-b5cf-42d3-aab0-0e1672d36fcd	SKU-BAN-PHIM-CO-AKK-9539	1290000	\N	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e6c29965-d158-43e9-bd1d-4aedf4174b38	ccc7d7e7-9056-483a-adca-3db4f2c2b1d3	SKU-CHUOT-RAZER-VIP-4bc7	4290000	3990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5b1f5aff-db50-42c2-9cae-f129acb7c371	34218397-9610-4644-a1bf-75bab8578e60	SKU-CHUOT-LOGITECH--a5e6	3290000	2990000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
8e82dd6b-4172-43d5-9506-b2ea532e344a	845c9009-b37d-4c46-b372-e3c80c9c3db2	SKU-CHUOT-PULSAR-X2-707b	2190000	\N	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d08e39ed-6dd1-4cc1-993d-c917a7c75919	098bddd6-0521-4853-ba74-8e390485fc3b	SKU-CHUOT-CORSAIR-M-7e43	2990000	2690000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ab98c639-447f-4bc3-88d5-2ed14046e4b8	6190cef1-b5b5-444c-8e1f-796604aaca68	SKU-CHUOT-ZOWIE-EC2-7d31	2890000	\N	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
501fae34-6223-4c85-a4fe-af77c4990fe2	1cc41405-4ba0-4900-b91e-1da7abf75ca2	SKU-CHUOT-RAZER-DEA-faa6	1590000	1390000	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3d5bc428-f8e9-4ede-90bd-9bd6c1bed2a3	bcb5e2b2-e7da-47f6-a131-8549f379885f	SKU-LOT-CHUOT-ARTIS-3747	1890000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c901eb5f-50ca-4edc-b689-deb52d3c26c5	d30e93a1-7f89-456e-93c4-d8b652fc05ae	SKU-LOT-CHUOT-RAZER-324c	690000	\N	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	7d8e1672-bb2d-49f7-9304-219de80fde85	SKU-LOT-CHUOT-STEEL-60f1	590000	\N	35	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f9bb5c83-1ab5-48dd-9e11-d5e409134cd5	edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	SKU-LOT-CHUOT-PULSA-a682	1290000	\N	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
9e9186f0-0af2-427d-91a9-9c9a0d020a45	a7927cc6-5d6f-4374-9b27-816b3e81f15c	SKU-LOT-CHUOT-RAZER-19cb	1790000	1590000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
163b85cf-c028-47fe-ab7e-d2bf4c8ca172	a98effb9-182e-4466-b8d3-1f471b02c55b	SKU-LOT-CHUOT-STEEL-1c96	990000	890000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
80fb6124-82fb-4da4-bc68-32b75623079a	9c7dbf7a-7548-4a45-a49a-713b28c765f6	SKU-TAI-NGHE-SONY-W-00dd	7990000	6990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
d0ff246a-21e8-42f6-9d8b-7a9fb7c200f7	ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	SKU-TAI-NGHE-LOGITE-70f2	4990000	4490000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3bc3819b-b496-4e38-b1b6-7a6a90a6ee52	672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	SKU-TAI-NGHE-SAMSUN-1910	1990000	1690000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ca1c4675-0780-49d4-8a8a-4a495fda979f	db59063b-8f08-4126-bee0-9e40204289c1	SKU-TAI-NGHE-SONY-W-2fc2	5990000	5290000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
cbfd6777-6d2b-4fc0-a395-f821a6ae44e3	3f7b0454-5005-4cb4-b956-3c3f304aae31	SKU-TAI-NGHE-CORSAI-e7f3	3990000	3490000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
bfad6719-31e2-45ef-926d-eda33ba04021	f6af6fa8-a4b9-4089-9e86-1c79ef262893	SKU-TAI-NGHE-HYPERX-4785	1990000	1790000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
aa414378-8b9f-42ce-b25d-26231d60881d	76537b6b-3947-4570-bd09-9b942da18b16	SKU-LOA-EDIFIER-R12-2d36	2590000	2290000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
47ab71e4-e7ac-4b80-ac32-de8a8348fb6e	02602a91-6128-415e-a01d-da2791406a78	SKU-LOA-CREATIVE-PE-d6a1	890000	\N	40	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2775e177-4e08-4f64-84a5-21bf23cda1e0	e51e16e8-c20d-47e8-b0d6-6c50801315e5	SKU-LOA-JBL-QUANTUM-79b2	2290000	1990000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
86a9d617-9ef9-42fa-aba4-dbf4ec90ddd4	0e5e45c2-756b-4d85-af2c-0fc48c6c54b8	SKU-LOA-CREATIVE-ST-4540	1290000	990000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
49023e00-453c-42ee-bfa1-ac100d6d9e33	937791f1-7e3b-4241-bc06-f57f4fe25e5a	SKU-LOA-EDIFIER-M32-c82d	1890000	1690000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
64a6114a-7047-484c-815e-28b6607a7b67	0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	SKU-WEBCAM-LOGITECH-ed07	1990000	1790000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2fea62ce-8a54-4e6f-87f3-fa842bc1b08b	3847dc6e-c5e8-4bdb-8185-21d8372881c9	SKU-WEBCAM-RAZER-KI-4f71	6990000	\N	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3b03b058-461b-4db7-b271-6130e175c4da	068dd5c4-703a-434e-8418-c36d69a45ba7	SKU-WEBCAM-ELGATO-F-8d26	8490000	7990000	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2108e431-2603-4e2a-90c7-ed0aa4162d63	06468595-c453-4871-98c2-d72e4fd870b1	SKU-WEBCAM-LOGITECH-3219	590000	\N	50	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
6172b3df-6310-4aaf-8f53-3e4a833f990f	5118873c-0d24-413d-926b-2c705669bab4	SKU-MICROPHONE-HYPE-bf79	3290000	2990000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
7e8d1469-dce3-4d44-852c-cb5239850e47	1882a154-5296-4b9d-bb7d-fa7f494598e6	SKU-MICROPHONE-RAZE-2fe2	2490000	\N	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
624567ac-22aa-4c37-ba48-b16bee94251e	ebe47211-86b4-496f-96ff-b2c7ca3375fc	SKU-MICROPHONE-ELGA-0ad7	3990000	3690000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c6c4fd6f-e742-417e-8348-f443ee4bf46c	8fdf2af3-f915-4b74-8380-6429cce20cfa	SKU-ROUTER-WIFI-6-A-8fd1	5990000	5490000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
2c87a908-53a2-4da4-825b-1f9eea37ddb4	ce7c1b83-b3f5-4f80-a9da-d19aa6b7e82b	SKU-BO-PHAT-WIFI-ME-2bca	4290000	3790000	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
45e580d6-edd1-4641-9f1d-787bbcf378f3	0aa31f11-34b9-41f8-b814-64c6f868d96c	SKU-MICROSOFT-OFFIC-4915	1490000	\N	100	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c10cad36-d053-4df7-9a35-73c9c3981139	286ac23c-cfce-4333-a698-676266445aeb	SKU-SWITCH-TP-LINK--42a3	290000	\N	40	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ca85dd55-d7ec-4148-b4fc-6a981f584495	0df1c67e-a4b4-4dd6-850c-36bb91e038fb	SKU-USB-THU-WIFI-TP-714f	390000	\N	35	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b3642e6a-28f8-4cc4-b754-af7855382f52	f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	SKU-WINDOWS-11-HOME-1f32	3290000	\N	50	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
cc1b337d-a83f-403a-97ec-1b277fdd9eed	7c2f5dfe-25fe-4210-bced-1d0a1028a66b	SKU-PHAN-MEM-DIET-V-aceb	490000	390000	80	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
064b7ba3-82f3-49ce-a7b8-a81f3f2e7faf	2668a7fe-6351-413f-abbc-eb25ff7314fe	SKU-ADOBE-CREATIVE--ea1c	14990000	\N	30	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
a3f5dcef-448b-4f7a-b668-03a47d0beffb	34278b7d-5e39-4e90-b90b-31bd475fdbbc	SKU-NINTENDO-SWITCH-0dcb	8990000	\N	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e1629871-a173-4938-894a-42c789655ed3	b7145b34-a32d-4306-93ae-7553ace984ce	SKU-ASUS-ROG-ALLY-X-c6db	19990000	18990000	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
cf79de01-d2fb-446e-9cd1-bbbd4d841ea3	6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	SKU-MAY-CHOI-GAME-S-9710	13990000	12990000	10	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5bc1dc10-fcbd-4648-a0a9-632af59fbcdd	d77bb12f-b994-4c84-a746-2f4bb9cfd0cc	SKU-MAY-CHOI-GAME-X-1d26	12990000	\N	8	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ca01d362-1522-4300-97ed-51480f4e6e6c	4be28bc4-8e5b-4011-b47f-f07e0ca90501	SKU-MAY-CHOI-GAME-V-6ccb	15990000	\N	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
20b719c9-41aa-4703-afc2-2043ca2007d7	e2dd97e0-9322-491c-b899-e307b47dd8ac	SKU-TAY-CAM-SONY-DU-a318	5490000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f479ee64-d7c6-45d8-ae9c-692a1cddb279	fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	SKU-TAY-CAM-XBOX-WI-c72b	1490000	1290000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
34a1cb6c-d420-4274-bcf8-1ff35d5899ad	ae9ba3e7-0af5-423f-a463-a8c2db440a5a	SKU-TAY-CAM-LOGITEC-fb6d	490000	\N	40	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
0833e5d4-d95a-4361-a317-36ed960b328e	67c1b43c-db6c-4fa4-ada8-a9348692fab6	SKU-VO-LANG-UA-XE-T-7b6b	6990000	6490000	6	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
8777368b-e64b-4982-ac3b-ad52a1261213	bda8872c-1bb8-40e6-a268-6d08e19497a0	SKU-IA-GAME-PS5-GOD-32e1	1490000	990000	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
ee187913-76b0-4d39-91ff-17eed63a5cc2	176b8c89-50c1-4a55-ad7f-79ec44f4c0b6	SKU-IA-GAME-NINTEND-ab9c	1390000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
01ee879d-a0d0-4ae9-ba32-a3bf49320d0f	d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	SKU-BALO-LAPTOP-ASU-b29d	2290000	\N	20	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
c9ed23ca-baa0-4426-beaf-30d0f9d33bb8	cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	SKU-HUB-USB-C-RAZER-3f14	3990000	3490000	12	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
f0100e19-6799-4a9b-b40d-c77f4fb5311c	5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	SKU-GIA-TREO-MAN-HI-9f15	1890000	\N	15	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
b060ae2b-e7bb-4642-a834-45e2279e5bd3	0be06c1b-b815-4277-b0d5-21da1029f30d	SKU-USB-SAMSUNG-BAR-97b1	390000	\N	60	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
e7cbcd9c-3285-4d1b-af3b-9c8f45357b69	004c40c5-d6e7-44a2-ae0d-b9f7785c24de	SKU-E-TAN-NHIET-LAP-30f0	590000	490000	25	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
40f7fe07-d2d7-4aee-96fa-b33c64b36e46	ae741e41-6fad-4345-bdc8-c8c6bf9b1209	SKU-PIN-DU-PHONG-AN-798c	1890000	1690000	18	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
72e53fbf-f035-4f55-a8f8-e79ea63f7db1	cf10157f-8d1d-4478-bc75-edaec00b87f8	SKU-CAP-SAC-ANKER-5-9f22	290000	\N	50	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
5cdf1458-9328-4356-bad0-a0db12a96c01	8947df22-c596-4fc3-8100-91adfa301a58	SKU-DICH-VU-CAI-AT--c3c8	200000	\N	999	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
705c0604-b442-47cb-8588-28a3867ad9c7	f8144d18-27e0-46f2-90e6-397cb695f17a	SKU-DICH-VU-BAO-HAN-ac18	990000	\N	999	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
3c82787c-2c02-4861-833e-6fdd9904c98f	8a543566-04c3-4f9d-ad33-5fd9dbafc31d	SKU-DICH-VU-VE-SINH-d2f8	150000	\N	999	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
26b0c7d8-92b8-4df5-a9d1-d2bec9ae5a63	f509d38f-750d-4704-a91b-457dbe7274c9	SKU-DICH-VU-THU-CU--9642	0	\N	999	{}	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07
82cf2feb-9479-40b3-bc9d-a569712b5987	320dd017-8df7-4242-b586-206d64837bf6	SKU-BAN-PHIM-C-623	2000000	1850000	-32	{}	2026-06-16 23:31:24.983885+07	2026-06-16 23:31:24.983885+07
5d92d68a-1205-4c2e-b4b9-431c95da825c	a3e0a8d3-81d4-4252-9424-34b4f3a4661a	SKU-LAPTOP-GAMING-D-5ef9	27990000	25990000	4	{}	2026-06-16 23:15:40.700908+07	2026-06-17 18:35:58.399871+07
846271dc-fe28-4bb7-98f5-27c656af006a	8d3b1f7a-f483-4f0a-8139-165d6463e7df	SKU-RAM-GSKILL-TRID-04d8	3290000	2990000	27	{}	2026-06-16 23:15:40.700908+07	2026-06-19 14:00:55.862366+07
72be7bef-4187-4fa2-a822-9168d58b11a2	5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	SKU-MAN-HINH-L-539	3000000	2790000	50	{}	2026-06-25 14:08:02.530365+07	2026-06-25 14:08:02.530365+07
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, slug, description, category_id, is_published, created_at, updated_at, brand_id, specifications, sold_count) FROM stdin;
a7d1da40-140d-45e0-96f1-3d2d8e9518bf	Laptop ASUS VivoBook 15 OLED A1505VA	laptop-asus-vivobook-15-oled-a1505va	Laptop ASUS VivoBook 15 OLED A1505VA - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"cpu": "Intel Core i5-13500H", "ram": "16GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "15.6 inch OLED FHD"}	2
13a13af0-1ef6-49ad-8441-192cc24baddd	CPU Intel Core i3-14100F	cpu-intel-core-i3-14100f	CPU Intel Core i3-14100F - Sản phẩm chính hãng Intel, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	24e65b24-31af-4915-882c-e8116fb33c99	{"Socket": "LGA 1700", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "4 nh\\u00e2n 8 lu\\u1ed3ng", "Xung nh\\u1ecbp": "3.5GHz - 4.7GHz", "Cache": "12MB", "TDP": "58W"}	1
1a7d577b-c680-4f0d-afc3-4a8f5cc50fab	Laptop HP Pavilion 15-eg3098TU	laptop-hp-pavilion-15-eg3098tu	Laptop HP Pavilion 15-eg3098TU - Sản phẩm chính hãng HP, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	48de0310-95de-4e8f-b185-ecd3f1334799	{"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD IPS"}	3
1c3b8f59-0e23-486f-bc23-c691dd301fa3	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G	vga-gigabyte-geforce-rtx-4070-ti-super-aero-oc-16g	VGA GIGABYTE GeForce RTX 4070 Ti Super AERO OC 16G - Sản phẩm chính hãng Gigabyte, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b951edf0-37c6-4c24-916f-c5705f71044d	{"Chipset / GPU": "NVIDIA GeForce RTX 4070 Ti Super", "B\\u1ed9 nh\\u1edb": "16GB GDDR6X", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 3x DP 1.4a", "TDP": "285W"}	1
c41bd84a-19ed-4c3b-9b33-082bc8bb64c8	Laptop Acer Swift 3 SF314-512	laptop-acer-swift-3-sf314-512	Laptop Acer Swift 3 SF314-512 - Sản phẩm chính hãng Acer, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c837f719-42b5-4e28-b7e2-dc0e1bc25058	{"cpu": "Intel Core i5-1240P", "ram": "16GB LPDDR5", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "14 inch 2K IPS"}	3
49235fba-ba0f-4955-8d8e-8a9d5549a489	VGA MSI GeForce RTX 4060 VENTUS 2X 8G OC	vga-msi-geforce-rtx-4060-ventus-2x-8g-oc	VGA MSI GeForce RTX 4060 VENTUS 2X 8G OC - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"Chipset / GPU": "NVIDIA GeForce RTX 4060", "B\\u1ed9 nh\\u1edb": "8GB GDDR6", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 3x DP 1.4a", "TDP": "115W"}	0
11c926db-4026-4998-8cde-a036257dd5e2	Laptop Gaming ASUS TUF Gaming A15 FA507NV	laptop-gaming-asus-tuf-gaming-a15-fa507nv	Laptop Gaming ASUS TUF Gaming A15 FA507NV - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"cpu": "AMD Ryzen 7 7735HS", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4060 8GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 144Hz"}	1
e28f37a8-0cdb-4808-8a86-9891782c92ee	Macbook Pro M3 14 inch	macbook-pro-m3-14-inch	Macbook Pro M3 14 inch - Sản phẩm chính hãng Apple, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	69669bfa-bf86-496f-84f0-ef8b6d212c21	{"cpu": "Apple M3 Pro 11-Core", "ram": "18GB Unified", "storage": "SSD 512GB", "vga": "Apple M3 Pro 14-Core GPU", "M\\u00e0n h\\u00ecnh": "14.2 inch Liquid Retina XDR"}	2
e64046d4-49ba-48e7-9be4-84bc3b255805	Laptop Lenovo IdeaPad Slim 5 14IAH8	laptop-lenovo-ideapad-slim-5-14iah8	Laptop Lenovo IdeaPad Slim 5 14IAH8 - Sản phẩm chính hãng Lenovo, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ecf34ee3-0789-400f-afe8-31a1da50d924	{"cpu": "Intel Core i5-12500H", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "14 inch 2.8K OLED"}	2
e86163eb-f063-475b-916e-16226861433d	Laptop Dell Inspiron 15 3530	laptop-dell-inspiron-15-3530	Laptop Dell Inspiron 15 3530 - Sản phẩm chính hãng Dell, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	68c582d5-cfdf-4d5d-9c28-d3f4eac3a614	{"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD IPS"}	3
f32a6a6f-5293-4f80-b4c0-9d0d9ce16dc5	Laptop MSI Modern 14 C13M	laptop-msi-modern-14-c13m	Laptop MSI Modern 14 C13M - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"cpu": "Intel Core i5-1335U", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "Intel Iris Xe", "M\\u00e0n h\\u00ecnh": "14 inch FHD IPS"}	0
d5ff6911-2106-4bec-aa65-78f3ae038963	Macbook Air M2 2024 13 inch	macbook-air-m2-2024-13-inch	Macbook Air M2 2024 13 inch - Sản phẩm chính hãng Apple, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	69669bfa-bf86-496f-84f0-ef8b6d212c21	{"cpu": "Apple M2 8-Core", "ram": "8GB Unified", "storage": "SSD 256GB", "vga": "Apple M2 10-Core GPU", "M\\u00e0n h\\u00ecnh": "13.6 inch Liquid Retina"}	0
0d1046f3-c815-431e-9ade-361ba0f4a5dc	Laptop ASUS Zenbook 14 OLED UX3405MA (Đồ hoạ)	laptop-asus-zenbook-14-oled-ux3405ma-o-hoa	Laptop ASUS Zenbook 14 OLED UX3405MA (Đồ hoạ) - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"cpu": "Intel Core Ultra 7 155H", "ram": "16GB LPDDR5X", "storage": "SSD 1TB", "vga": "Intel Arc Graphics", "M\\u00e0n h\\u00ecnh": "14 inch 3K OLED 120Hz"}	0
f310f38e-abd7-4e83-a0cb-4e4df5411053	Laptop HP Envy x360 14-fa0013TU (Cảm ứng)	laptop-hp-envy-x360-14-fa0013tu-cam-ung	Laptop HP Envy x360 14-fa0013TU (Cảm ứng) - Sản phẩm chính hãng HP, bảo hành tại EZ4GEAR.	f13dc502-a309-4021-89e0-f4276458635d	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	48de0310-95de-4e8f-b185-ecd3f1334799	{"cpu": "Intel Core Ultra 5 125U", "ram": "16GB LPDDR5", "storage": "SSD 512GB", "vga": "Intel Arc Graphics", "M\\u00e0n h\\u00ecnh": "14 inch 2.8K OLED Touch, xoay 360\\u00b0"}	0
11cbd1da-df88-49c5-8125-40c5214d3534	Laptop Gaming ASUS ROG Zephyrus G14 GA403UI	laptop-gaming-asus-rog-zephyrus-g14-ga403ui	Laptop Gaming ASUS ROG Zephyrus G14 GA403UI - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"cpu": "AMD Ryzen 9 8945HS", "ram": "16GB LPDDR5X", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "M\\u00e0n h\\u00ecnh": "14 inch 2K OLED 120Hz"}	0
398f6f62-1e6f-4622-957b-124783d47dfc	Laptop Gaming Acer Predator Helios Neo 16 PHN16-72	laptop-gaming-acer-predator-helios-neo-16-phn16-72	Laptop Gaming Acer Predator Helios Neo 16 PHN16-72 - Sản phẩm chính hãng Acer, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c837f719-42b5-4e28-b7e2-dc0e1bc25058	{"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "M\\u00e0n h\\u00ecnh": "16 inch 2K IPS 165Hz"}	1
a3e0a8d3-81d4-4252-9424-34b4f3a4661a	Laptop Gaming Dell G15 5530 Alienware	laptop-gaming-dell-g15-5530-alienware	Laptop Gaming Dell G15 5530 Alienware - Sản phẩm chính hãng Dell, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	68c582d5-cfdf-4d5d-9c28-d3f4eac3a614	{"cpu": "Intel Core i7-13650HX", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4060 8GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 165Hz"}	3
33d8fa71-584e-4520-8127-51f808ed4db0	Laptop Gaming MSI Stealth 16 AI Studio A1VIG	laptop-gaming-msi-stealth-16-ai-studio-a1vig	Laptop Gaming MSI Stealth 16 AI Studio A1VIG - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"cpu": "Intel Core Ultra 9 185H", "ram": "32GB DDR5", "storage": "SSD 2TB", "vga": "NVIDIA RTX 4090 16GB", "M\\u00e0n h\\u00ecnh": "16 inch 4K OLED 120Hz"}	0
6fc9965c-2fad-4774-8ba7-6759d1eade59	Laptop Gaming Lenovo Legion 5 Pro 16IRX9	laptop-gaming-lenovo-legion-5-pro-16irx9	Laptop Gaming Lenovo Legion 5 Pro 16IRX9 - Sản phẩm chính hãng Lenovo, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	ecf34ee3-0789-400f-afe8-31a1da50d924	{"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 8GB", "M\\u00e0n h\\u00ecnh": "16 inch 2K IPS 165Hz"}	0
0c684519-9458-4392-94c5-fc58c4cae36b	Laptop Gaming Acer Nitro V 15 ANV15-51	laptop-gaming-acer-nitro-v-15-anv15-51	Laptop Gaming Acer Nitro V 15 ANV15-51 - Sản phẩm chính hãng Acer, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	c837f719-42b5-4e28-b7e2-dc0e1bc25058	{"cpu": "Intel Core i5-13420H", "ram": "16GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 144Hz"}	0
c576a465-9b71-44b4-8498-c8968ebd321f	Laptop Gaming ASUS ROG Strix G16 G614JI	laptop-gaming-asus-rog-strix-g16-g614ji	Laptop Gaming ASUS ROG Strix G16 G614JI - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"cpu": "Intel Core i9-14900HX", "ram": "32GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4070 Ti 8GB", "M\\u00e0n h\\u00ecnh": "16 inch 2K IPS 240Hz"}	0
55829253-2025-4d35-9af2-1f8b7159c8fa	CPU AMD Ryzen 7 7800X3D	cpu-amd-ryzen-7-7800x3d	CPU AMD Ryzen 7 7800X3D - Sản phẩm chính hãng AMD, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	66a0211c-8bfa-4dd2-8583-dfd87f7da2e2	{"Socket": "AM5", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "8 nh\\u00e2n 16 lu\\u1ed3ng", "Xung nh\\u1ecbp": "4.2GHz - 5.0GHz", "Cache": "104MB (3D V-Cache)", "TDP": "120W"}	0
c059088e-31bb-4f99-825a-a4f24f3a460a	CPU Intel Core i9-14900K	cpu-intel-core-i9-14900k	CPU Intel Core i9-14900K - Sản phẩm chính hãng Intel, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	24e65b24-31af-4915-882c-e8116fb33c99	{"Socket": "LGA 1700", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "24 nh\\u00e2n 32 lu\\u1ed3ng", "Xung nh\\u1ecbp": "3.2GHz - 6.0GHz", "Cache": "36MB", "TDP": "125W"}	0
da9c4dc2-b1ae-414b-b497-848e02cc0640	CPU AMD Ryzen 5 7600X	cpu-amd-ryzen-5-7600x	CPU AMD Ryzen 5 7600X - Sản phẩm chính hãng AMD, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	66a0211c-8bfa-4dd2-8583-dfd87f7da2e2	{"Socket": "AM5", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "6 nh\\u00e2n 12 lu\\u1ed3ng", "Xung nh\\u1ecbp": "4.7GHz - 5.3GHz", "Cache": "38MB", "TDP": "105W"}	0
73ccfc73-b291-4d0d-8614-2454c513c52d	Nguồn DeepCool PK650D 650W 80 Plus Bronze	nguon-deepcool-pk650d-650w-80-plus-bronze	Nguồn DeepCool PK650D 650W 80 Plus Bronze - Sản phẩm chính hãng DeepCool, bảo hành tại EZ4GEAR.	342ca7e2-6ad3-4c6e-82c3-50baac105e49	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	22fcd678-380c-4698-8fd5-e4ec1b8b1017	{"C\\u00f4ng su\\u1ea5t": "650W", "Chu\\u1ea9n": "80 Plus Bronze", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "Modular": "Non-Modular"}	0
7fa092e4-8c5e-47cb-8675-4b488afaeb03	HDD Seagate Barracuda 2TB 7200RPM 3.5 inch	hdd-seagate-barracuda-2tb-7200rpm-35-inch	HDD Seagate Barracuda 2TB 7200RPM 3.5 inch - Sản phẩm chính hãng Seagate, bảo hành tại EZ4GEAR.	53d9cc06-0378-4bd5-a195-e9dc3a5da902	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	30348ea9-f264-4d73-ac89-3ae528197770	{"Dung l\\u01b0\\u1ee3ng": "2TB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "SATA III 3.5 inch HDD", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "220 MB/s", "T\\u1ed1c \\u0111\\u1ed9 quay": "7200 RPM"}	0
b81df3c9-8378-4840-8a47-61f5938b4ea3	SSD Samsung 990 EVO 1TB PCIe Gen 5.0 x2 NVMe M.2	ssd-samsung-990-evo-1tb-pcie-gen-50-x2-nvme-m2	SSD Samsung 990 EVO 1TB PCIe Gen 5.0 x2 NVMe M.2 - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	53d9cc06-0378-4bd5-a195-e9dc3a5da902	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"Dung l\\u01b0\\u1ee3ng": "1TB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "NVMe PCIe Gen 5.0 x2", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "5000 MB/s", "T\\u1ed1c \\u0111\\u1ed9 ghi": "4200 MB/s"}	0
e946a9ce-d0ca-41d0-8676-2afb40177dce	SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2	ssd-kingston-nv2-500gb-pcie-gen-40-nvme-m2	SSD Kingston NV2 500GB PCIe Gen 4.0 NVMe M.2 - Sản phẩm chính hãng Kingston, bảo hành tại EZ4GEAR.	53d9cc06-0378-4bd5-a195-e9dc3a5da902	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	c308ee69-36f0-44c9-b0de-220f9bb2e5a4	{"Dung l\\u01b0\\u1ee3ng": "500GB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "NVMe PCIe Gen 4.0", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "3500 MB/s", "T\\u1ed1c \\u0111\\u1ed9 ghi": "2100 MB/s"}	0
52f8148c-0809-407b-b87e-92d33a2c2cf0	CPU AMD Ryzen 9 7950X	cpu-amd-ryzen-9-7950x	CPU AMD Ryzen 9 7950X - Sản phẩm chính hãng AMD, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	66a0211c-8bfa-4dd2-8583-dfd87f7da2e2	{"Socket": "AM5", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "16 nh\\u00e2n 32 lu\\u1ed3ng", "Xung nh\\u1ecbp": "4.5GHz - 5.7GHz", "Cache": "80MB", "TDP": "170W"}	0
33162d0f-c694-46d3-b77f-a3ac4aa79b8e	Mainboard ASUS ROG STRIX B760-F GAMING WIFI	mainboard-asus-rog-strix-b760-f-gaming-wifi	Mainboard ASUS ROG STRIX B760-F GAMING WIFI - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	acce1753-eade-487f-a300-68b45fd325f6	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"Socket": "LGA 1700", "Chipset": "Intel B760", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "DDR5, PCIe 5.0, WiFi 6E"}	3
0df1c67e-a4b4-4dd6-850c-36bb91e038fb	USB Thu Wifi TP-Link Archer T3U Plus AC1300	usb-thu-wifi-tp-link-archer-t3u-plus-ac1300	USB Thu Wifi TP-Link Archer T3U Plus AC1300 - Sản phẩm chính hãng TP-Link, bảo hành tại EZ4GEAR.	abcaa950-a125-4727-b161-f2704ddbb2f0	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:03:25.623767+07	70c10e0d-a92b-40b2-b673-0bf6caec432d	{"Lo\\u1ea1i": "USB Thu Wifi", "Chu\\u1ea9n Wifi": "WiFi 5 AC1300 (802.11ac)", "T\\u1ed1c \\u0111\\u1ed9": "867 + 400 Mbps", "Anten": "Anten ngo\\u00e0i xoay"}	0
286ac23c-cfce-4333-a698-676266445aeb	Switch TP-Link TL-SG1005D 5 Port Gigabit	switch-tp-link-tl-sg1005d-5-port-gigabit	Switch TP-Link TL-SG1005D 5 Port Gigabit - Sản phẩm chính hãng TP-Link, bảo hành tại EZ4GEAR.	abcaa950-a125-4727-b161-f2704ddbb2f0	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:03:25.623767+07	70c10e0d-a92b-40b2-b673-0bf6caec432d	{"Lo\\u1ea1i": "Switch m\\u1ea1ng", "S\\u1ed1 c\\u1ed5ng": "5 Port Gigabit", "T\\u1ed1c \\u0111\\u1ed9": "10/100/1000 Mbps", "Ngu\\u1ed3n": "Adapter ngo\\u00e0i"}	0
176b8c89-50c1-4a55-ad7f-79ec44f4c0b6	Đĩa Game Nintendo Switch - The Legend of Zelda: TotK	ia-game-nintendo-switch-the-legend-of-zelda-totk	Đĩa Game Nintendo Switch - The Legend of Zelda: TotK - Sản phẩm chính hãng Nintendo, bảo hành tại EZ4GEAR.	\N	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:03:25.623767+07	ad12bc79-c2b5-4778-8b99-8f3876c672d9	{"N\\u1ec1n t\\u1ea3ng": "Nintendo Switch", "Th\\u1ec3 lo\\u1ea1i": "Action-Adventure / Open World", "Nh\\u00e0 ph\\u00e1t h\\u00e0nh": "Nintendo", "Ng\\u00f4n ng\\u1eef": "English / Japanese"}	0
35b4e4a2-4d8a-4e1e-9158-6d5398fdaf76	SSD WD Black SN850X 2TB PCIe Gen 4.0 x4 NVMe M.2	ssd-wd-black-sn850x-2tb-pcie-gen-40-x4-nvme-m2	SSD WD Black SN850X 2TB PCIe Gen 4.0 x4 NVMe M.2 - Sản phẩm chính hãng Western Digital, bảo hành tại EZ4GEAR.	53d9cc06-0378-4bd5-a195-e9dc3a5da902	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	c0b71f50-61d3-418f-b37a-7ff7d4977866	{"Dung l\\u01b0\\u1ee3ng": "2TB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "NVMe PCIe Gen 4.0 x4", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "7300 MB/s", "T\\u1ed1c \\u0111\\u1ed9 ghi": "6600 MB/s"}	0
610f140b-8bb6-4e6c-8558-7b92454b03a1	SSD Samsung 870 EVO 1TB SATA III 2.5 inch	ssd-samsung-870-evo-1tb-sata-iii-25-inch	SSD Samsung 870 EVO 1TB SATA III 2.5 inch - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	53d9cc06-0378-4bd5-a195-e9dc3a5da902	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"Dung l\\u01b0\\u1ee3ng": "1TB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "SATA III 2.5 inch", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "560 MB/s", "T\\u1ed1c \\u0111\\u1ed9 ghi": "530 MB/s"}	0
34278b7d-5e39-4e90-b90b-31bd475fdbbc	Nintendo Switch OLED Model Mario Red Edition	nintendo-switch-oled-model-mario-red-edition	Nintendo Switch OLED Model Mario Red Edition - Sản phẩm chính hãng Nintendo, bảo hành tại EZ4GEAR.	\N	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ad12bc79-c2b5-4778-8b99-8f3876c672d9	{"M\\u00e0n h\\u00ecnh": "7 inch OLED", "Dung l\\u01b0\\u1ee3ng": "64GB", "Pin": "4.5 - 9 gi\\u1edd", "C\\u1ed5ng": "USB-C, HDMI (Dock)"}	2
5e2e0106-5f4a-4341-b0f2-57bdf7dc3213	Tản nhiệt nước Corsair iCUE H100i ELITE 240mm ARGB	tan-nhiet-nuoc-corsair-icue-h100i-elite-240mm-argb	Tản nhiệt nước Corsair iCUE H100i ELITE 240mm ARGB - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	ad72da4f-d9f0-46d0-bed7-35781dd859f9	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"Ki\\u1ec3u": "AIO Liquid Cooler", "K\\u00edch th\\u01b0\\u1edbc Radiator": "240mm", "Fan": "2x 120mm ARGB", "Socket": "Intel LGA 1700/AM5"}	0
409d4e65-7ccc-4c86-a9d6-3fb2dc5f1f12	Fan Case Lian Li UNI FAN SL-INFINITY 120 RGB 3 Pack	fan-case-lian-li-uni-fan-sl-infinity-120-rgb-3-pack	Fan Case Lian Li UNI FAN SL-INFINITY 120 RGB 3 Pack - Sản phẩm chính hãng Lianli, bảo hành tại EZ4GEAR.	ad72da4f-d9f0-46d0-bed7-35781dd859f9	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	55165d01-912a-4323-8d70-68f9c112ef54	{"Ki\\u1ec3u": "Case Fan RGB", "K\\u00edch th\\u01b0\\u1edbc": "120mm x3", "LED": "Infinity Mirror ARGB", "T\\u1ed1c \\u0111\\u1ed9 quay": "800-2100 RPM"}	0
6f96555a-0bab-45ae-af6f-1869ff95c11b	Nguồn Corsair RM750e 750W 80 Plus Gold - Full Modular	nguon-corsair-rm750e-750w-80-plus-gold-full-modular	Nguồn Corsair RM750e 750W 80 Plus Gold - Full Modular - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	342ca7e2-6ad3-4c6e-82c3-50baac105e49	t	2026-06-16 23:15:40.700908+07	2026-06-25 15:00:38.677512+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"C\\u00f4ng su\\u1ea5t": "750W", "Chu\\u1ea9n": "80 Plus Gold", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "Modular": "Full Modular"}	0
ccc7d7e7-9056-483a-adca-3db4f2c2b1d3	Chuột Razer Viper V3 Pro	chuot-razer-viper-v3-pro	Chuột Razer Viper V3 Pro - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"M\\u1eaft \\u0111\\u1ecdc": "Razer Focus Pro 4K (35000 DPI)", "DPI": "35000", "K\\u1ebft n\\u1ed1i": "HyperSpeed Wireless / USB-C", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "54g", "Switch": "Razer Gen-3 Optical", "Pin": "90 gi\\u1edd"}	0
34218397-9610-4644-a1bf-75bab8578e60	Chuột Logitech G502 X PLUS LIGHTSPEED	chuot-logitech-g502-x-plus-lightspeed	Chuột Logitech G502 X PLUS LIGHTSPEED - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"M\\u1eaft \\u0111\\u1ecdc": "HERO 25K (25600 DPI)", "DPI": "25600", "K\\u1ebft n\\u1ed1i": "LIGHTSPEED / Bluetooth / USB-C", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "106g", "Switch": "LIGHTFORCE Hybrid", "Pin": "130 gi\\u1edd"}	0
098bddd6-0521-4853-ba74-8e390485fc3b	Chuột Corsair M75 AIR Wireless	chuot-corsair-m75-air-wireless	Chuột Corsair M75 AIR Wireless - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"M\\u1eaft \\u0111\\u1ecdc": "Corsair MARKSMAN (26000 DPI)", "DPI": "26000", "K\\u1ebft n\\u1ed1i": "SLIPSTREAM / Bluetooth / USB-C", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "60g", "Switch": "Omron Optical", "Pin": "100 gi\\u1edd"}	2
39951c7f-2926-4aeb-b9ac-4ba0e999b485	Tản nhiệt khí DeepCool AK620 Digital	tan-nhiet-khi-deepcool-ak620-digital	Tản nhiệt khí DeepCool AK620 Digital - Sản phẩm chính hãng DeepCool, bảo hành tại EZ4GEAR.	ad72da4f-d9f0-46d0-bed7-35781dd859f9	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	22fcd678-380c-4698-8fd5-e4ec1b8b1017	{"Ki\\u1ec3u": "Tower Air Cooler", "TDP": "260W", "Fan": "2x 120mm", "Socket": "Intel LGA 1700/AM5"}	5
4a925c9b-a8d0-40e3-a33b-bebd0618f806	Tản nhiệt nước Corsair iCUE H150i ELITE LCD XT	tan-nhiet-nuoc-corsair-icue-h150i-elite-lcd-xt	Tản nhiệt nước Corsair iCUE H150i ELITE LCD XT - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	ad72da4f-d9f0-46d0-bed7-35781dd859f9	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"Ki\\u1ec3u": "AIO Liquid Cooler", "K\\u00edch th\\u01b0\\u1edbc Radiator": "360mm", "Fan": "3x 120mm RGB", "M\\u00e0n h\\u00ecnh": "LCD 2.1 inch IPS"}	1
1cc41405-4ba0-4900-b91e-1da7abf75ca2	Chuột Razer DeathAdder V3 HyperSpeed Có Dây	chuot-razer-deathadder-v3-hyperspeed-co-day	Chuột Razer DeathAdder V3 HyperSpeed Có Dây - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"M\\u1eaft \\u0111\\u1ecdc": "Razer Focus X (18000 DPI)", "DPI": "18000", "K\\u1ebft n\\u1ed1i": "USB c\\u00f3 d\\u00e2y", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "59g", "Switch": "Razer Gen-2 Mechanical"}	0
bcb5e2b2-e7da-47f6-a131-8549f379885f	Lót chuột Artisan FX Hayate Otsu V2 XL Soft	lot-chuot-artisan-fx-hayate-otsu-v2-xl-soft	Lót chuột Artisan FX Hayate Otsu V2 XL Soft - Sản phẩm chính hãng Artisan, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	96a73eb3-dc24-4fc7-a04a-c920f68539c0	{"K\\u00edch th\\u01b0\\u1edbc": "490 x 420 x 4mm", "Ch\\u1ea5t li\\u1ec7u": "V\\u1ea3i \\u0111\\u1eb7c bi\\u1ec7t + Foam \\u0111\\u1ebf", "B\\u1ec1 m\\u1eb7t": "Speed / Control Hybrid"}	0
d30e93a1-7f89-456e-93c4-d8b652fc05ae	Lót chuột Razer Gigantus V2 XXL (Deskmat)	lot-chuot-razer-gigantus-v2-xxl-deskmat	Lót chuột Razer Gigantus V2 XXL (Deskmat) - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"K\\u00edch th\\u01b0\\u1edbc": "940 x 410 x 4mm", "Ch\\u1ea5t li\\u1ec7u": "Micro-weave Cloth", "B\\u1ec1 m\\u1eb7t": "Control"}	0
1882a154-5296-4b9d-bb7d-fa7f494598e6	Microphone Razer Seiren V3 Chroma USB	microphone-razer-seiren-v3-chroma-usb	Microphone Razer Seiren V3 Chroma USB - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	2a4a25f6-12b0-439e-9bca-1ce03ba4894c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"Ki\\u1ec3u": "Condenser", "K\\u1ebft n\\u1ed1i": "USB-C", "H\\u01b0\\u1edbng thu": "Supercardioid", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 20kHz", "LED": "Razer Chroma RGB"}	6
320dd017-8df7-4242-b586-206d64837bf6	Bàn phím cơ Không dây Akko 3098B Multi-modes	ban-phim-co-khong-day-akko-3098b-multi-modes		05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:31:24.983885+07	2026-06-26 15:22:16.288271+07	f75e0e15-034d-4e21-adbb-10f75685a10f	{"K\\u00edch th\\u01b0\\u1edbc": "TKL", "Lo\\u1ea1i Switch": "Akko CS Switch"}	2
7d8e1672-bb2d-49f7-9304-219de80fde85	Lót chuột SteelSeries QcK Heavy XXL	lot-chuot-steelseries-qck-heavy-xxl	Lót chuột SteelSeries QcK Heavy XXL - Sản phẩm chính hãng SteelSeries, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	31bffa70-e26f-4965-941b-cb4b3021502b	{"K\\u00edch th\\u01b0\\u1edbc": "900 x 400 x 6mm", "Ch\\u1ea5t li\\u1ec7u": "Micro-woven Cloth", "B\\u1ec1 m\\u1eb7t": "Control (d\\u00e0y 6mm)"}	3
9c7dbf7a-7548-4a45-a49a-713b28c765f6	Tai nghe Sony WH-1000XM5 Wireless (Over-ear)	tai-nghe-sony-wh-1000xm5-wireless-over-ear	Tai nghe Sony WH-1000XM5 Wireless (Over-ear) - Sản phẩm chính hãng Sony, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d2a21452-a924-435f-9645-9746ba819325	{"Ki\\u1ec3u d\\u00e1ng": "Over-ear", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.3 / 3.5mm", "Microphone": "8 mic ANC", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "4Hz - 40kHz", "Pin": "30 gi\\u1edd"}	1
672e1467-fbf4-45cc-b1ed-3b25d7c2ca13	Tai nghe Samsung Galaxy Buds FE True Wireless (In-ear)	tai-nghe-samsung-galaxy-buds-fe-true-wireless-in-ear	Tai nghe Samsung Galaxy Buds FE True Wireless (In-ear) - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"Ki\\u1ec3u d\\u00e1ng": "In-ear True Wireless", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.2", "Microphone": "3 mic ANC", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 20kHz", "Pin": "6 gi\\u1edd (30 gi\\u1edd v\\u1edbi case)"}	0
3f7b0454-5005-4cb4-b956-3c3f304aae31	Tai nghe Corsair HS80 MAX Wireless (Over-ear Gaming)	tai-nghe-corsair-hs80-max-wireless-over-ear-gaming	Tai nghe Corsair HS80 MAX Wireless (Over-ear Gaming) - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"Ki\\u1ec3u d\\u00e1ng": "Over-ear", "K\\u1ebft n\\u1ed1i": "SLIPSTREAM / Bluetooth / 3.5mm", "Microphone": "Omnidirectional", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 40kHz", "Pin": "65 gi\\u1edd"}	0
f6af6fa8-a4b9-4089-9e86-1c79ef262893	Tai nghe HyperX Cloud III Có Dây	tai-nghe-hyperx-cloud-iii-co-day	Tai nghe HyperX Cloud III Có Dây - Sản phẩm chính hãng HyperX, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	d35a1862-b253-4855-bc3f-05282e96ea67	{"Ki\\u1ec3u d\\u00e1ng": "Over-ear", "K\\u1ebft n\\u1ed1i": "USB-C / 3.5mm c\\u00f3 d\\u00e2y", "Microphone": "Detachable", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "10Hz - 21kHz", "Driver": "53mm"}	0
76537b6b-3947-4570-bd09-9b942da18b16	Loa Edifier R1280DBs Bluetooth Active Bookshelf 2.0	loa-edifier-r1280dbs-bluetooth-active-bookshelf-20	Loa Edifier R1280DBs Bluetooth Active Bookshelf 2.0 - Sản phẩm chính hãng Edifier, bảo hành tại EZ4GEAR.	f9d29f85-1c8d-4439-b277-82fabd5f03ba	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	7c1ec210-f9e0-4c3e-af7a-3d87b024c65c	{"C\\u00f4ng su\\u1ea5t": "42W (21W x 2)", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.0 / Optical / RCA", "K\\u00edch th\\u01b0\\u1edbc": "Bookshelf 2.0"}	0
068dd5c4-703a-434e-8418-c36d69a45ba7	Webcam Elgato Facecam Pro 4K60	webcam-elgato-facecam-pro-4k60	Webcam Elgato Facecam Pro 4K60 - Sản phẩm chính hãng Elgato, bảo hành tại EZ4GEAR.	17b32335-4570-41fd-9070-726482b5ef7c	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	bf1bff8c-edff-4549-a6f9-6809ba28ebf7	{"\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "4K 60fps / 1080p 60fps", "K\\u1ebft n\\u1ed1i": "USB-C 3.0", "Microphone": "Kh\\u00f4ng c\\u00f3 mic", "T\\u00ednh n\\u0103ng": "Sony STARVIS sensor, f/2.0"}	0
5118873c-0d24-413d-926b-2c705669bab4	Microphone HyperX QuadCast S USB RGB	microphone-hyperx-quadcast-s-usb-rgb	Microphone HyperX QuadCast S USB RGB - Sản phẩm chính hãng HyperX, bảo hành tại EZ4GEAR.	2a4a25f6-12b0-439e-9bca-1ce03ba4894c	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	d35a1862-b253-4855-bc3f-05282e96ea67	{"Ki\\u1ec3u": "Condenser", "K\\u1ebft n\\u1ed1i": "USB-C", "H\\u01b0\\u1edbng thu": "4 h\\u01b0\\u1edbng (Stereo/Omni/Cardioid/Bidirectional)", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 20kHz", "LED": "RGB t\\u00edch h\\u1ee3p"}	0
ebe47211-86b4-496f-96ff-b2c7ca3375fc	Microphone Elgato Wave:3 Premium USB Condenser	microphone-elgato-wave3-premium-usb-condenser	Microphone Elgato Wave:3 Premium USB Condenser - Sản phẩm chính hãng Elgato, bảo hành tại EZ4GEAR.	2a4a25f6-12b0-439e-9bca-1ce03ba4894c	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	bf1bff8c-edff-4549-a6f9-6809ba28ebf7	{"Ki\\u1ec3u": "Condenser", "K\\u1ebft n\\u1ed1i": "USB-C", "H\\u01b0\\u1edbng thu": "Cardioid", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "70Hz - 20kHz", "Bit depth": "24-bit / 96kHz"}	0
8947df22-c596-4fc3-8100-91adfa301a58	Dịch vụ Cài đặt Windows + Driver + Phần mềm cơ bản	dich-vu-cai-at-windows-driver-phan-mem-co-ban	Dịch vụ Cài đặt Windows + Driver + Phần mềm cơ bản - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	b884bf3c-f5b7-48b8-985e-95cb6043779c	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"Bao g\\u1ed3m": "Windows 11 + Driver + Office + Antivirus", "Th\\u1eddi gian": "30-60 ph\\u00fat", "B\\u1ea3o h\\u00e0nh": "1 th\\u00e1ng c\\u00e0i l\\u1ea1i mi\\u1ec5n ph\\u00ed"}	0
f509d38f-750d-4704-a91b-457dbe7274c9	Dịch vụ Thu cũ đổi mới - Nâng cấp PC/Laptop	dich-vu-thu-cu-oi-moi-nang-cap-pclaptop	Dịch vụ Thu cũ đổi mới - Nâng cấp PC/Laptop - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	b884bf3c-f5b7-48b8-985e-95cb6043779c	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"Bao g\\u1ed3m": "\\u0110\\u1ecbnh gi\\u00e1 m\\u00e1y c\\u0169, tr\\u1eeb v\\u00e0o m\\u00e1y m\\u1edbi", "Th\\u1eddi gian": "15-30 ph\\u00fat \\u0111\\u1ecbnh gi\\u00e1", "\\u0110i\\u1ec1u ki\\u1ec7n": "M\\u00e1y c\\u00f2n ho\\u1ea1t \\u0111\\u1ed9ng, kh\\u00f4ng h\\u01b0 h\\u1ecfng n\\u1eb7ng", "\\u01afu \\u0111\\u00e3i": "Thu gi\\u00e1 cao nh\\u1ea5t th\\u1ecb tr\\u01b0\\u1eddng"}	0
440918d8-d3f7-4b21-8bab-4c54c05a1e54	RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz	ram-kingston-fury-beast-16gb-2x8gb-ddr4-3200mhz	RAM Kingston Fury Beast 16GB (2x8GB) DDR4 3200MHz - Sản phẩm chính hãng Kingston, bảo hành tại EZ4GEAR.	56162dc3-558b-489f-9735-c7a27e80f7ac	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	c308ee69-36f0-44c9-b0de-220f9bb2e5a4	{"Dung l\\u01b0\\u1ee3ng": "16GB (2x8GB)", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "DDR4", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "3200MHz", "CAS Latency": "CL16"}	0
ba4d3b01-f4f7-4661-91b9-fa988776c02c	Case ASUS TUF Gaming GT302 ARGB Black	case-asus-tuf-gaming-gt302-argb-black	Case ASUS TUF Gaming GT302 ARGB Black - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"K\\u00edch th\\u01b0\\u1edbc": "Mid Tower ATX", "Ch\\u1ea5t li\\u1ec7u": "Th\\u00e9p + K\\u00ednh c\\u01b0\\u1eddng l\\u1ef1c", "Fan": "4x 140mm ARGB", "M\\u00e0u s\\u1eafc": "\\u0110en"}	0
1d539479-cf0c-4910-9423-50fe30854007	Bàn phím cơ Akko 3098B Multi-Modes Blue on White	ban-phim-co-akko-3098b-multi-modes-blue-on-white	Bàn phím cơ Akko 3098B Multi-Modes Blue on White - Sản phẩm chính hãng Akko, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	f75e0e15-034d-4e21-adbb-10f75685a10f	{"Lo\\u1ea1i Switch": "Akko CS Jelly White", "K\\u1ebft n\\u1ed1i": "Bluetooth / 2.4GHz / USB-C", "K\\u00edch th\\u01b0\\u1edbc": "98% (100 ph\\u00edm)", "Keycap": "PBT Double-shot", "LED": "RGB"}	0
0aa31f11-34b9-41f8-b814-64c6f868d96c	Microsoft Office 365 Personal (1 năm)	microsoft-office-365-personal-1-nam	Microsoft Office 365 Personal (1 năm) - Sản phẩm chính hãng Microsoft, bảo hành tại EZ4GEAR.	65581e2b-d085-4b8e-83d4-7e54b5b53adc	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b2b6d331-a1c5-4ef3-a89a-cc9ea26c0656	{"Lo\\u1ea1i": "B\\u1ea3n quy\\u1ec1n s\\u1ed1 (Digital)", "Th\\u1eddi h\\u1ea1n": "1 n\\u0103m", "S\\u1ed1 thi\\u1ebft b\\u1ecb": "1 ng\\u01b0\\u1eddi d\\u00f9ng", "Dung l\\u01b0\\u1ee3ng": "1TB OneDrive"}	1
cf10157f-8d1d-4478-bc75-edaec00b87f8	Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m	cap-sac-anker-543-usb-c-to-usb-c-100w-18m	Cáp sạc Anker 543 USB-C to USB-C 100W 1.8m - Sản phẩm chính hãng Anker, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	abe88bae-b775-4e41-a63c-61aae671041e	{"Chi\\u1ec1u d\\u00e0i": "1.8m", "C\\u00f4ng su\\u1ea5t": "100W USB-C PD", "Chu\\u1ea9n": "USB 2.0", "Ch\\u1ea5t li\\u1ec7u": "Nylon b\\u1ec7n"}	0
d1ad81c8-bd46-4e07-8235-8cd9ebf738ae	Balo Laptop ASUS ROG Ranger BP2701 17 inch	balo-laptop-asus-rog-ranger-bp2701-17-inch	Balo Laptop ASUS ROG Ranger BP2701 17 inch - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"K\\u00edch th\\u01b0\\u1edbc": "Laptop 17 inch", "Ch\\u1ea5t li\\u1ec7u": "Polyester ch\\u1ed1ng n\\u01b0\\u1edbc", "Dung t\\u00edch": "22L"}	0
20c7eaea-1349-41d8-b6c3-453bc036de01	PC EZ4ENCE Full White RGB - AMD Ryzen 5 7600X / RTX 4060 Ti	pc-ez4ence-full-white-rgb-amd-ryzen-5-7600x-rtx-4060-ti	PC EZ4ENCE Full White RGB - AMD Ryzen 5 7600X / RTX 4060 Ti - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "AMD Ryzen 5 7600X", "ram": "32GB DDR5 6000MHz (Tr\\u1eafng)", "vga": "NVIDIA RTX 4060 Ti 8GB White", "storage": "SSD NVMe 1TB", "mainboard": "B650M AORUS Elite AX White", "psu": "750W 80+ Gold White", "case": "NZXT H7 Flow White", "T\\u1ea3n nhi\\u1ec7t": "AIO 360mm White ARGB"}	0
25c3d7dd-f065-4abd-bff1-a91ed3c2ae8f	Màn hình Dell P2422H 24 inch FHD IPS (Văn phòng)	man-hinh-dell-p2422h-24-inch-fhd-ips-van-phong	Màn hình Dell P2422H 24 inch FHD IPS (Văn phòng) - Sản phẩm chính hãng Dell, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	68c582d5-cfdf-4d5d-9c28-d3f4eac3a614	{"K\\u00edch th\\u01b0\\u1edbc": "24 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "FHD (1920x1080)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "60Hz", "T\\u1ea5m n\\u1ec1n": "IPS", "Nhu c\\u1ea7u": "V\\u0103n ph\\u00f2ng"}	0
26024f19-c86a-45df-9102-8d24a0d93c2f	Màn hình LG 27GP850-B 27 inch 2K 165Hz Nano IPS (Gaming)	man-hinh-lg-27gp850-b-27-inch-2k-165hz-nano-ips-gaming	Màn hình LG 27GP850-B 27 inch 2K 165Hz Nano IPS (Gaming) - Sản phẩm chính hãng LG, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	c3e84be6-e1ab-429f-9de3-3ebeb04da941	{"K\\u00edch th\\u01b0\\u1edbc": "27 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "2K QHD (2560x1440)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "165Hz", "T\\u1ea5m n\\u1ec1n": "Nano IPS", "Nhu c\\u1ea7u": "Gaming"}	0
2b22ce02-b5cf-42d3-aab0-0e1672d36fcd	Bàn phím cơ Akko 3068B Plus Black & Gold (Mini 65%)	ban-phim-co-akko-3068b-plus-black-gold-mini-65	Bàn phím cơ Akko 3068B Plus Black & Gold (Mini 65%) - Sản phẩm chính hãng Akko, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	f75e0e15-034d-4e21-adbb-10f75685a10f	{"Lo\\u1ea1i Switch": "Akko CS Crystal", "K\\u1ebft n\\u1ed1i": "Bluetooth / 2.4GHz / USB-C", "K\\u00edch th\\u01b0\\u1edbc": "65% Mini (68 ph\\u00edm)", "Keycap": "PBT Double-shot", "LED": "RGB"}	0
d77bb12f-b994-4c84-a746-2f4bb9cfd0cc	Máy chơi game Xbox Series X 1TB	may-choi-game-xbox-series-x-1tb	Máy chơi game Xbox Series X 1TB - Sản phẩm chính hãng Microsoft, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b2b6d331-a1c5-4ef3-a89a-cc9ea26c0656	{"CPU": "AMD Zen 2 Custom 8-Core 3.8GHz", "GPU": "AMD RDNA 2 12 TFLOPS", "Dung l\\u01b0\\u1ee3ng": "1TB SSD", "\\u0110\\u0129a": "C\\u00f3 \\u1ed5 \\u0111\\u0129a 4K UHD Blu-ray"}	2
e2dd97e0-9322-491c-b899-e307b47dd8ac	Tay cầm Sony DualSense Edge Wireless Controller (PS5)	tay-cam-sony-dualsense-edge-wireless-controller-ps5	Tay cầm Sony DualSense Edge Wireless Controller (PS5) - Sản phẩm chính hãng Sony, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d2a21452-a924-435f-9645-9746ba819325	{"K\\u1ebft n\\u1ed1i": "Bluetooth / USB-C", "T\\u01b0\\u01a1ng th\\u00edch": "PS5 / PC", "Pin": "T\\u00edch h\\u1ee3p Li-Ion", "T\\u00ednh n\\u0103ng": "Adaptive Trigger, Haptic Feedback, Back Buttons"}	1
f16669aa-3ed1-4c33-8405-25b37a6d760d	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730	pc-ez4ence-van-phong-intel-i3-13100-uhd-730	PC EZ4ENCE Văn Phòng - Intel i3 13100 / UHD 730 - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i3-13100", "ram": "8GB DDR4 3200MHz", "vga": "Intel UHD 730", "storage": "SSD NVMe 256GB", "mainboard": "H610M", "psu": "450W 80+", "case": "EZ4GEAR Compact S"}	1
6a639ad9-a30b-4a8f-8f9d-62e350d7e775	Mainboard MSI MAG B650 TOMAHAWK WIFI	mainboard-msi-mag-b650-tomahawk-wifi	Mainboard MSI MAG B650 TOMAHAWK WIFI - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	acce1753-eade-487f-a300-68b45fd325f6	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"Socket": "AM5", "Chipset": "AMD B650", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "DDR5, PCIe 4.0, WiFi 6E"}	0
352b3e4e-eec9-4b30-8c0a-d8dea6b8bcfd	Mainboard GIGABYTE B760M AORUS ELITE AX DDR4	mainboard-gigabyte-b760m-aorus-elite-ax-ddr4	Mainboard GIGABYTE B760M AORUS ELITE AX DDR4 - Sản phẩm chính hãng Gigabyte, bảo hành tại EZ4GEAR.	acce1753-eade-487f-a300-68b45fd325f6	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	b951edf0-37c6-4c24-916f-c5705f71044d	{"Socket": "LGA 1700", "Chipset": "Intel B760", "K\\u00edch th\\u01b0\\u1edbc": "Micro-ATX", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "DDR4, PCIe 4.0, WiFi 6E"}	0
72105a2f-dd39-4f90-b944-c825c4bd9c8f	Mainboard ASUS PRIME B650M-A WIFI II	mainboard-asus-prime-b650m-a-wifi-ii	Mainboard ASUS PRIME B650M-A WIFI II - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	acce1753-eade-487f-a300-68b45fd325f6	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"Socket": "AM5", "Chipset": "AMD B650", "K\\u00edch th\\u01b0\\u1edbc": "Micro-ATX", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "DDR5, PCIe 4.0, WiFi 6"}	0
f6a6d2a9-8021-4321-9af8-0bb6b6106d64	Mainboard GIGABYTE Z790 AORUS ELITE AX DDR5	mainboard-gigabyte-z790-aorus-elite-ax-ddr5	Mainboard GIGABYTE Z790 AORUS ELITE AX DDR5 - Sản phẩm chính hãng Gigabyte, bảo hành tại EZ4GEAR.	acce1753-eade-487f-a300-68b45fd325f6	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	b951edf0-37c6-4c24-916f-c5705f71044d	{"Socket": "LGA 1700", "Chipset": "Intel Z790", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "DDR5, PCIe 5.0, WiFi 6E, 2.5G LAN"}	0
c7d7b673-e0d1-4966-99c5-9b7d3792aeef	RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6400MHz	ram-corsair-vengeance-rgb-32gb-2x16gb-ddr5-6400mhz	RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6400MHz - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	56162dc3-558b-489f-9735-c7a27e80f7ac	t	2026-06-16 23:15:40.700908+07	2026-06-16 23:15:40.700908+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"Dung l\\u01b0\\u1ee3ng": "32GB (2x16GB)", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "DDR5", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "6400MHz", "CAS Latency": "CL32"}	0
8d3b1f7a-f483-4f0a-8139-165d6463e7df	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz	ram-gskill-trident-z5-rgb-32gb-2x16gb-ddr5-6000mhz	RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000MHz - Sản phẩm chính hãng G.Skill, bảo hành tại EZ4GEAR.	56162dc3-558b-489f-9735-c7a27e80f7ac	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	386657d6-e73d-436b-83c9-70824abe69fc	{"Dung l\\u01b0\\u1ee3ng": "32GB (2x16GB)", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "DDR5", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "6000MHz", "CAS Latency": "CL30"}	3
9675afd9-7e24-4fd1-9d19-ce1817238d7a	RAM Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz	ram-kingston-fury-beast-16gb-1x16gb-ddr5-5600mhz	RAM Kingston Fury Beast 16GB (1x16GB) DDR5 5600MHz - Sản phẩm chính hãng Kingston, bảo hành tại EZ4GEAR.	56162dc3-558b-489f-9735-c7a27e80f7ac	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c308ee69-36f0-44c9-b0de-220f9bb2e5a4	{"Dung l\\u01b0\\u1ee3ng": "16GB (1x16GB)", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "DDR5", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "5600MHz", "CAS Latency": "CL36"}	2
32e2cc84-167b-4c65-b522-6610e60f986f	RAM Kingston Fury Impact 16GB DDR5 4800MHz SODIMM (Laptop)	ram-kingston-fury-impact-16gb-ddr5-4800mhz-sodimm-laptop	RAM Kingston Fury Impact 16GB DDR5 4800MHz SODIMM (Laptop) - Sản phẩm chính hãng Kingston, bảo hành tại EZ4GEAR.	56162dc3-558b-489f-9735-c7a27e80f7ac	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c308ee69-36f0-44c9-b0de-220f9bb2e5a4	{"Dung l\\u01b0\\u1ee3ng": "16GB (1x16GB)", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "DDR5 SODIMM (Laptop)", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "4800MHz", "CAS Latency": "CL38"}	3
6069f04a-6357-460a-9873-7b70f720c426	Case Corsair 5000D Airflow Black	case-corsair-5000d-airflow-black	Case Corsair 5000D Airflow Black - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"K\\u00edch th\\u01b0\\u1edbc": "Mid Tower ATX", "Ch\\u1ea5t li\\u1ec7u": "Th\\u00e9p + K\\u00ednh c\\u01b0\\u1eddng l\\u1ef1c", "Fan": "2x 120mm", "M\\u00e0u s\\u1eafc": "\\u0110en"}	2
2668a7fe-6351-413f-abbc-eb25ff7314fe	Adobe Creative Cloud All Apps 1 Năm (Đồ họa)	adobe-creative-cloud-all-apps-1-nam-o-hoa	Adobe Creative Cloud All Apps 1 Năm (Đồ họa) - Sản phẩm chính hãng Adobe, bảo hành tại EZ4GEAR.	65581e2b-d085-4b8e-83d4-7e54b5b53adc	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eb6fb50-6b46-4c05-8eba-ac38636e3d88	{"Lo\\u1ea1i": "Ph\\u1ea7n m\\u1ec1m \\u0110\\u1ed3 h\\u1ecda", "Bao g\\u1ed3m": "Photoshop, Illustrator, Premiere Pro, After Effects...", "Th\\u1eddi h\\u1ea1n": "1 n\\u0103m", "S\\u1ed1 thi\\u1ebft b\\u1ecb": "2 thi\\u1ebft b\\u1ecb"}	2
4be28bc4-8e5b-4011-b47f-f07e0ca90501	Máy chơi game Valve Steam Deck OLED 1TB	may-choi-game-valve-steam-deck-oled-1tb	Máy chơi game Valve Steam Deck OLED 1TB - Sản phẩm chính hãng Valve, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	35aa2119-763b-4a60-8d61-7ac2f979b6cc	{"CPU": "AMD APU Zen 2 4-Core", "RAM": "16GB LPDDR5", "Dung l\\u01b0\\u1ee3ng": "1TB NVMe SSD", "M\\u00e0n h\\u00ecnh": "7.4 inch OLED 90Hz HDR"}	3
87fb89a5-89df-4619-a16e-ab3689ffe205	Bàn phím cơ Keychron Q1 Pro QMK/VIA	ban-phim-co-keychron-q1-pro-qmkvia	Bàn phím cơ Keychron Q1 Pro QMK/VIA - Sản phẩm chính hãng Keychron, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	21b7d1a4-c6c0-4036-852a-3afdfd9ddbcf	{"Lo\\u1ea1i Switch": "Gateron Jupiter Red", "K\\u1ebft n\\u1ed1i": "Bluetooth / USB-C", "K\\u00edch th\\u01b0\\u1edbc": "75% (84 ph\\u00edm)", "Keycap": "PBT Double-shot", "LED": "RGB South-facing"}	3
0e5e45c2-756b-4d85-af2c-0fc48c6c54b8	Loa Creative Stage SE Soundbar 2.0	loa-creative-stage-se-soundbar-20	Loa Creative Stage SE Soundbar 2.0 - Sản phẩm chính hãng Creative, bảo hành tại EZ4GEAR.	f9d29f85-1c8d-4439-b277-82fabd5f03ba	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	aa0c8028-9c69-452c-89c8-3af703befee3	{"C\\u00f4ng su\\u1ea5t": "24W", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.3 / USB / AUX 3.5mm", "K\\u00edch th\\u01b0\\u1edbc": "Soundbar d\\u01b0\\u1edbi m\\u00e0n h\\u00ecnh"}	3
2ffd3508-7558-4d75-9e57-57cc3cbac6c0	Bàn phím cơ Logitech G Pro X TKL LIGHTSPEED	ban-phim-co-logitech-g-pro-x-tkl-lightspeed	Bàn phím cơ Logitech G Pro X TKL LIGHTSPEED - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"Lo\\u1ea1i Switch": "GX Red", "K\\u1ebft n\\u1ed1i": "LIGHTSPEED 2.4GHz / Bluetooth / USB-C", "K\\u00edch th\\u01b0\\u1edbc": "TKL (87 ph\\u00edm)", "LED": "LIGHTSYNC RGB"}	0
3e1d5f73-4a62-466b-b6ab-6408bad293ca	PC EZ4ENCE Custom Nước - Intel i9 14900KS / RTX 4090	pc-ez4ence-custom-nuoc-intel-i9-14900ks-rtx-4090	PC EZ4ENCE Custom Nước - Intel i9 14900KS / RTX 4090 - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i9-14900KS", "ram": "64GB DDR5 7200MHz", "vga": "NVIDIA GeForce RTX 4090 24GB", "storage": "SSD NVMe 4TB", "mainboard": "Z790 ROG MAXIMUS HERO", "psu": "1600W 80+ Titanium", "case": "Custom Open Loop + \\u1ed0ng c\\u1ee9ng", "T\\u1ea3n nhi\\u1ec7t": "Full Custom Water Cooling Loop"}	0
3e5447a8-c56e-42f7-b565-6fbd4c868bb8	Màn hình MSI MAG 274QRF QD E2 27 inch 2K 180Hz (Gaming)	man-hinh-msi-mag-274qrf-qd-e2-27-inch-2k-180hz-gaming	Màn hình MSI MAG 274QRF QD E2 27 inch 2K 180Hz (Gaming) - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"K\\u00edch th\\u01b0\\u1edbc": "27 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "2K QHD (2560x1440)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "180Hz", "T\\u1ea5m n\\u1ec1n": "Rapid IPS + Quantum Dot", "Nhu c\\u1ea7u": "Gaming"}	0
5d9224ea-b19b-4131-8fc1-3acc8e1dabd0	Giá treo màn hình NZXT Manta Monitor Arm Single	gia-treo-man-hinh-nzxt-manta-monitor-arm-single	Giá treo màn hình NZXT Manta Monitor Arm Single - Sản phẩm chính hãng NZXT, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	b08bb8ef-402c-44e1-beb9-65f279d3b61b	{"T\\u1ea3i tr\\u1ecdng": "2 - 9kg", "K\\u00edch th\\u01b0\\u1edbc m\\u00e0n h\\u00ecnh": "17 - 34 inch", "VESA": "75x75 / 100x100mm"}	0
cb75bb82-9f8b-4c83-b0cf-4f36ac6d17a8	Hub USB-C Razer USB-C Dock 11-in-1	hub-usb-c-razer-usb-c-dock-11-in-1	Hub USB-C Razer USB-C Dock 11-in-1 - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"C\\u1ed5ng": "4K HDMI, 3x USB-A 3.2, 2x USB-C, SD/MicroSD, Ethernet, 3.5mm", "C\\u00f4ng su\\u1ea5t PD": "85W USB-C PD Pass-through"}	0
f92ef0bc-5fd0-4c3a-baf8-8930a21dfd44	Windows 11 Home 64-bit Bản quyền (OEM)	windows-11-home-64-bit-ban-quyen-oem	Windows 11 Home 64-bit Bản quyền (OEM) - Sản phẩm chính hãng Microsoft, bảo hành tại EZ4GEAR.	65581e2b-d085-4b8e-83d4-7e54b5b53adc	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	b2b6d331-a1c5-4ef3-a89a-cc9ea26c0656	{"Lo\\u1ea1i": "B\\u1ea3n quy\\u1ec1n Windows", "Phi\\u00ean b\\u1ea3n": "Windows 11 Home 64-bit", "Th\\u1eddi h\\u1ea1n": "V\\u0129nh vi\\u1ec5n (OEM)", "Giao h\\u00e0ng": "Key + USB c\\u00e0i \\u0111\\u1eb7t"}	0
3714a91a-8c8b-49ea-8dda-e7b008aa6fdd	Nguồn ASUS ROG STRIX 850W 80 Plus Gold - Full Modular	nguon-asus-rog-strix-850w-80-plus-gold-full-modular	Nguồn ASUS ROG STRIX 850W 80 Plus Gold - Full Modular - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	342ca7e2-6ad3-4c6e-82c3-50baac105e49	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"C\\u00f4ng su\\u1ea5t": "850W", "Chu\\u1ea9n": "80 Plus Gold", "K\\u00edch th\\u01b0\\u1edbc": "ATX 3.0", "Modular": "Full Modular"}	1
3847dc6e-c5e8-4bdb-8185-21d8372881c9	Webcam Razer Kiyo Pro Ultra 4K	webcam-razer-kiyo-pro-ultra-4k	Webcam Razer Kiyo Pro Ultra 4K - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	17b32335-4570-41fd-9070-726482b5ef7c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "4K 30fps / 1080p 60fps", "K\\u1ebft n\\u1ed1i": "USB-C", "Microphone": "Omnidirectional", "T\\u00ednh n\\u0103ng": "HDR, AI Noise Removal"}	1
38634d1c-b0de-47f3-b089-0e0d0e2c1338	Nguồn DeepCool PX1000G 1000W 80 Plus Gold - Full Modular	nguon-deepcool-px1000g-1000w-80-plus-gold-full-modular	Nguồn DeepCool PX1000G 1000W 80 Plus Gold - Full Modular - Sản phẩm chính hãng DeepCool, bảo hành tại EZ4GEAR.	342ca7e2-6ad3-4c6e-82c3-50baac105e49	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	22fcd678-380c-4698-8fd5-e4ec1b8b1017	{"C\\u00f4ng su\\u1ea5t": "1000W", "Chu\\u1ea9n": "80 Plus Gold", "K\\u00edch th\\u01b0\\u1edbc": "ATX 3.0", "Modular": "Full Modular"}	1
457f3063-930a-4598-bd44-3f52b933bdb3	Case Lian Li LANCOOL III RGB White	case-lian-li-lancool-iii-rgb-white	Case Lian Li LANCOOL III RGB White - Sản phẩm chính hãng Lianli, bảo hành tại EZ4GEAR.	00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	55165d01-912a-4323-8d70-68f9c112ef54	{"K\\u00edch th\\u01b0\\u1edbc": "Mid Tower E-ATX", "Ch\\u1ea5t li\\u1ec7u": "Nh\\u00f4m + K\\u00ednh c\\u01b0\\u1eddng l\\u1ef1c", "Fan": "3x 140mm ARGB", "M\\u00e0u s\\u1eafc": "Tr\\u1eafng"}	1
482ef6da-9507-4f18-a9d7-f1ed54002b33	PC EZ4ENCE Hi-End - Intel i9 14900K / RTX 4090	pc-ez4ence-hi-end-intel-i9-14900k-rtx-4090	PC EZ4ENCE Hi-End - Intel i9 14900K / RTX 4090 - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i9-14900K", "ram": "64GB DDR5 6400MHz", "vga": "NVIDIA GeForce RTX 4090 24GB", "storage": "SSD NVMe 2TB + HDD 4TB", "mainboard": "Z790 AORUS Master", "psu": "1200W 80+ Platinum", "case": "Lian Li O11D EVO XL"}	1
4f3f7912-6d11-4da8-a748-e3e267e5c964	Laptop Gaming Lenovo LOQ 15IAX9	laptop-gaming-lenovo-loq-15iax9	Laptop Gaming Lenovo LOQ 15IAX9 - Sản phẩm chính hãng Lenovo, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ecf34ee3-0789-400f-afe8-31a1da50d924	{"cpu": "Intel Core i5-12450HX", "ram": "12GB DDR5", "storage": "SSD 512GB", "vga": "NVIDIA RTX 3050 6GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 144Hz"}	2
67c1b43c-db6c-4fa4-ada8-a9348692fab6	Vô lăng đua xe Thrustmaster T248 Racing Wheel (PS/PC)	vo-lang-ua-xe-thrustmaster-t248-racing-wheel-pspc	Vô lăng đua xe Thrustmaster T248 Racing Wheel (PS/PC) - Sản phẩm chính hãng Thrustmaster, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	e241897d-3ab2-4aef-91ca-e3a6d02dfa80	{"K\\u1ebft n\\u1ed1i": "USB", "T\\u01b0\\u01a1ng th\\u00edch": "PS5 / PS4 / PC", "Force Feedback": "Hybrid Drive (belt + gear)", "G\\u00f3c xoay": "900\\u00b0", "Pedals": "T3PM 3-pedal set"}	0
7a8a80d1-4919-4b76-bdfb-9cd806867994	Màn hình ASUS VG27AQ1A 27 inch 2K 170Hz IPS (Gaming)	man-hinh-asus-vg27aq1a-27-inch-2k-170hz-ips-gaming	Màn hình ASUS VG27AQ1A 27 inch 2K 170Hz IPS (Gaming) - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"K\\u00edch th\\u01b0\\u1edbc": "27 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "2K QHD (2560x1440)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "170Hz", "T\\u1ea5m n\\u1ec1n": "IPS", "Nhu c\\u1ea7u": "Gaming"}	0
7c2f5dfe-25fe-4210-bced-1d0a1028a66b	Phần mềm Diệt Virus Kaspersky Plus 1 PC 1 Năm	phan-mem-diet-virus-kaspersky-plus-1-pc-1-nam	Phần mềm Diệt Virus Kaspersky Plus 1 PC 1 Năm - Sản phẩm chính hãng Kaspersky, bảo hành tại EZ4GEAR.	65581e2b-d085-4b8e-83d4-7e54b5b53adc	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	0654191f-2d5d-4055-b5d8-9d4b4a30ba54	{"Lo\\u1ea1i": "Ph\\u1ea7n m\\u1ec1m Di\\u1ec7t Virus", "S\\u1ed1 thi\\u1ebft b\\u1ecb": "1 PC", "Th\\u1eddi h\\u1ea1n": "1 n\\u0103m", "T\\u00ednh n\\u0103ng": "Antivirus + VPN + Privacy"}	0
82265e80-b490-4908-94d4-bad608ea0710	PC EZ4ENCE Đồ Họa - AMD Ryzen 9 7950X / RTX 4080 Super	pc-ez4ence-o-hoa-amd-ryzen-9-7950x-rtx-4080-super	PC EZ4ENCE Đồ Họa - AMD Ryzen 9 7950X / RTX 4080 Super - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "AMD Ryzen 9 7950X", "ram": "64GB DDR5 5600MHz ECC", "vga": "NVIDIA GeForce RTX 4080 Super 16GB", "storage": "SSD NVMe 2TB", "mainboard": "X670E AORUS Master", "psu": "1000W 80+ Gold", "case": "Fractal Design Meshify 2 XL"}	0
83c6d96a-370b-496e-817c-5f32f1b4ef1e	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa)	man-hinh-asus-proart-pa279crv-27-inch-4k-usb-c-o-hoa	Màn hình ASUS ProArt PA279CRV 27 inch 4K USB-C (Đồ họa) - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"K\\u00edch th\\u01b0\\u1edbc": "27 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "4K UHD (3840x2160)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "60Hz", "T\\u1ea5m n\\u1ec1n": "IPS", "Nhu c\\u1ea7u": "\\u0110\\u1ed3 h\\u1ecda chuy\\u00ean nghi\\u1ec7p"}	0
91f5fedc-a603-4b3d-b4fb-7a2349a9b2b3	PC EZ4ENCE Gaming Starter - Intel i5 13400F / RTX 4060	pc-ez4ence-gaming-starter-intel-i5-13400f-rtx-4060	PC EZ4ENCE Gaming Starter - Intel i5 13400F / RTX 4060 - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i5-13400F", "ram": "16GB DDR5 5600MHz", "vga": "NVIDIA GeForce RTX 4060 8GB", "storage": "SSD NVMe 500GB", "mainboard": "B760M", "psu": "650W 80+ Bronze", "case": "EZ4GEAR S1 Mesh"}	0
9d322044-c4b0-4788-8f7a-fd28b976743e	Màn hình Samsung Odyssey G9 G95SC 49 inch Curved DQHD 240Hz	man-hinh-samsung-odyssey-g9-g95sc-49-inch-curved-dqhd-240hz	Màn hình Samsung Odyssey G9 G95SC 49 inch Curved DQHD 240Hz - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"K\\u00edch th\\u01b0\\u1edbc": "49 inch Ultrawide", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "Dual QHD (5120x1440)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "240Hz", "T\\u1ea5m n\\u1ec1n": "OLED", "Nhu c\\u1ea7u": "Gaming Ultrawide"}	0
ae741e41-6fad-4345-bdc8-c8c6bf9b1209	Pin dự phòng Anker PowerCore III Elite 25600mAh 87W PD	pin-du-phong-anker-powercore-iii-elite-25600mah-87w-pd	Pin dự phòng Anker PowerCore III Elite 25600mAh 87W PD - Sản phẩm chính hãng Anker, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	abe88bae-b775-4e41-a63c-61aae671041e	{"Dung l\\u01b0\\u1ee3ng": "25600mAh", "C\\u00f4ng su\\u1ea5t": "87W USB-C PD", "C\\u1ed5ng": "1x USB-C PD + 2x USB-A", "T\\u00ednh n\\u0103ng": "S\\u1ea1c \\u0111\\u01b0\\u1ee3c Laptop qua USB-C"}	0
f3c9ff32-087d-4a6d-980c-7b8da9c095f4	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C	man-hinh-dell-ultrasharp-u2723qe-27-inch-4k-ips-usb-c	Màn hình Dell UltraSharp U2723QE 27 inch 4K IPS USB-C - Sản phẩm chính hãng Dell, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	68c582d5-cfdf-4d5d-9c28-d3f4eac3a614	{"K\\u00edch th\\u01b0\\u1edbc": "27 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "4K UHD (3840x2160)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "60Hz", "T\\u1ea5m n\\u1ec1n": "IPS Black", "Nhu c\\u1ea7u": "V\\u0103n ph\\u00f2ng cao c\\u1ea5p"}	0
fa57f8f5-bfae-4856-ae5d-762a66a1a0f6	Tay cầm Xbox Wireless Controller Carbon Black	tay-cam-xbox-wireless-controller-carbon-black	Tay cầm Xbox Wireless Controller Carbon Black - Sản phẩm chính hãng Microsoft, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-25 14:50:40.989002+07	b2b6d331-a1c5-4ef3-a89a-cc9ea26c0656	{"K\\u1ebft n\\u1ed1i": "Bluetooth / USB-C / Xbox Wireless", "T\\u01b0\\u01a1ng th\\u00edch": "Xbox / PC / Mobile", "Pin": "2x Pin AA", "T\\u00ednh n\\u0103ng": "Textured Grip, Share Button"}	0
004c40c5-d6e7-44a2-ae0d-b9f7785c24de	Đế tản nhiệt Laptop Cooler Master NotePal X-Slim II	e-tan-nhiet-laptop-cooler-master-notepal-x-slim-ii	Đế tản nhiệt Laptop Cooler Master NotePal X-Slim II - Sản phẩm chính hãng Cooler Master, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	4f72dcdc-033e-4dff-8299-58b061dfb2ff	{"T\\u01b0\\u01a1ng th\\u00edch": "Laptop 15.6 inch", "Fan": "1x 200mm Silent Fan", "C\\u1ed5ng USB": "1x USB 2.0 Pass-through", "Ch\\u1ea5t li\\u1ec7u": "Nh\\u1ef1a + L\\u01b0\\u1edbi th\\u00e9p"}	2
0254eac8-dbf4-4f34-b3e6-cbc20960cbb0	Webcam Logitech C922 Pro Stream 1080p	webcam-logitech-c922-pro-stream-1080p	Webcam Logitech C922 Pro Stream 1080p - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	17b32335-4570-41fd-9070-726482b5ef7c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "1080p 30fps / 720p 60fps", "K\\u1ebft n\\u1ed1i": "USB-A", "Microphone": "Dual Stereo Mic", "T\\u00ednh n\\u0103ng": "Auto-focus, Low light correction"}	1
02602a91-6128-415e-a01d-da2791406a78	Loa Creative Pebble V3 USB-C 2.0	loa-creative-pebble-v3-usb-c-20	Loa Creative Pebble V3 USB-C 2.0 - Sản phẩm chính hãng Creative, bảo hành tại EZ4GEAR.	f9d29f85-1c8d-4439-b277-82fabd5f03ba	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	aa0c8028-9c69-452c-89c8-3af703befee3	{"C\\u00f4ng su\\u1ea5t": "16W", "K\\u1ebft n\\u1ed1i": "USB-C / 3.5mm / Bluetooth 5.0", "K\\u00edch th\\u01b0\\u1edbc": "Desktop 2.0"}	4
050a51e3-3a04-443d-a71c-c8cbc06269d7	Màn hình ASUS ProArt PA148CTV 14 inch FHD Touch (Cảm ứng)	man-hinh-asus-proart-pa148ctv-14-inch-fhd-touch-cam-ung	Màn hình ASUS ProArt PA148CTV 14 inch FHD Touch (Cảm ứng) - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"K\\u00edch th\\u01b0\\u1edbc": "14 inch Portable", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "FHD (1920x1080)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "60Hz", "T\\u1ea5m n\\u1ec1n": "IPS Touch", "Nhu c\\u1ea7u": "C\\u1ea3m \\u1ee9ng di \\u0111\\u1ed9ng"}	1
06468595-c453-4871-98c2-d72e4fd870b1	Webcam Logitech C270 HD 720p	webcam-logitech-c270-hd-720p	Webcam Logitech C270 HD 720p - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	17b32335-4570-41fd-9070-726482b5ef7c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "720p 30fps", "K\\u1ebft n\\u1ed1i": "USB-A", "Microphone": "Mono Mic", "T\\u00ednh n\\u0103ng": "Fixed focus, clip mount"}	1
0be06c1b-b815-4277-b0d5-21da1029f30d	USB Samsung Bar Plus 256GB USB 3.1 400MB/s	usb-samsung-bar-plus-256gb-usb-31-400mbs	USB Samsung Bar Plus 256GB USB 3.1 400MB/s - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	e1ab13a9-ec24-4d8a-84d2-25faca94e509	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"Dung l\\u01b0\\u1ee3ng": "256GB", "Chu\\u1ea9n k\\u1ebft n\\u1ed1i": "USB 3.1 Gen 1", "T\\u1ed1c \\u0111\\u1ed9 \\u0111\\u1ecdc": "400 MB/s", "Ch\\u1ea5t li\\u1ec7u": "Kim lo\\u1ea1i ch\\u1ed1ng n\\u01b0\\u1edbc"}	2
50d202d0-5918-4314-9035-1b7c4ca02264	Case NZXT H5 Flow RGB Matte White	case-nzxt-h5-flow-rgb-matte-white	Case NZXT H5 Flow RGB Matte White - Sản phẩm chính hãng NZXT, bảo hành tại EZ4GEAR.	00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b08bb8ef-402c-44e1-beb9-65f279d3b61b	{"K\\u00edch th\\u01b0\\u1edbc": "Mid Tower ATX", "Ch\\u1ea5t li\\u1ec7u": "Th\\u00e9p + K\\u00ednh c\\u01b0\\u1eddng l\\u1ef1c", "Fan": "2x 120mm RGB", "M\\u00e0u s\\u1eafc": "Tr\\u1eafng"}	1
52818677-11a3-4c2b-b70d-36608cc1741f	Nguồn Corsair CV550 550W 80 Plus Bronze	nguon-corsair-cv550-550w-80-plus-bronze	Nguồn Corsair CV550 550W 80 Plus Bronze - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	342ca7e2-6ad3-4c6e-82c3-50baac105e49	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"C\\u00f4ng su\\u1ea5t": "550W", "Chu\\u1ea9n": "80 Plus Bronze", "K\\u00edch th\\u01b0\\u1edbc": "ATX", "Modular": "Non-Modular"}	3
5725c5d1-2dab-446f-a6b8-4fcaf2acf3c0	Màn hình LG 3000Hz	man-hinh-lg-3000hz	ngon	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-25 14:08:02.530365+07	2026-06-26 15:22:16.288271+07	c3e84be6-e1ab-429f-9de3-3ebeb04da941	{"K\\u00edch th\\u01b0\\u1edbc": "12", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "12", "\\u0110\\u1ed9 s\\u00e1ng": "12", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "12", "T\\u1ea5m n\\u1ec1n": "12", "C\\u1ed5ng k\\u1ebft n\\u1ed1i": "12"}	1
5c38ff7a-aefc-4f61-ab64-a48c62bb51f3	VGA MSI GeForce RTX 4080 Super VENTUS 3X OC 16G	vga-msi-geforce-rtx-4080-super-ventus-3x-oc-16g	VGA MSI GeForce RTX 4080 Super VENTUS 3X OC 16G - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"Chipset / GPU": "NVIDIA GeForce RTX 4080 Super", "B\\u1ed9 nh\\u1edb": "16GB GDDR6X", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 3x DP 1.4a", "TDP": "320W"}	2
6190cef1-b5b5-444c-8e1f-796604aaca68	Chuột Zowie EC2-CW Wireless (Esports)	chuot-zowie-ec2-cw-wireless-esports	Chuột Zowie EC2-CW Wireless (Esports) - Sản phẩm chính hãng Zowie, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b61c738a-b956-4deb-be14-957fed2c2673	{"M\\u1eaft \\u0111\\u1ecdc": "Zowie 3395 (3200 DPI)", "DPI": "3200", "K\\u1ebft n\\u1ed1i": "2.4GHz Wireless / USB-C", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "77g", "Switch": "Huano", "Pin": "70 gi\\u1edd"}	2
6f5e6986-1e0f-446c-8082-c66ffb3e8fe5	Máy chơi game Sony PlayStation 5 Slim (PS5 Slim)	may-choi-game-sony-playstation-5-slim-ps5-slim	Máy chơi game Sony PlayStation 5 Slim (PS5 Slim) - Sản phẩm chính hãng Sony, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d2a21452-a924-435f-9645-9746ba819325	{"CPU": "AMD Zen 2 Custom 8-Core", "GPU": "AMD RDNA 2 Custom 10.28 TFLOPS", "Dung l\\u01b0\\u1ee3ng": "1TB SSD", "\\u0110\\u0129a": "C\\u00f3 \\u1ed5 \\u0111\\u0129a Blu-ray"}	2
81518aa3-6c3f-46db-97fb-2cf3bd8de875	Tản nhiệt nước NZXT Kraken 280 RGB Black	tan-nhiet-nuoc-nzxt-kraken-280-rgb-black	Tản nhiệt nước NZXT Kraken 280 RGB Black - Sản phẩm chính hãng NZXT, bảo hành tại EZ4GEAR.	ad72da4f-d9f0-46d0-bed7-35781dd859f9	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	b08bb8ef-402c-44e1-beb9-65f279d3b61b	{"Ki\\u1ec3u": "AIO Liquid Cooler", "K\\u00edch th\\u01b0\\u1edbc Radiator": "280mm", "Fan": "2x 140mm RGB", "Socket": "Intel LGA 1700/AM5"}	2
845c9009-b37d-4c46-b372-e3c80c9c3db2	Chuột Pulsar X2H Medium Wireless	chuot-pulsar-x2h-medium-wireless	Chuột Pulsar X2H Medium Wireless - Sản phẩm chính hãng Pulsar, bảo hành tại EZ4GEAR.	37d6ca80-0f3d-4ac9-8855-3ebe7802e142	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0e1acd24-767e-497e-8245-6d6e210bace2	{"M\\u1eaft \\u0111\\u1ecdc": "PAW3395 (26000 DPI)", "DPI": "26000", "K\\u1ebft n\\u1ed1i": "2.4GHz / USB-C", "Tr\\u1ecdng l\\u01b0\\u1ee3ng": "56g", "Switch": "Kailh GM 8.0", "Pin": "100 gi\\u1edd"}	2
885f98d3-a9bd-4c40-bff8-ffbadd513f4c	Bàn phím cơ Corsair K70 MAX RGB	ban-phim-co-corsair-k70-max-rgb	Bàn phím cơ Corsair K70 MAX RGB - Sản phẩm chính hãng Corsair, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7a508659-0944-40ea-8cb7-bf5d76c797bc	{"Lo\\u1ea1i Switch": "Corsair MGX (Magnetic Hall Effect)", "K\\u1ebft n\\u1ed1i": "USB-C c\\u00f3 d\\u00e2y", "K\\u00edch th\\u01b0\\u1edbc": "Fullsize (104 ph\\u00edm)", "Keycap": "PBT Double-shot", "LED": "RGB"}	2
8a543566-04c3-4f9d-ad33-5fd9dbafc31d	Dịch vụ Vệ sinh PC / Laptop tại cửa hàng	dich-vu-ve-sinh-pc-laptop-tai-cua-hang	Dịch vụ Vệ sinh PC / Laptop tại cửa hàng - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	b884bf3c-f5b7-48b8-985e-95cb6043779c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"Bao g\\u1ed3m": "V\\u1ec7 sinh b\\u1ee5i, thay keo t\\u1ea3n nhi\\u1ec7t, ki\\u1ec3m tra ph\\u1ea7n c\\u1ee9ng", "Th\\u1eddi gian": "30-45 ph\\u00fat", "B\\u1ea3o h\\u00e0nh": "Ki\\u1ec3m tra mi\\u1ec5n ph\\u00ed sau 1 tu\\u1ea7n"}	1
8fdf2af3-f915-4b74-8380-6429cce20cfa	Router Wifi 6 ASUS RT-AX86U Pro	router-wifi-6-asus-rt-ax86u-pro	Router Wifi 6 ASUS RT-AX86U Pro - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	abcaa950-a125-4727-b161-f2704ddbb2f0	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"Chu\\u1ea9n Wifi": "WiFi 6 (802.11ax)", "T\\u1ed1c \\u0111\\u1ed9": "AX5700 (5700 Mbps)", "S\\u1ed1 anten": "3 anten ngo\\u00e0i", "C\\u1ed5ng LAN": "1x 2.5G + 4x Gigabit"}	2
937791f1-7e3b-4241-bc06-f57f4fe25e5a	Loa Edifier M3280BT Bluetooth 2.1	loa-edifier-m3280bt-bluetooth-21	Loa Edifier M3280BT Bluetooth 2.1 - Sản phẩm chính hãng Edifier, bảo hành tại EZ4GEAR.	f9d29f85-1c8d-4439-b277-82fabd5f03ba	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	7c1ec210-f9e0-4c3e-af7a-3d87b024c65c	{"C\\u00f4ng su\\u1ea5t": "36W (18W Sub + 9W x 2)", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.1 / 3.5mm / USB", "K\\u00edch th\\u01b0\\u1edbc": "2.1 (Subwoofer + 2 v\\u1ec7 tinh)"}	2
95a4a8e0-1851-461f-a567-5ccb6216e805	PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super	pc-ez4ence-rgb-showcase-intel-i7-14700kf-rtx-4070-super	PC EZ4ENCE RGB Showcase - Intel i7 14700KF / RTX 4070 Super - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i7-14700KF", "ram": "32GB DDR5 6000MHz RGB", "vga": "NVIDIA RTX 4070 Super 12GB", "storage": "SSD NVMe 1TB", "mainboard": "Z790 AORUS Elite AX", "psu": "850W 80+ Gold", "case": "Lian Li O11 Dynamic EVO RGB", "T\\u1ea3n nhi\\u1ec7t": "AIO 360mm LCD RGB"}	2
9be4ee89-47a0-4376-ac32-997a7e859e4c	VGA ASUS Dual GeForce RTX 4060 Ti OC 8GB	vga-asus-dual-geforce-rtx-4060-ti-oc-8gb	VGA ASUS Dual GeForce RTX 4060 Ti OC 8GB - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"Chipset / GPU": "NVIDIA GeForce RTX 4060 Ti", "B\\u1ed9 nh\\u1edb": "8GB GDDR6", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 3x DP 1.4a", "TDP": "160W"}	1
a7927cc6-5d6f-4374-9b27-816b3e81f15c	Lót chuột Razer Firefly V2 Pro RGB	lot-chuot-razer-firefly-v2-pro-rgb	Lót chuột Razer Firefly V2 Pro RGB - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"K\\u00edch th\\u01b0\\u1edbc": "370 x 280 x 4mm (Size nh\\u1ecf)", "Ch\\u1ea5t li\\u1ec7u": "Hard Surface + RGB", "B\\u1ec1 m\\u1eb7t": "Speed", "LED": "Razer Chroma RGB 15 zone"}	2
a98effb9-182e-4466-b8d3-1f471b02c55b	Lót chuột SteelSeries QcK Prism Cloth XL RGB	lot-chuot-steelseries-qck-prism-cloth-xl-rgb	Lót chuột SteelSeries QcK Prism Cloth XL RGB - Sản phẩm chính hãng SteelSeries, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	31bffa70-e26f-4965-941b-cb4b3021502b	{"K\\u00edch th\\u01b0\\u1edbc": "900 x 300 x 4mm (Deskmat)", "Ch\\u1ea5t li\\u1ec7u": "Micro-woven Cloth + RGB", "B\\u1ec1 m\\u1eb7t": "Control", "LED": "2-zone RGB"}	2
ae9ba3e7-0af5-423f-a463-a8c2db440a5a	Tay cầm Logitech F310 Gamepad (PC)	tay-cam-logitech-f310-gamepad-pc	Tay cầm Logitech F310 Gamepad (PC) - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"K\\u1ebft n\\u1ed1i": "USB c\\u00f3 d\\u00e2y", "T\\u01b0\\u01a1ng th\\u00edch": "PC / Android TV", "Layout": "Dual Analog + D-Pad"}	2
afedfef3-6135-4397-88fa-a47320bbe2bf	PC EZ4ENCE Mini ITX - Intel i5 14400F / RTX 4060	pc-ez4ence-mini-itx-intel-i5-14400f-rtx-4060	PC EZ4ENCE Mini ITX - Intel i5 14400F / RTX 4060 - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "Intel Core i5-14400F", "ram": "16GB DDR5 5600MHz", "vga": "NVIDIA GeForce RTX 4060 8GB", "storage": "SSD NVMe 1TB", "mainboard": "B760I Mini-ITX", "psu": "600W SFX 80+ Gold", "case": "Cooler Master NR200P"}	3
b65c484c-8f68-4c1f-8d2a-4ec92112d078	Bàn phím cơ Razer Huntsman V3 Pro TKL	ban-phim-co-razer-huntsman-v3-pro-tkl	Bàn phím cơ Razer Huntsman V3 Pro TKL - Sản phẩm chính hãng Razer, bảo hành tại EZ4GEAR.	05ced308-c726-4003-820d-c8359e025afc	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	ae145fd2-c6e9-4841-88e3-03bac25c3b56	{"Lo\\u1ea1i Switch": "Razer Analog Optical (Adjustable)", "K\\u1ebft n\\u1ed1i": "USB-C c\\u00f3 d\\u00e2y", "K\\u00edch th\\u01b0\\u1edbc": "TKL (87 ph\\u00edm)", "Keycap": "PBT Doubleshot", "LED": "Razer Chroma RGB"}	2
b7145b34-a32d-4306-93ae-7553ace984ce	ASUS ROG Ally X Handheld Gaming	asus-rog-ally-x-handheld-gaming	ASUS ROG Ally X Handheld Gaming - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"CPU": "AMD Ryzen Z1 Extreme", "RAM": "24GB LPDDR5X", "Dung l\\u01b0\\u1ee3ng": "1TB SSD", "M\\u00e0n h\\u00ecnh": "7 inch FHD 120Hz"}	1
ba2ad1d2-468f-46ed-8ec1-2a378223d2f3	Tai nghe Logitech G PRO X 2 LIGHTSPEED (Over-ear Gaming)	tai-nghe-logitech-g-pro-x-2-lightspeed-over-ear-gaming	Tai nghe Logitech G PRO X 2 LIGHTSPEED (Over-ear Gaming) - Sản phẩm chính hãng Logitech, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	5da698cc-6b22-4eff-9493-e619bdbd387a	{"Ki\\u1ec3u d\\u00e1ng": "Over-ear", "K\\u1ebft n\\u1ed1i": "LIGHTSPEED / Bluetooth / 3.5mm", "Microphone": "Blue VO!CE", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 20kHz", "Pin": "50 gi\\u1edd"}	4
bc639769-6888-4202-a7a8-b03453a32b7b	CPU Intel Core i7-14700K	cpu-intel-core-i7-14700k	CPU Intel Core i7-14700K - Sản phẩm chính hãng Intel, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	24e65b24-31af-4915-882c-e8116fb33c99	{"Socket": "LGA 1700", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "20 nh\\u00e2n 28 lu\\u1ed3ng", "Xung nh\\u1ecbp": "3.4GHz - 5.6GHz", "Cache": "33MB", "TDP": "125W"}	2
bd7ee9ba-19e1-42eb-ba3d-2a418db77f99	Laptop Gaming HP OMEN 16-wd0013TX	laptop-gaming-hp-omen-16-wd0013tx	Laptop Gaming HP OMEN 16-wd0013TX - Sản phẩm chính hãng HP, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	48de0310-95de-4e8f-b185-ecd3f1334799	{"cpu": "Intel Core i7-14700HX", "ram": "16GB DDR5", "storage": "SSD 1TB", "vga": "NVIDIA RTX 4060 8GB", "M\\u00e0n h\\u00ecnh": "16 inch 2K IPS 165Hz"}	2
bda8872c-1bb8-40e6-a268-6d08e19497a0	Đĩa Game PS5 - God of War Ragnarok	ia-game-ps5-god-of-war-ragnarok	Đĩa Game PS5 - God of War Ragnarok - Sản phẩm chính hãng Sony, bảo hành tại EZ4GEAR.	07a19984-1dfe-4131-8728-e73aab80213e	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d2a21452-a924-435f-9645-9746ba819325	{"N\\u1ec1n t\\u1ea3ng": "PlayStation 5", "Th\\u1ec3 lo\\u1ea1i": "Action-Adventure", "Nh\\u00e0 ph\\u00e1t h\\u00e0nh": "Santa Monica Studio / Sony", "Ng\\u00f4n ng\\u1eef": "Ph\\u1ee5 \\u0111\\u1ec1 Ti\\u1ebfng Vi\\u1ec7t"}	3
be625c9c-e0a4-4147-8bba-70d5b83fce7b	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB	vga-sapphire-nitro-amd-radeon-rx-7800-xt-16gb	VGA Sapphire NITRO+ AMD Radeon RX 7800 XT 16GB - Sản phẩm chính hãng Sapphire, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	e9ad9c15-3f10-4677-8959-24476a51a013	{"Chipset / GPU": "AMD Radeon RX 7800 XT", "B\\u1ed9 nh\\u1edb": "16GB GDDR6", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 2x DP 2.1", "TDP": "263W"}	3
c29324b9-2947-46f5-9719-6128552d5ed4	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB	vga-sapphire-pulse-amd-radeon-rx-7900-gre-16gb	VGA Sapphire PULSE AMD Radeon RX 7900 GRE 16GB - Sản phẩm chính hãng Sapphire, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	e9ad9c15-3f10-4677-8959-24476a51a013	{"Chipset / GPU": "AMD Radeon RX 7900 GRE", "B\\u1ed9 nh\\u1edb": "16GB GDDR6", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 2x DP 2.1", "TDP": "260W"}	3
cba63ba3-b910-4dfb-a5e2-fd69932a9dea	VGA ASUS TUF Gaming GeForce RTX 4070 Super OC 12GB	vga-asus-tuf-gaming-geforce-rtx-4070-super-oc-12gb	VGA ASUS TUF Gaming GeForce RTX 4070 Super OC 12GB - Sản phẩm chính hãng ASUS, bảo hành tại EZ4GEAR.	d08aa7ba-fabc-43f4-9484-141d4f2628db	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0eacc349-0eb7-44be-a970-310b68cbe645	{"Chipset / GPU": "NVIDIA GeForce RTX 4070 Super", "B\\u1ed9 nh\\u1edb": "12GB GDDR6X", "C\\u1ed5ng xu\\u1ea5t h\\u00ecnh": "HDMI 2.1, 3x DP 1.4a", "TDP": "220W"}	2
cca9603a-511c-42b6-aa58-80950c67cf81	Laptop Gaming MSI Thin GF63 12UC	laptop-gaming-msi-thin-gf63-12uc	Laptop Gaming MSI Thin GF63 12UC - Sản phẩm chính hãng MSI, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	c63a919f-5938-460c-9b8b-e90cd66b1291	{"cpu": "Intel Core i5-12450H", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 144Hz"}	1
ccbf3cdb-c33f-4369-ba0b-53f29756fe36	Laptop Gaming HP Victus 15-fa1093TX	laptop-gaming-hp-victus-15-fa1093tx	Laptop Gaming HP Victus 15-fa1093TX - Sản phẩm chính hãng HP, bảo hành tại EZ4GEAR.	9ae4a892-6898-469f-9596-969e024ecad3	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	48de0310-95de-4e8f-b185-ecd3f1334799	{"cpu": "Intel Core i5-12450H", "ram": "8GB DDR4", "storage": "SSD 512GB", "vga": "NVIDIA RTX 4050 6GB", "M\\u00e0n h\\u00ecnh": "15.6 inch FHD 144Hz"}	3
ce138998-e674-46bc-8195-e9fe600ae5e3	CPU Intel Core i5-14600KF	cpu-intel-core-i5-14600kf	CPU Intel Core i5-14600KF - Sản phẩm chính hãng Intel, bảo hành tại EZ4GEAR.	64d6f455-8867-43d3-976b-98094d8f16d6	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	24e65b24-31af-4915-882c-e8116fb33c99	{"Socket": "LGA 1700", "S\\u1ed1 nh\\u00e2n/lu\\u1ed3ng": "14 nh\\u00e2n 20 lu\\u1ed3ng", "Xung nh\\u1ecbp": "3.5GHz - 5.3GHz", "Cache": "24MB", "TDP": "125W"}	4
ce7c1b83-b3f5-4f80-a9da-d19aa6b7e82b	Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack)	bo-phat-wifi-mesh-tp-link-deco-x55-3-pack	Bộ phát Wifi Mesh TP-Link Deco X55 (3 Pack) - Sản phẩm chính hãng TP-Link, bảo hành tại EZ4GEAR.	abcaa950-a125-4727-b161-f2704ddbb2f0	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	70c10e0d-a92b-40b2-b673-0bf6caec432d	{"Chu\\u1ea9n Wifi": "WiFi 6 (802.11ax)", "T\\u1ed1c \\u0111\\u1ed9": "AX3000 (3000 Mbps)", "Ph\\u1ee7 s\\u00f3ng": "600m\\u00b2 (3 thi\\u1ebft b\\u1ecb)", "C\\u1ed5ng LAN": "3x Gigabit m\\u1ed7i unit"}	2
db59063b-8f08-4126-bee0-9e40204289c1	Tai nghe Sony WF-1000XM5 True Wireless (In-ear)	tai-nghe-sony-wf-1000xm5-true-wireless-in-ear	Tai nghe Sony WF-1000XM5 True Wireless (In-ear) - Sản phẩm chính hãng Sony, bảo hành tại EZ4GEAR.	c1923d9a-740e-4808-aa7e-87fd429e990a	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d2a21452-a924-435f-9645-9746ba819325	{"Ki\\u1ec3u d\\u00e1ng": "In-ear True Wireless", "K\\u1ebft n\\u1ed1i": "Bluetooth 5.3 / LDAC", "Microphone": "6 mic ANC", "T\\u1ea7n s\\u1ed1 \\u0111\\u00e1p \\u1ee9ng": "20Hz - 40kHz", "Pin": "8 gi\\u1edd (24 gi\\u1edd v\\u1edbi case)"}	6
e51e16e8-c20d-47e8-b0d6-6c50801315e5	Loa JBL Quantum Duo Gaming 2.0 RGB	loa-jbl-quantum-duo-gaming-20-rgb	Loa JBL Quantum Duo Gaming 2.0 RGB - Sản phẩm chính hãng JBL, bảo hành tại EZ4GEAR.	f9d29f85-1c8d-4439-b277-82fabd5f03ba	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	82584494-0c52-4369-8ccd-a613e77a7282	{"C\\u00f4ng su\\u1ea5t": "20W (10W x 2)", "K\\u1ebft n\\u1ed1i": "USB / Bluetooth 5.0 / 3.5mm", "K\\u00edch th\\u01b0\\u1edbc": "Desktop 2.0", "LED": "RGB JBL QuantumSOUND"}	3
edc0f56c-85f6-4dc2-8b28-90a549ab8aaf	Lót chuột Pulsar Superglide Glass XL (Kính)	lot-chuot-pulsar-superglide-glass-xl-kinh	Lót chuột Pulsar Superglide Glass XL (Kính) - Sản phẩm chính hãng Pulsar, bảo hành tại EZ4GEAR.	a786829f-bbe9-4999-ba60-8109dce5ad19	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	0e1acd24-767e-497e-8245-6d6e210bace2	{"K\\u00edch th\\u01b0\\u1edbc": "490 x 420 x 3mm", "Ch\\u1ea5t li\\u1ec7u": "K\\u00ednh tempered", "B\\u1ec1 m\\u1eb7t": "Speed (c\\u1ef1c tr\\u01a1n)"}	1
f8144d18-27e0-46f2-90e6-397cb695f17a	Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm	dich-vu-bao-hanh-mo-rong-ez4gear-premium-2-nam	Dịch vụ Bảo hành mở rộng EZ4GEAR Premium 2 năm - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	b884bf3c-f5b7-48b8-985e-95cb6043779c	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"Th\\u1eddi h\\u1ea1n": "2 n\\u0103m (c\\u1ed9ng th\\u00eam)", "Ph\\u1ea1m vi": "L\\u1ed7i ph\\u1ea7n c\\u1ee9ng, h\\u1ed7 tr\\u1ee3 k\\u1ef9 thu\\u1eadt", "\\u01afu \\u0111\\u00e3i": "1 \\u0111\\u1ed5i 1 trong 30 ng\\u00e0y \\u0111\\u1ea7u"}	1
fe0f4c1b-6b4a-4261-b034-317664596603	Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming)	man-hinh-samsung-s24d332-24-inch-fhd-144hz-va-gaming	Màn hình Samsung S24D332 24 inch FHD 144Hz VA (Gaming) - Sản phẩm chính hãng Samsung, bảo hành tại EZ4GEAR.	5d452037-725f-43c6-bbb9-72ceae06bab1	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	d09748d1-9c9d-4f1b-b8ff-b867fb402d25	{"K\\u00edch th\\u01b0\\u1edbc": "24 inch", "\\u0110\\u1ed9 ph\\u00e2n gi\\u1ea3i": "FHD (1920x1080)", "T\\u1ea7n s\\u1ed1 qu\\u00e9t": "144Hz", "T\\u1ea5m n\\u1ec1n": "VA", "Nhu c\\u1ea7u": "Gaming gi\\u00e1 r\\u1ebb"}	3
ffedbefe-4189-46cf-ad79-e0de62b77216	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti	pc-ez4ence-gaming-pro-amd-ryzen-7-7700x-rtx-4070-ti	PC EZ4ENCE Gaming Pro - AMD Ryzen 7 7700X / RTX 4070 Ti - Sản phẩm chính hãng EZ4GEAR, bảo hành tại EZ4GEAR.	80145f50-5772-4aef-b398-3882bc8c04fb	t	2026-06-16 23:15:40.700908+07	2026-06-26 15:22:16.288271+07	6ab7f06c-973f-473e-b235-9444d921b1de	{"cpu": "AMD Ryzen 7 7700X", "ram": "32GB DDR5 6000MHz", "vga": "NVIDIA GeForce RTX 4070 Ti Super 16GB", "storage": "SSD NVMe 1TB", "mainboard": "B650 AORUS Elite AX", "psu": "850W 80+ Gold", "case": "NZXT H9 Flow"}	4
\.


--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotions (id, code, discount_percent, discount_amount, min_order_value, expiration_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_images (id, review_id, url, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, rating, comment, created_at, updated_at, sku_id, admin_reply, is_hidden) FROM stdin;
2145c398-90f2-4f08-8d75-d98837fcb5f3	93556805-fdab-45e1-9be6-e47684eec120	5	Sẽ ủng hộ shop tiếp	2026-05-11 15:12:24.87635+07	2026-06-26 15:12:25.022817+07	e1629871-a173-4938-894a-42c789655ed3	\N	f
556c8efc-ca62-47bc-bc52-c27d31f8004a	93556805-fdab-45e1-9be6-e47684eec120	5	Rất đáng tiền	2026-05-10 15:12:24.87635+07	2026-06-26 15:12:25.022817+07	35870f40-a432-47a1-a171-29d5d4ad0d6f	\N	f
8a7de5d1-a008-4c4c-9885-267faab0cd94	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	4	Sản phẩm ổn trong tầm giá	2026-04-24 15:12:24.88338+07	2026-06-26 15:12:25.022817+07	c0e9407b-12c2-4d6c-a2f2-663ec066e280	\N	f
6c41064a-6aa4-4c7c-983d-f838228f09f3	cc19e280-d5c7-4616-a117-ca29341ea383	5	Chất lượng vượt xa mong đợi	2026-04-25 15:12:24.892809+07	2026-06-26 15:12:25.022817+07	d08e39ed-6dd1-4cc1-993d-c917a7c75919	\N	f
8b283005-ce36-4035-9d4a-96db3ba9c128	cc19e280-d5c7-4616-a117-ca29341ea383	5	Sẽ ủng hộ shop tiếp	2026-04-25 15:12:24.892809+07	2026-06-26 15:12:25.022817+07	3f2f4541-6cc8-4666-b7a8-26a6a5a221e6	\N	f
3bb9ae11-2488-4269-ba81-154fef379293	626b7614-6d6e-4c9b-a10f-7fd2b837422f	4	Dùng ok	2026-07-01 15:12:24.896215+07	2026-06-26 15:12:25.022817+07	e091fd8f-cddc-4c18-9b7c-39c9f32a690d	\N	f
fd1ca9ff-c2a4-42c3-b848-5af6bbaacd9a	626b7614-6d6e-4c9b-a10f-7fd2b837422f	4	Khá tốt	2026-06-28 15:12:24.896215+07	2026-06-26 15:12:25.022817+07	20b719c9-41aa-4703-afc2-2043ca2007d7	\N	f
8e68a55d-5cdf-45bd-bd31-20b5e6c2dca8	626b7614-6d6e-4c9b-a10f-7fd2b837422f	4	Dùng ok	2026-07-01 15:12:24.896215+07	2026-06-26 15:12:25.022817+07	2775e177-4e08-4f64-84a5-21bf23cda1e0	\N	f
37fee7d5-5559-459f-aaac-90875f8f713d	93556805-fdab-45e1-9be6-e47684eec120	5	Rất đáng tiền	2026-06-24 15:12:24.91341+07	2026-06-26 15:12:25.022817+07	d6868dd1-aeae-40c3-9abf-6e0ed896def7	\N	f
6ae67997-3621-479b-a9cb-78adc6c1b146	292ae0da-38e8-4f6b-ab48-f6e33069a3ce	5	Chất lượng vượt xa mong đợi	2026-06-15 15:12:24.931891+07	2026-06-26 15:12:25.022817+07	b01bc8c5-3a1e-4488-8f48-7498343c8aa7	\N	f
97dd100d-2b01-4515-bc4d-e69ce2023bae	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	5	Sẽ ủng hộ shop tiếp	2026-06-17 15:12:24.941194+07	2026-06-26 15:12:25.022817+07	2c87a908-53a2-4da4-825b-1f9eea37ddb4	\N	f
d292b37b-f063-44d8-9c17-216d7a39efa0	ddafc344-31b0-4688-b1a3-80b12e0cdbf8	5	Rất đáng tiền	2026-06-15 15:12:24.941194+07	2026-06-26 15:12:25.022817+07	72be7bef-4187-4fa2-a822-9168d58b11a2	\N	f
351f261b-6bee-467f-b23f-38876eebdcb9	1b94e300-e05d-411e-a90a-49e4dbe9470e	5	Sản phẩm tuyệt vời!	2026-05-11 15:12:24.95921+07	2026-06-26 15:12:25.022817+07	f1700d30-2877-49cf-ad67-5b402a3f1a57	\N	f
c02db0b5-a524-4e8a-8c8c-9ca15704a28a	7d04da9b-ef68-4f38-af0c-46300b51de79	5	Sản phẩm tuyệt vời!	2026-06-30 15:12:25.003217+07	2026-06-26 15:12:25.022817+07	298e1407-dd9b-4ca5-9050-a838ab8f82de	\N	f
2e761a73-c0d4-472c-820b-701d89f32585	7d04da9b-ef68-4f38-af0c-46300b51de79	3	Tạm được	2026-06-28 15:12:25.003217+07	2026-06-26 15:12:25.022817+07	be4e84a0-827c-4423-b422-66e7f0666055	\N	f
038a75e1-f12d-4b0b-ba68-5d7d4118a0db	7d04da9b-ef68-4f38-af0c-46300b51de79	5	Chất lượng vượt xa mong đợi	2026-06-29 15:12:25.003217+07	2026-06-26 15:12:25.022817+07	a71aa1f8-4e6d-456a-ad5b-8ba805c22e0a	\N	f
f59ecae2-f92d-4479-b38e-315589677825	79a1ee4a-f0b3-4555-b652-943bfd259924	4	Giao hàng hơi chậm nhưng hàng đẹp	2026-05-29 15:12:25.007027+07	2026-06-26 15:12:25.022817+07	47ab71e4-e7ac-4b80-ac32-de8a8348fb6e	\N	f
c906176e-a106-4cb6-9abc-2568d665587e	79a1ee4a-f0b3-4555-b652-943bfd259924	5	Rất đáng tiền	2026-05-26 15:12:25.007027+07	2026-06-26 15:12:25.022817+07	5331de62-a369-4a75-bb11-ca7ea2b4f754	\N	f
1788c962-f3b0-4448-9de3-6fe68d556d2a	03d7ce37-b04c-44ee-be56-0c284d235a81	5	Sản phẩm rất tốt, shop tư vấn nhiệt tình, giao hàng cực nhanh!	2026-06-23 18:52:57.132529+07	2026-06-23 18:53:57.191673+07	b376e183-80ba-465a-a979-2f21ed2db366	Cảm ơn bạn đã tin tưởng và ủng hộ EZ4ENCE. Chúc bạn một ngày tốt lành!	f
a1eb4ee7-1478-4635-a87c-10c443d368ca	03d7ce37-b04c-44ee-be56-0c284d235a81	4	Đóng gói cẩn thận, sản phẩm dùng khá ổn định nhưng cần thời gian xem xét thêm độ bền.	2026-06-23 18:52:57.132529+07	2026-06-23 18:53:57.897329+07	b376e183-80ba-465a-a979-2f21ed2db366	\N	f
7a11c314-cf28-478d-bd91-bff2f9934181	03d7ce37-b04c-44ee-be56-0c284d235a81	2	Hàng giao bị móp hộp nhẹ, tuy sản phẩm bên trong không sao nhưng trải nghiệm không được tốt.	2026-06-23 18:52:57.132529+07	2026-06-23 18:54:22.235667+07	b376e183-80ba-465a-a979-2f21ed2db366	méo cmm 	f
\.


--
-- Data for Name: sku_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sku_images (id, sku_id, url, alt_text, is_primary) FROM stdin;
\.


--
-- Data for Name: stock_receipt_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_receipt_items (id, receipt_id, sku_id, quantity, unit_price, total_price) FROM stdin;
\.


--
-- Data for Name: stock_receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_receipts (id, receipt_code, type, supplier_id, total_amount, note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, name, contact_name, phone, email, address, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, full_name, phone, avatar, role, is_active, created_at, updated_at, staff_role, username, is_email_verified, provider) FROM stdin;
03d7ce37-b04c-44ee-be56-0c284d235a81	khachhang4@gmail.com	$2b$12$hxC/Cpal.eD9pDDmRNRg8uiJWwLUnk5QdljMPl5G.eu90vHIcCcX2	Khách Hàng 4	0942783804	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang4	f	LOCAL
0d6d139c-d612-4840-8aa0-c8cb00647d7f	admin@ez4ence.com	$2b$12$GBhpUOiHdXAcNcRdkGm0bu5nCNY9oKNrY0IWcBEQAbZmiNMlS3ulm	Administrator	\N	\N	ADMIN	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	admin	f	LOCAL
0d74d79b-4349-4693-b12f-c2968f25fc8d	khachhang9@gmail.com	$2b$12$N0Q42pkCJuCjku4T9./mSOVS.OPrutnlpz4HUTzMXieKQJGV.BrPK	Khách Hàng 9	0924521990	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang9	f	LOCAL
11877e70-287b-4620-a6d6-f54d88746c0d	customer10@gmail.com	$2b$12$ywZK0fyUuesUjfO06aIVzeQx1f9YK68yPZFGLg34WdbGFpgLb2iWW	Khách Hàng 10	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer10	f	LOCAL
154be4a1-0712-4b7c-b589-3a4817cdb9d2	khachhang1@gmail.com	$2b$12$Vtng756.r.uUuiw9njj0Sek4TwxMk9.6h8ENvNE6Os.PIs6kJ4ARC	Khách Hàng 1	0912650696	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang1	f	LOCAL
16d142c4-354d-4a5d-a2ec-e0b78227dade	user2@ez4ence.com	$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C	Nguyễn Văn A	\N	\N	USER	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	user2	f	LOCAL
1d497180-1ac7-4e30-ac44-1ae156ca796d	duoduo@gmail.com	$2b$12$a/QjY5WEU.XsPNLXl2tpDOkIWnMvbuTIoOy4g6oEC8GtAtu/wE9xC	ffff	\N	\N	USER	t	2026-06-15 21:25:37.687136+07	2026-06-17 21:42:49.224919+07	\N	duoduo	f	LOCAL
22936cf5-52f2-417f-9627-0ef93c27a141	customer6@gmail.com	$2b$12$VNf.MYKkU8k0DLFnkG.uwekYeH9Se74t.3CTTmasl9bA44rVsbIeC	Khách Hàng 6	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer6	f	LOCAL
23b285fc-4f89-4941-bbaf-507e3cb87129	khachhang20@gmail.com	$2b$12$/EFE3eTCVXgtJEWBfXRvfeu9fQYgOPjtOMLf77c0KSzgv4kq12xGm	Khách Hàng 20	0967729537	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang20	f	LOCAL
2733b877-2d66-45d4-9ff5-472b363313d9	customer7@gmail.com	$2b$12$eTMu/q/LNV7YHIwGI51bJeQjB3iUYs0UEezW6SDQFwHzEnWUOIJ16	Khách Hàng 7	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer7	f	LOCAL
2efaf5ae-bc3b-47bc-90b9-632f3f6064da	customer1@gmail.com	$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW	Nguyễn Văn A	0912345678	\N	USER	t	2026-06-15 21:16:32.439937+07	2026-06-17 21:42:49.224919+07	\N	customer1	f	LOCAL
31889716-fa4b-4dc7-af82-659c527ef2f1	customer5@gmail.com	$2b$12$ubSCuhCiGFJL1U6o4a2EV.Ba6Vhec4gwMnUPpQcG4b0k59ziJZmnq	Khách Hàng 5	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer5	f	LOCAL
33721469-b1e5-49c8-b557-eaf6cad16c88	khachhang6@gmail.com	$2b$12$muxj8cZn8P9saz2mCT3p7ODticZ15HfMAcI1.pM8aUP1qInM9mOZ.	Khách Hàng 6	0976112166	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang6	f	LOCAL
33d8ec32-23b4-4d98-9667-9d5f55c1b273	phanluuminh473@gmail.com	$2b$12$2SUDXUnW0gT6zzfp24177.yNepjgE39/7D9qc9Mg9FLBXHyEePJuG	minh1	\N	\N	USER	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	phanluuminh473	f	LOCAL
362443ad-c157-4d84-ab37-18db4d43623e	customer9@gmail.com	$2b$12$eINstEIp89yEgXUJGmqH9ejGHwKjLgcRCYTAsGbGAjIVc054DkN5a	Khách Hàng 9	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer9	f	LOCAL
3ee7dd3b-c6d6-482f-9691-94d6d29019d6	khachhang15@gmail.com	$2b$12$ij7MRXRPsqaXd/E14gfBhOHF21uIwPKz3afSr7CoGPFu94tU3P74K	Khách Hàng 15	0969411278	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang15	f	LOCAL
3ff76a4e-5ce1-4101-b47b-3d67685979c2	phanleminh1@gmail.com	$2b$12$y514xFrfLVX9W7gT9qlAtOzdFa2cI7RoTFqpfPgEd.3/An4aLd6De	Phan Lê Minh (Super Admin)	\N	\N	ADMIN	t	2026-06-15 23:34:43.455088+07	2026-06-17 21:42:49.224919+07	\N	phanleminh1	f	LOCAL
42f1c24e-5b0b-4cb2-8c18-cce92319b708	khachhang17@gmail.com	$2b$12$Pm00Xtk/25ZmfTO4hjkFveP7OjALbhRUYwH3MT21fbNnwucT9ZrD6	Khách Hàng 17	0953820799	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang17	f	LOCAL
44e3fb18-124e-4107-a6a7-5f87440ca940	customer3@gmail.com	$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW	Lê Hoàng C	0901234567	\N	USER	t	2026-06-15 21:16:32.439937+07	2026-06-17 21:42:49.224919+07	\N	customer3	f	LOCAL
49053213-3c7f-4920-ae57-8020c45e461f	khachhang14@gmail.com	$2b$12$hI4tCZx42psf3cpGnv8WjujS.LoL5MczX142oNN6p7tEaGPb8hTN6	Khách Hàng 14	0929039772	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang14	f	LOCAL
662b1cd3-dbf4-4d88-acf9-fa0749b000d0	testemail1234@gmail.com	$2b$12$Ggke/Faol/amcMFUN6c0bemkBlXbl3IgUK9iO2EDQZUfj828veGTq	Test User	\N	\N	USER	t	2026-06-17 18:29:46.989126+07	2026-06-17 21:42:49.224919+07	\N	testemail1234	f	LOCAL
67df3dbf-027e-4bbc-8602-62cc4944ea21	khachhang5@gmail.com	$2b$12$RKjjL3Yl/.XnO7.0uyEHiu6KFBGTsFtdKEmFX.duR6tM7YXc.tg6y	Khách Hàng 5	0999878708	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang5	f	LOCAL
73e1fe51-bcc3-48c9-81f8-a619c357fc6c	customer8@gmail.com	$2b$12$0dFXP5Wx3KvLj0fZ.bBQDOZ.4njlODScZapTOZhfnm.m4La4X/Kx6	Khách Hàng 8	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer8	f	LOCAL
7476e4d1-6750-4d72-afe0-0b6891eacb56	khachhang10@gmail.com	$2b$12$Q9MK2s97KgYz7v/OmfPKtO6RikjLTjzUfuvqRy6xM5zBrd77VYon2	Khách Hàng 10	0988131480	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang10	f	LOCAL
76a3244d-33f7-4021-8f06-7287523f5537	khachhang2@gmail.com	$2b$12$FrfB/9dXjx8tc87F9akmU.cyNrj.J37CZ7QxvRGtcJx6Jv5SRI/MG	Khách Hàng 2	0934958149	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang2	f	LOCAL
7ce1a206-dd95-4d82-86dd-36373c7437ad	user1@ez4ence.com	$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C	Trần Minh Hiếu	\N	\N	USER	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	user1	f	LOCAL
838aada4-abdb-4205-8166-25c9332fb00c	khachhang11@gmail.com	$2b$12$.z.D48boZlbDZCSi3vgbSudf61t2dnapYtveet9/Ha5HIusyUz/Ii	Khách Hàng 11	0941713679	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang11	f	LOCAL
870b1d88-903a-44a4-adb4-d91c0b621405	leminhphan1@gmail.com	$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C	minh	\N	\N	USER	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	leminhphan1	f	LOCAL
8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6	khachhang8@gmail.com	$2b$12$YuGxmVlzbA49xgIWpxBAOuG6oOzMpnUv2g5m7gJXk25aPNTM3ImaG	Khách Hàng 8	0916759546	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang8	f	LOCAL
8e3a3275-b0b4-4c3d-9532-83c3e29926c7	khachhang13@gmail.com	$2b$12$X.hmp1KEoyeI1H0mdOToCu6FGPHM8GjjOhlVlWGA.WTDs/6rYrJUe	Khách Hàng 13	0962180503	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang13	f	LOCAL
916f3dc1-cfcf-4d52-98d2-f5b943ee2d87	khachhang16@gmail.com	$2b$12$YQ8IkfkCkZpS3q1SjHQ23.BarrjgiNC0bVhBtUdtalaFoi8BvalIG	Khách Hàng 16	0964847031	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang16	f	LOCAL
95db6332-45a2-4e92-8d69-ec0b5a2f15de	khachhang7@gmail.com	$2b$12$EBsPLD4KhHYryjJjqLU1FOrS0Qpe4TudPCpl/9IqCt7k87RHE1vs2	Khách Hàng 7	0949694882	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang7	f	LOCAL
a680c785-e59a-4817-b37b-42a0a727f32c	customer4@gmail.com	$2b$12$FelC1ngqQ7CFWdp3VW/nhewiT9OSXE8Pz4WuhdUgKpvA.z.aJnEc2	Khách Hàng 4	\N	\N	USER	t	2026-06-16 23:15:37.809974+07	2026-06-17 21:42:49.224919+07	\N	customer4	f	LOCAL
b0066f5e-291f-4bc8-b7de-3b040aa967b1	khachhang18@gmail.com	$2b$12$S75G0NqTxxrpvrc1BzMniuREOCw3ULVJS9p467H3DEmWUFIktetW.	Khách Hàng 18	0959929473	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang18	f	LOCAL
be078323-1783-4459-aafd-62ec93e671fd	khachhang12@gmail.com	$2b$12$cyv4DSDtCDV9IM8VEZ54B.zbuKO71LFvfmmVbH1.ndWA3U98jhH46	Khách Hàng 12	0984068383	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang12	f	LOCAL
d3ee73fa-3b20-4bf3-8fb9-80d69dce34a4	user3@ez4ence.com	$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C	Lê Thị B	\N	\N	USER	t	2026-06-15 14:37:04.259229+07	2026-06-17 21:42:49.224919+07	\N	user3	f	LOCAL
e1bcc0f2-0197-4a78-85ce-919f74128daa	khachhang3@gmail.com	$2b$12$6cn6ILQPx1KUWJcYlf81HezaRWp33BjWGu1pHBQadIExvFLSzb5/K	Khách Hàng 3	0989401195	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang3	f	LOCAL
f720b74c-ef1c-4b21-a158-a53619ef626c	customer2@gmail.com	$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW	Trần Thị B	0987654321	\N	USER	t	2026-06-15 21:16:32.439937+07	2026-06-17 21:42:49.224919+07	\N	customer2	f	LOCAL
f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05	khachhang19@gmail.com	$2b$12$FA18SgMZfMjz32qYRwK8CO4voGlS8FNcSaLh9wAPT2qegUr2ONmTm	Khách Hàng 19	0912262284	\N	USER	t	2026-06-15 22:01:08.256719+07	2026-06-17 21:42:49.224919+07	\N	khachhang19	f	LOCAL
3602e7b1-364c-4693-9293-9a4a69f27406	\N	$2b$12$gv0vDQQpYnM7QfhVKjQkOexY/DkMGIAmlx6WNQVmXh.s3apHxUoDG	hehe	\N	\N	USER	t	2026-06-17 21:49:26.62672+07	2026-06-17 21:49:26.62672+07	\N	heee	f	LOCAL
5d9f851d-dc99-4bdc-8f48-35f154bd4642	kimtung5576@gmail.com	$2b$12$HZj5ykfihJXBnsjHxNa0OOjF/lDaHmlv7h9zn.uUJ/tCKGuImO3p6	Kim Tung	\N	https://res.cloudinary.com/dtbbbq4zr/image/upload/v1782113900/ez4gear/avatars/jr6dg5skk5jiy7bzpkux.jpg	ADMIN	t	2026-06-15 14:49:53.14203+07	2026-06-22 14:38:58.851977+07	SUPER_ADMIN	kimtung5576	t	GOOGLE
33654608-deb1-454e-b9d5-963ca9cc9478	\N	$2b$12$ZvncPCdVNRVCZGjMJW3IQexf9gOgxbigDP2mtKsBGfQvXzOIKvXE.	Nguyễn Hehe	\N	\N	USER	t	2026-06-23 18:38:31.463364+07	2026-06-23 18:38:31.463364+07	\N	ktugens	f	LOCAL
b548e1a7-c6a0-48f0-812a-fbf044a110b3	user8340@gmail.com	$2b$12$XIQ11lv0m2DfwqqpUQfUluvut9nD4qYJDwpStzH3T8SNZ3/xH5E2C	Bùi Thanh Yến	0918617551	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
8fc7c76b-32b3-4a58-9aaf-7c671dbf225f	user8599@gmail.com	$2b$12$FAiGjbYpKVfQ86ushRND1e95yfWCt8aJAM4SO3DY/nqNJuptKym3m	Huỳnh Ngọc Hải	0985906620	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
2f87c84f-6919-41bc-8ef5-51d1acd857bb	user4493@gmail.com	$2b$12$S4AjStTzkgrBNGOyHmJsB.V..QkIlb/8uN8oK4D77qtHZj4jM.CkC	Dương Thị Minh	0948029234	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
bbc18b36-47fd-4995-ac3d-36ef8bdc2624	user9304@gmail.com	$2b$12$28lqgvKGd48nTeIl2QLWq.ll5vAmgct9SUw5Fj7HKRdS7nzpPaoO2	Lê Xuân Khánh	0968811924	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
19e0698d-1959-4f75-9055-f880105a2358	user6866@gmail.com	$2b$12$eeODzg/SDEWjzmMdVDDZpOH5SNGt2MfKSp50Tf8SNwntdhISBu7y.	Hồ Thanh Bình	0978357663	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
e4c72666-65c5-4e0b-90d0-c38e757d6ce5	user9590@gmail.com	$2b$12$K7Sen/HVnAOdBVyB1/2zgOHVrLSuerujaZK3nkPPPMuuzQmOA6Rg.	Hoàng Tuấn Anh	0984795660	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
5cb191cb-4ffe-44cf-a710-6442a2583e05	user8820@gmail.com	$2b$12$aQH53krj4I84YT5Jxl5iK.WZVMFsX/NR9yGWgZBqx8kicnjaUG0wC	Lê Ngọc Long	0990958733	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
1fafa8a0-80f3-4f76-a888-40abdc5be43d	user1525@gmail.com	$2b$12$na60bgqTrgETaotAT8.wQeRxnIHuPh7notgfsY4MbSGjSUoM6UgW.	Đặng Xuân Minh	0915063873	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
c7bbcb25-aa8c-4af8-a744-947c872e4ffb	user4865@gmail.com	$2b$12$6i/hHVqiAQB9mTzam3bRb.BY0ScmVoxdaFE1Mgjq/ig6I1C98fYKC	Ngô Minh Vân	0974416557	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
f18371e9-fded-47e7-80e0-b996e449662a	user6251@gmail.com	$2b$12$XrQXuOGpKm1Hz3fGOMAV0.An.ywZF/TMZQvjsI.qpxJq8j.u16U2y	Đặng Thanh Vân	0914419623	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
1f7b9bb7-13c4-4b5e-a5d1-571257b05058	user3290@gmail.com	$2b$12$IvsJio2.2bzMZ709YgFXhuCWD0nbl6Q1azdgya1miLf2ejkY17sMi	Vũ Đức Nam	0939747394	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
d3daf422-7783-4295-8ab2-944e254c51d0	user7407@gmail.com	$2b$12$vq4cuk9W03ktVTsfaD9sVOJF0Euo8lDllAs.lKOEMtJQxZ4USMTLy	Đỗ Hải Anh	0911196475	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
a7f83e3b-ff5b-45a2-a114-9e57e21f7430	user5597@gmail.com	$2b$12$hvDk7FmvIOzrWaVTUSwuDO9uDcpwhTtGUaQFCuchmia4Yp9glgcga	Vũ Thị Hải	0938401067	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
9e1367a6-b9f3-4ab2-87ea-9f88857a9f6a	user7573@gmail.com	$2b$12$9yKfD76gjGQltaGLqiaJiuGnNdQ2WsQhtiycYMUDioDpyd5sl2HCS	Đặng Tuấn Tâm	0956906442	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
ae62436c-059d-49c8-97aa-a759c35c11fc	user5498@gmail.com	$2b$12$/oRCR1y1GHzZFVvBSBWhtufc6Qe2/SrrAqa13./UHYtcWb6K0g96K	Phan Ngọc Oanh	0993742658	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
ba614882-01e2-403b-be7b-f1b24da80f81	user9242@gmail.com	$2b$12$shdSBHunbsuor84BGtDcEORozhD0lXxiGoPP/TmWr2NsuLssDtvNK	Dương Hoàng Long	0936902495	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
d9680284-1248-468d-8651-8735dd34075f	user4642@gmail.com	$2b$12$0G.0euCNxguCoKj8kwtE1e//hXpDf0.iIngHXprU3JC.ksCfDVL9a	Đặng Hoàng Minh	0986357378	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
f5a4cfcc-af2d-486d-b55e-a2016a0f72e0	user3867@gmail.com	$2b$12$NSruP7K5Mlsbh8P3kDKJG.T2U3FJVPBrl9T0dv6W53Yhm4FFcnr6.	Phạm Minh Phong	0954348037	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
835dbdcb-58e8-4db8-aa23-fcc5eb8de413	user2400@gmail.com	$2b$12$y1gC/DI4hkUWc1/KbEnKrevKDh8ztrFWawJCyJhKC96FjfLywQa8m	Võ Thị Châu	0930834740	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
50943615-63d7-4d72-9c1f-d5e59af4a127	user6238@gmail.com	$2b$12$6jZcpGqq7fHNIoZsXbAc1uq4KsadS4t4FPTGj.t569r9ywx3Lvtl.	Vũ Hoàng Yến	0976021541	\N	USER	t	2026-06-26 15:10:41.795522+07	2026-06-26 15:10:41.795522+07	\N	\N	f	LOCAL
54664a35-d7b7-47ca-a380-cc2ae6a9e862	user1829@gmail.com	$2b$12$xzQOEAH4g2ivm0/gBsxHeeQppx6R542rhHqP3jAfT4UemloTu4172	Huỳnh Xuân Linh	0965831809	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
51fb37d6-a1ea-4ee8-9579-08661539d327	user4896@gmail.com	$2b$12$i9h5RhUi4S/6auj0v5gOK.nyCtdNVLUF7Hid0Dan85Eu4CWZmurJu	Hoàng Hữu Phong	0927295344	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
00e2ab3a-4e07-41a8-9667-6908486c983f	user6456@gmail.com	$2b$12$HxcvOsJ5r1Kxs3RsZtGkdeyHQHRuo5njnFDoIm0XEMa1LxWUAXuRu	Lý Hải Tâm	0990655139	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
48086f9d-9440-449b-9047-186cb5da6f0f	user8972@gmail.com	$2b$12$F1PBR3l54Rj3ZtQYU6qyP.BQXxuoO31jL1K8Gsg7KfY0Z/Pz/pr0i	Phan Đức Phong	0919740086	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
f666787a-c092-495e-882b-71680be7276a	user5211@gmail.com	$2b$12$pz7/jZO5quvZsguDAHPRjeIo1lCjAQCjeHQX6Dbqhw6IOWMpiZ6Fm	Nguyễn Hoàng Hải	0944395264	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
15550699-3c15-4611-8ab0-819e4dbbd4be	user4595@gmail.com	$2b$12$BmtJnvFKmfiOtrAEzy6PEOLwOrLE4yoHCwF/iUuHKPt7lVBAqfpjy	Huỳnh Xuân Châu	0975172902	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
c892a72f-7962-47db-a4d0-345461ef316f	user8626@gmail.com	$2b$12$36c7EC6zGDvimc17dCfugea2jo.fgY1vTyB5uVtW99LHwU6CpmIPy	Nguyễn Văn Linh	0986715821	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
7ef618fc-4aea-488f-83eb-ff6673688916	user7935@gmail.com	$2b$12$VvrsnpjwTJQQzSIUuGBvoOeVxELgw1SrKl8KP/rH.ffHVs9jZnGDK	Đỗ Minh Oanh	0923954194	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
6d1849b0-a680-4b82-8c20-2fef553a3c35	user4292@gmail.com	$2b$12$5P5.wwc5X3OXwimragXO2OjONPv0u0dbjY6DZuadOOzmxcWfzUUt2	Lê Tuấn Châu	0942009414	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
d2d8c4d9-af31-4102-af4e-fcf0b91885ab	user1202@gmail.com	$2b$12$U5y65iFle0GO92WIrwn39exPlBtyweR/oFsCrOHlKbicOKWCwaJOK	Đặng Thị Sơn	0978948241	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
c654bd54-f3da-4ac9-8d8f-399ea2de06a9	user7563@gmail.com	$2b$12$PRgom0JEiMiFt/S.Usz9l.zSfoIUe4xsBcV.3PBjhxwdgRqM11ER.	Vũ Xuân Khánh	0924630393	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
10a8bd2b-cbad-4de4-9c54-6054c558e047	user3009@gmail.com	$2b$12$enXs0RitKdmMqy2wXHccLOwYzRrGnFrMTfhmHwZqRUsuycnVhzepm	Phan Minh Vân	0921440358	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
63b0379a-7608-42c1-9ccc-5861337f9473	user1778@gmail.com	$2b$12$wLb149p/IyQcZUZUoJ6K.encxeOEYuqtOSsxUTxLyKNswTyTkbB6u	Nguyễn Tuấn Châu	0947268977	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
8b9b0724-8d15-48e7-8465-e1ae3e2d625c	user1416@gmail.com	$2b$12$RcZo9tnPEIh..B9m9py1tO5vPh1JyFPwg741MIpdeRSpTQ7RhUVSS	Vũ Tuấn Yến	0920788619	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
f1fcf118-37f4-45ce-b44c-ee70f694535f	user1192@gmail.com	$2b$12$qenDVEnvZHWUNUdZghk/eukN3D7fTKMY9hvLd3oI3atjPB6gYmaMi	Hồ Xuân Vân	0964539297	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
06f64d50-a4de-4876-bfa0-839c64540eed	user3651@gmail.com	$2b$12$Y6UJQDuYlQfTid.RGwusO.2BVhWBqSNDQrcmKxxkC/E2kYFwEReDK	Hoàng Tuấn Nam	0985688579	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
637c516b-f30a-46c7-bb6d-855016d4da84	user5117@gmail.com	$2b$12$BFJurA7yp0aCq0rX9KPsEelu3xn2.19d9C/nBZJQv075GIkm9anma	Lý Minh Phương	0997677001	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
8d3cdbd8-41e9-40d9-be4b-f866ef1de910	user3760@gmail.com	$2b$12$RmoZe35dR4sD51S5WCSS3uoMmZGyT9/1pfLU3FGI0.3MPnaPgl3Fq	Huỳnh Đức Linh	0977283552	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
81366434-e5cb-4bd3-90a4-7ad68cd85836	user5817@gmail.com	$2b$12$XnPuYatpefBJKK.olra8JOWVmoDTmFz2iJGHaDC8n2B2voayYDB96	Đỗ Quang Linh	0997790788	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
5a4ff4c2-1bf2-4148-a789-6010e6ced4fe	user3664@gmail.com	$2b$12$JxHyP0g4CRn05fZDZv225.UTf302jCO2pxpEt0FVl7nKSmaq5HAYy	Võ Quang Quân	0949443587	\N	USER	t	2026-06-26 15:11:49.451636+07	2026-06-26 15:11:49.451636+07	\N	\N	f	LOCAL
c86c4f6a-9868-4c21-b6d9-ec6d558373da	user1545@gmail.com	$2b$12$K29JdnMJBARtgYns6XjZ3OGad4GdVtn7ngDiNEjsLIEJG5BUa4QMy	Lê Quang Uyên	0989696076	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
2b426ae4-21c8-46de-ab4a-9a3e5d38c376	user5457@gmail.com	$2b$12$Ix2BkaPyx9RKA.mSPClJWeTxRWFqc.X/EnOuawAZTSvvcMoeBgU5G	Bùi Hải Tâm	0977371503	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
ddafc344-31b0-4688-b1a3-80b12e0cdbf8	user5406@gmail.com	$2b$12$06CBXe3huAVCCRUfclxzsuFTTGZuUt4UC0nFDXKTx77pqlmLIIlBG	Dương Hoàng Dũng	0923067026	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
292ae0da-38e8-4f6b-ab48-f6e33069a3ce	user5599@gmail.com	$2b$12$BCL1VKOAYoh2gFtrY0PSpuVGonju9WBAZxOOiSYQE.CaG8Dlt0srS	Nguyễn Xuân Châu	0939602693	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
a9a9dce7-d12e-416b-b95d-f8d0b878e5a3	user1725@gmail.com	$2b$12$yLr1y.x8SxuSZPxXGKePW.6swqOhoNQS.NDpIrAiCNO0C1j.aPIyy	Huỳnh Minh Hải	0945046778	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
7d04da9b-ef68-4f38-af0c-46300b51de79	user4070@gmail.com	$2b$12$sr.X5zzTsHvu9uMdGubSfeeeBBEV4FTuJvPeGnlTRW1rG2NCKnETC	Lê Đức Minh	0955354084	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
93556805-fdab-45e1-9be6-e47684eec120	user5333@gmail.com	$2b$12$29GqMVv9S/Ou4ZA9/4MHAOhYr3a/IIOTK7VncAcOWxsAG2HqAoPuW	Đặng Hữu Oanh	0991254983	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
626b7614-6d6e-4c9b-a10f-7fd2b837422f	user4866@gmail.com	$2b$12$Jb.6oZkmVfemzVCJfdCbo.H5nsHQZlqNExovPzARoAL1cN3p1N0xi	Phan Đức Quân	0922935065	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
cc19e280-d5c7-4616-a117-ca29341ea383	user3453@gmail.com	$2b$12$8tGz4ffeQAL.kWt0saxYSuBGIHwohnzjJuVlQmlCFjf.eUk22U2Hq	Đỗ Tuấn Anh	0986317213	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
68b21c3a-04e9-495e-926c-a460ff4de48b	user9318@gmail.com	$2b$12$ouUTgRyQ2b/U2EHkEizrEOdhoLCRIjnHa3YacIZerTuhQ1o.mhDH6	Đặng Hoàng Anh	0951834646	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
28fe64c6-5d2f-47a8-8014-632f76cac6c6	user1136@gmail.com	$2b$12$52wNHRcfnWxnhuzTW.UjK.ol4Z.yPyaQP9X8BlIxATR4EucPehvIG	Đặng Thanh Châu	0995369533	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
1b94e300-e05d-411e-a90a-49e4dbe9470e	user5731@gmail.com	$2b$12$TroeWVWhvqGkBZ36jqZkRuen7zbJUht4uJo78o1XfRbY4dOn2dsM.	Lê Ngọc Phương	0985537650	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
300bfb37-10ee-421b-bd97-7e6dfc8c9689	user9151@gmail.com	$2b$12$csUcCOLhVmstl0NUI9O0k.4Rv6xGbocjqPAyI1qrK7UkLYfasBgTu	Đặng Quang Long	0934306410	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
87a3416a-2f28-4cd5-acfa-74ebdc0774a5	user8694@gmail.com	$2b$12$q/RJT/Kg9jvVEhTG16pwNurAJG7l8AEY.mDk95wOZx6lMsBV40GGy	Hồ Văn Tâm	0979031033	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
68fd3c58-bfb6-4cd8-ad59-02d3568c249a	user1157@gmail.com	$2b$12$.gWoEeQ5fCZ1dSpWf90ak.D/635/RIfRK3GDw4yMq/9xh5AMrFLT2	Dương Hoàng Long	0927825792	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
79a1ee4a-f0b3-4555-b652-943bfd259924	user9689@gmail.com	$2b$12$4C99TLy4soic6OZ3op4IeeMO0.78MLWkqc9whVSnAFlu7QsxoEQE2	Hoàng Minh Long	0995364167	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
2464a8eb-d330-490d-9a72-64469e478654	user5144@gmail.com	$2b$12$q1z1FpXLMkERpMTeR.X21.JHX2w6AduGpueK7egWwH2FHgt.0tOa2	Phạm Thị Bình	0985276449	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
8884b7ed-21b9-40de-9f2a-b52fe6078c31	user1751@gmail.com	$2b$12$Zr6v9aPALDYfFqJ5B9Sb6ueo.rNYRxPwCR7Rsej42eRNL67YFIUAa	Võ Văn Tâm	0926796590	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
5f222848-9f66-44eb-a46a-26bd4b138164	user8412@gmail.com	$2b$12$rEYyn/o8czSpflKi7uiY0.50SqYjitMGB9dHtwkuMla7ibpTw1TBi	Trần Quang Sơn	0932315723	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
6d7d98d9-ac6c-48ed-bf4d-dc0d0dd172a9	user1733@gmail.com	$2b$12$gkVWn/U8gFOGoia18C2R6es7AZi8NjkEUv4Bu0owzMIRA2AQJ9lxK	Hoàng Thị Hải	0965382698	\N	USER	t	2026-06-26 15:12:24.83727+07	2026-06-26 15:12:24.83727+07	\N	\N	f	LOCAL
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist_items (id, user_id, created_at, sku_id) FROM stdin;
\.


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 22, true);


--
-- Name: chat_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_sessions_id_seq', 7, true);


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

\unrestrict ZFZdAT3VKEyI8HRxdAx05dqgmj8hTKJ2dzqetoXLwOhg8UI9OIYfCw2gcAijpgs

