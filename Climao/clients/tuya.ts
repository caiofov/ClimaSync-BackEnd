import * as qs from "qs";
import * as crypto from "crypto-js";
import { default as axios } from "axios";
import CONFIG from "../config";

const httpClient = axios.create({
  baseURL: "https://openapi.tuyaus.com",
  timeout: 5 * 1e3,
});
/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto.HmacSHA256(str, secret).toString(crypto.enc.Hex).toUpperCase();
}

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

  const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
    headers,
  });
  if (!login || !login.success) throw Error(`fetch failed: ${login.msg}`);

  return login;
}

/**
 * fetch highway business data
 */
export async function sendDeviceCommand(deviceId: string, token: string) {
  const query = {};
  const method = "POST";
  const url = `/v1.0/devices/${deviceId}/commands`;
  const reqHeaders = await getRequestSign(url, method, {}, query, {}, token);

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  if (!data || !data.success) throw Error(`request api failed: ${data.msg}`);

  return data;
}

/**
 * fetch highway business data
 */
export async function getDeviceInfo(deviceId: string, token: string) {
  const query = {};
  const method = "GET";
  const url = `/v1.0/devices/${deviceId}`;
  const reqHeaders: { [k: string]: string } = await getRequestSign(
    url,
    method,
    {},
    query,
    {},
    token
  );

  const { data } = await httpClient.request({
    method,
    data: {},
    params: {},
    headers: reqHeaders,
    url: reqHeaders.path,
  });
  // if (!data || !data.success) throw Error(`request api failed: ${data.msg}`);

  return data;
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 * @param token
 */
async function getRequestSign(
  path: string,
  method: string,
  headers: { [k: string]: string } = {},
  query: { [k: string]: any } = {},
  body: { [k: string]: any } = {},
  token: string
) {
  method = method.toUpperCase();

  const t = Date.now().toString();

  const [uri, pathQuery] = path.split("?");

  // let sortedQuery: { [k: string]: string } = {};
  // if (pathQuery) {
  //   const queryMerged = Object.assign(query, qs.parse(pathQuery));
  //   Object.keys(queryMerged)
  //     .sort()
  //     .forEach((i) => (sortedQuery[i] = query[i]));
  // }

  // const querystring = decodeURIComponent(qs.stringify(sortedQuery));
  // console.log({ sortedQuery });
  // const url = querystring ? `${uri}?${querystring}` : uri;

  const contentHash = crypto.SHA256(JSON.stringify(body));
  // .toString(crypto.enc.Hex);

  const stringToSign = [method, contentHash, "", uri].join("\n");
  const signStr = CONFIG.tuyaAccessID + token + t + stringToSign;

  return {
    t,
    path: uri,
    client_id: CONFIG.tuyaAccessID,
    sign: await encryptStr(signStr, CONFIG.tuyaAccessSecret),
    sign_method: "HMAC-SHA256",
    access_token: token,
  };
}
