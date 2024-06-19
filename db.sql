-- Database: climasync

-- DROP DATABASE IF EXISTS climasync;

CREATE DATABASE climasync
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


-- Table: public.user

-- DROP TABLE IF EXISTS public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    firebase_token character varying COLLATE pg_catalog."default" NOT NULL,
    device_id character varying COLLATE pg_catalog."default" NOT NULL,
    localizacao character varying COLLATE pg_catalog."default" NOT NULL,
    alerta_calor boolean,
    alerta_frio boolean,
    alerta_sol boolean,
    alerta_chuva boolean,
    CONSTRAINT user_pkey PRIMARY KEY (device_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to postgres;