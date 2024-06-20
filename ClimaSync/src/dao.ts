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

export const createUser = async (user: User) => {
  try {
    await getPool().query(
      "INSERT INTO public.user (firebase_token, device_id, localizacao, alerta_calor, alerta_chuva, alerta_frio, alerta_sol) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        user.firebase_token,
        user.device_id,
        user.localizacao,
        user.alerta_calor,
        user.alerta_chuva,
        user.alerta_frio,
        user.alerta_sol,
      ]
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

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
