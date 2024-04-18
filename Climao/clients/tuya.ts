import crypto from "crypto-es";
import cryptoJS from "crypto-js";
import { default as axios } from "axios";
import CONFIG from "../config";

let token = "";

const config = {
  /* openapi host */
  host: "https://openapi.tuyaus.com",
  /* fetch from openapi platform */
  accessKey: "",
  /* fetch from openapi platform */
  secretKey: "",
  /* Interface example device_ID */
  deviceId: "",
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

/**
 * fetch highway login token
 */
export async function getToken() {
  const method = "GET";
  const timestamp = Date.now().toString();
  const signUrl = "/v1.0/token?grant_type=1";
  const contentHash = crypto.SHA256("").toString(crypto.enc.Hex);
  const stringToSign = [method, contentHash, "", signUrl].join("\n");
  const signStr = CONFIG.tuyaAccessID + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: "HMAC-SHA256",
    client_id: CONFIG.tuyaAccessID,
    sign: await encryptStr(signStr, CONFIG.tuyaAccessSecret),
  };

  console.log(headers);
  const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  return login;
}

/**
 * fetch highway business data
 */
async function getDeviceInfo(deviceId: string) {
  const query = {};
  const method = "POST";
  const url = `/v1.0/devices/${deviceId}/commands`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    {},
    query
  );

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) {
    throw Error(`request api failed: ${data.msg}`);
  }
}

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto.HmacSHA256(str, secret).toString(crypto.enc.Hex).toUpperCase();
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
async function getRequestSign(
  path: string,
  method: string,
  headers: { [k: string]: string } = {},
  query: { [k: string]: any } = {},
  body: { [k: string]: any } = {}
) {
  const t = Date.now().toString();
  const [uri, pathQuery] = path.split("?");
  const queryMerged = Object.assign(query, qs.parse(pathQuery));
  const sortedQuery: { [k: string]: string } = {};
  Object.keys(queryMerged)
    .sort()
    .forEach((i) => (sortedQuery[i] = query[i]));

  const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  const url = querystring ? `${uri}?${querystring}` : uri;
  const contentHash = crypto
    .SHA256(JSON.stringify(body))
    .toString(crypto.enc.Hex);
  const stringToSign = [method, contentHash, "", url].join("\n");
  const signStr = CONFIG.tuyaAccessID + token + t + stringToSign;
  return {
    t,
    path: url,
    client_id: CONFIG.tuyaAccessID,
    sign: await encryptStr(signStr, CONFIG.tuyaAccessSecret),
    sign_method: "HMAC-SHA256",
    access_token: token,
  };
}
