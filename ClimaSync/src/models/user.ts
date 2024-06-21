export interface UserInput {
  firebase_token: string;
}
export type AlertType =
  | "alerta_calor"
  | "alerta_frio"
  | "alerta_sol"
  | "alerta_chuva"
  | "alerta_hidratacao";

export interface User extends UserInput {
  device_id: string;
  localizacao: string;

  titulo_alerta?: string;
  corpo_alerta?: string;
  tipo_alerta?: AlertType;
  timestamp_alerta?: Date;

  alerta_calor: boolean;
  alerta_frio: boolean;
  alerta_sol: boolean;
  alerta_chuva: boolean;
  alerta_hidratacao: boolean;
}

export const validateUser = (user: UserInput) => {
  if (!user.firebase_token) {
    throw "Token do Firebase é obrigatório";
  }
};
