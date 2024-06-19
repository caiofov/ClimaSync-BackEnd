import CONFIG from "./config";
import { User } from "./models/user";
import { Pool } from "pg";

const getPool = () =>
  new Pool({
    user: CONFIG.POSTGRES_USER,
    host: CONFIG.POSTGRES_HOST,
    database: CONFIG.POSTGRES_DB,
    password: CONFIG.POSTGRES_PASSWORD,
    port: CONFIG.POSTGRES_PORT,
  });

export const createUser = (user: User) => {};
//INSERT INTO public.user (firebase_token, device_id, localizacao) VALUES ('token', 'teste_device_id','Fortaleza,CE')

export const getUser = async (deviceID: string) => {
  try {
    const result = await getPool().query(
      "SELECT * FROM public.user WHERE device_id = $1",
      [deviceID]
    );
    if (result.rowCount > 0) return result.rows[0] as User;
    else throw "Usuário não existe";
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
