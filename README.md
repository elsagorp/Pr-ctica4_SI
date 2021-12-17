# Práctica IV y V
Con una base de datos creada tomando como punto de partida el siguiente ejemplo https://github.com/Nebrija-Programacion/web-backend/tree/master/example/rickmorty2mongo

Se pide realizar una API REST utilizando `Node.js con Typescript` y el servidor **Apollo Server**. La práctica debe trabajar con una base de datos Mongo alojada en **Mongo Atlas**.
## Indice
- [Instalar dependencias](#Instalar-dependecias)
- [Ejecutar el código](#Ejecutar-el-codigo)
- [Variables de entorno en un archivo .env](#Variables-de-entorno-en-un-archivo-.env)


## Instalar dependencias
Para instalar las dependencias que estan en el `package.json`.
```ruby 
    npm install 
```
## Ejecutar el código
- Si quieres ejecutar el código actual y no hacerle ningun cambio.
```ruby
    npm run start
```
- Si quieres ejecutar el código como desarrollador, es decir, este se actualiza, cuando guardemos los cambios del código.
```ruby
    npm run dev 
```
## Variables de entorno en un archivo .env
Tendrás que escribir las variables de entorno pedidas en .env.example. 
```ruby
PORT = Puerto 
MONGO_DATABASE = nombre base de datos
MONGO_USER = usuario de mongodb
MONGO_PASSWORD = contraseña de mongodb
ATLAS_CLUSTER = cluster correspondiente
```
