export interface ConvertedTuyaStatus {
  isOnline: boolean;
  isTurnedOn: boolean;
}

export interface TuyaStatusResponse {
  online: boolean;
  status: { code: string; value: string | number | boolean }[];
}
