# Climão-IoT

Aplicação ubíqua para ligar tomadas inteligentes com base na temperatura local.

> Trabalho final da disciplina de Dispositivos Móveis e Ubíquos

- Vídeo de introdução: [React Native Tutorial for Beginners - Build a React Native App
  ](https://www.youtube.com/watch?v=0-S5a0eXPoc)

- Verificar se o node está instalado

```shell
npm -v
```

- Instalar o expo

```shell
npm i -g expo-cli
```

- Pra rodar no celular, tem que baixar o app Expo Client

- Instalar pacotes

```shell
cd Climao
npm install
```

- Preencha as envs no arquivo `.env`

### Rodando o projeto

- `npm run web` para rodar no navegador
- `npm run android` ou `npm run ios` para abrir no celular

### Problema

- Para a [autenticação](https://developer.tuya.com/en/docs/iot/new-singnature?id=Kbw0q34cs2e5g), é usado HMAC SHA256 para gerar o hash

- Client `@tuya/tuya-connector-nodejs` usa a biblioteca `crypto` que não tem no React Native
- No [Código exemplo](https://developer.tuya.com/en/docs/iot/new-singnature?id=Kbw0q34cs2e5g#title-19-Sample%20code%20for%20JavaScript), também é usada a biblioteca crypto

- expo-crypto -> Não tem o algoritmo Hmac

- Alternativas: cryptoJS -> `crypto.HmacSHA256(str, secret).toString(crypto.enc.Hex).toUpperCase()` para HMAC e `crypto.SHA256(str).toString(crypto.enc.Hex);` para SHA256

- Quando roda no app (arquivo `clients/tuya.ts`), dá problema de CORS Policy
- No [código do postman](https://developer.tuya.com/en/docs/iot/check-postman-sign?id=Kavfn3820sxg4), dá certo, mesmo com os mesmos headers

### Resolvendo o problema de cors:

Precisa inicializar o chrome com os parâmetros `--disable-web-security --user-data-dir=~/chromeTemp`.

```shell
[PATH PARA O CHROME]/chrome.exe --disable-web-security --user-data-dir=~/chromeTemp
```

Ver [este vídeo](https://www.youtube.com/watch?v=MkiDyyBDuSE) para saber como pegar o path do chrome e como executar o comando de maneira mais fácil.
