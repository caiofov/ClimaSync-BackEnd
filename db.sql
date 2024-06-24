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
    device_id character varying COLLATE pg_catalog."default" NOT NULL DEFAULT "<DEVICE_ID>", -- Substituir pelo device ID
    localizacao character varying COLLATE pg_catalog."default",
    titulo_alerta character varying COLLATE pg_catalog."default",
    corpo_alerta character varying COLLATE pg_catalog."default",
    tipo_alerta character varying COLLATE pg_catalog."default",
    timestamp_alerta date,
    alerta_frio boolean DEFAULT true,
    alerta_sol boolean DEFAULT true,
    alerta_chuva boolean DEFAULT true,
    alerta_hidratacao boolean DEFAULT true,
    CONSTRAINT user_pkey PRIMARY KEY (firebase_token)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."user"
    OWNER to admin; -- prod
    -- OWNER to postgres; -- local