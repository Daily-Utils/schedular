# Nest Server

A nestjs server designed for scheduling

## ENV

See the .env.example

Setup the env correctly

## Api Docs

To view Api docs Visit: [text](https://c1jfsswjgp.apidog.io/)

## Devlopment database

Check the dev folder on local

```sh
docker compose up -d
```

## How to run?

### Using docker

```sh
docker compose build
docker compose up -d
```

### Run locally for development

Make sure local development database is on

```
yarn run start
```

### Add Roles to database

After devloping database and starting server please run this

```sh
npx ts-node scripts/addRoles.ts
```

To backup, please read

srcipts/backup.sh

```sh
./scripts/backup.sh
```

