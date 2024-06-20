export interface User {
  firebase_token: string;
  device_id: string;
  localizacao: string;
  alerta_calor: boolean;
  alerta_frio: boolean;
  alerta_sol: boolean;
  alerta_chuva: boolean;
}

export const validateUser = (user: User) => {
  if (!user.firebase_token) {
    throw "Token do Firebase é obrigatório";
  }
  if (!user.device_id) {
    throw "O ID do dispositivo é obrigatório";
  }
  if (!user.localizacao) {
    throw "A localização é obrigatória";
  }
};
