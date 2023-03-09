<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# Dev
1. Clone repository
2. Copy ```env.template``` and rename to ```.env```
3. Execute 
```
yarn install
```
```or```
```
npm install
```
4. Execute (Docker needs to be open)
```
docker-compose up -d
```
5. Lift backend
```
npm run start:dev
```
```or```
```
yarn start:dev
```
6. Visit ```localhost:3000/graphql```

7. Execute __mutation__ "executeSeed", to fill database with information