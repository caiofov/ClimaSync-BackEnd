import CONFIG from "./config";
import { AlertType, User, UserInput } from "./models/user";
import { Pool } from "pg";

// este arquivo contém as consultas no banco de dados

const getPool = () =>
  new Pool({
    user: CONFIG.POSTGRES_USER,
    host: CONFIG.POSTGRES_HOST,
    database: CONFIG.POSTGRES_DB,
    password: CONFIG.POSTGRES_PASSWORD,
    port: CONFIG.POSTGRES_PORT,
    idleTimeoutMillis: 3000,
    ssl: true,
  });

// cria um usuário no banco
// export const createUser = async (user: User) => {
//   try {
//     await getPool().query(
//       "INSERT INTO public.user (firebase_token, device_id, localizacao, alerta_calor, alerta_chuva, alerta_frio, alerta_sol) VALUES ($1, $2, $3, $4, $5, $6, $7)",
//       [
//         user.firebase_token,
//         user.device_id,
//         user.localizacao,
//         user.alerta_calor,
//         user.alerta_chuva,
//         user.alerta_frio,
//         user.alerta_sol,
//       ]
//     );
//   } catch (error) {
//     console.error("Erro ao criar usuário:", error);
//     throw error;
//   }
// };

// pega um usuário pela sua PK
export const getUser = async (token: string) => {
  try {
    const result = await getPool().query(
      "SELECT * FROM public.user WHERE firebase_token = $1",
      [token]
    );
    if (result.rowCount > 0) return result.rows[0] as User;
    else throw "Usuário não existe";
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

export const findOrCreateUser = async (user: UserInput) => {
  const pool = await getPool();
  const find = () =>
    pool.query("SELECT * FROM public.user WHERE firebase_token = $1", [
      user.firebase_token,
    ]);

  try {
    let findResult = await find();
    if (findResult.rowCount == 0) {
      console.log("Criando usuário");
      await getPool().query(
        "INSERT INTO public.user (firebase_token) VALUES ($1)",
        [user.firebase_token]
      );
      findResult = await find();
    }

    if (findResult.rowCount > 0) return findResult.rows[0] as User;
    else throw "Ocorreu um erro";
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

// faz uma lista com todos os lugares cadastrados no banco
export const getAllPlaces = async () => {
  return (
    await getPool().query("SELECT DISTINCT localizacao FROM public.user")
  ).rows.map((r) => r.localizacao) as string[];
};

export const listUsersByPlace = async (place: string) => {
  return (
    await getPool().query(`SELECT * FROM public.user WHERE localizacao = $1`, [
      place,
    ])
  ).rows as User[];
};

// lista os usuários localizados no lugar passado e que tem um dos alertas passados ligados
export const getUsersByPlaceAndAlert = async (
  place: string,
  alerts: AlertType[]
) => {
  const joinedAlerts = alerts.join("OR");
  return (
    await getPool().query(
      `SELECT * FROM public.user WHERE localizacao = $1 AND (${joinedAlerts})`,
      [place]
    )
  ).rows as User[];
};

export const updateLastMessage = async (title: string, body: string, type: string, token: string) => {
  try {
    await getPool().query(
      "UPDATE public.user SET titulo_alerta = $1, corpo_alerta = $2, tipo_alerta = $3, timestamp_alerta = NOW() WHERE firebase_token = $4",
      [title, body, type, token]
    );
  } catch (error) {
    console.error(`Erro ao atualizar a notificação ${type}:`, error);
    throw error;
  }
};