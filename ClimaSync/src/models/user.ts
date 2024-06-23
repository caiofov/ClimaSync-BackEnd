export interface UserInput {
  firebase_token: string;
}

const _alerts = [
  "alerta_calor",
  "alerta_frio",
  "alerta_sol",
  "alerta_chuva",
  "alerta_hidratacao",
] as const;
export type AlertType = (typeof _alerts)[number];

export interface AlertUpdateInput {
  token: string;
  value: boolean;
  type: AlertType;
}
export interface User extends UserInput {
  device_id: string;
  localizacao?: string;

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
  if (!user.firebase_token) throw "Token do Firebase é obrigatório";
};

export const validateAlert = (alert: AlertUpdateInput) => {
  if (!_alerts.includes(alert.type))
    throw `Tipo inválido de alerta ${alert.type}. Esperado: ${_alerts}`;
};
