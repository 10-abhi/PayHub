FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY apps/user-app/package.json ./apps/user-app/
COPY apps/merchant-app/package.json ./apps/merchant-app/
COPY apps/bank-webhook/package.json ./apps/bank-webhook/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/store/package.json ./packages/store/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN npm ci

COPY . .

RUN npm run build -- --filter=merchant-app

EXPOSE 3001

CMD ["npm", "run", "start", "--workspace=merchant-app", "--", "-p", "3001"]
