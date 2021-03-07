FROM node:14.16.0-alpine3.10

ENV PORT=3000

WORKDIR /usr/src/app

# ライブラリのインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードをコピー
COPY . .

EXPOSE ${PORT}

# サーバーの起動
CMD [ "npm", "start" ]