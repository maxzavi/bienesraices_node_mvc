# NodeJs with Express

Create project, without questions:

```cmd
npm init -y
```

By Development, add dependency **nodemon**

```cmd
npm i -D nodemon
```

In package.json, add script **dev**

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index",
    "dev": "nodemon index"
  },
```

Add dependency **express**

```cmd
npm i express
```

Use Pug dependency by use template engine

```cmd
npm i pug
```

Install tailwindcss

```cmd
npm i -D tailwindcss autoprefixer postcss postcss-cli
```

```cmd
npx tailwindcss init -p
```

In file **tailwind.config.js** add path views

```js
export default {
  content: ['./views/**/*.pug'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

In fila **package.json** add script css: postcss-cli path tailwind.css

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index",
    "dev": "nodemon index",
    "css": "postcss public/css/tailwind.css -o public/css/app.css --watch"
  },
 
```
## ORM

Add ORM **sequelize**
```cmd
npm install sequelize mysql2
```

Create folder **config** and add file db.js


## MySql Database

Deploy in docker, see repo https://github.com/maxzavi/mysql-docker-k8s

Create db **bienesraices_node_mvc** in mysql

## Environment variables

Use **dotenv** by variables:

```cmd
npm i dotenv
```

add file .env

```properties
DB_NAME=bienesraices_node_mvc
DB_USERNAME=root
DB_PASSWORD=******
DB_HOST=localhost
DB_PORT=3306


EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=********
EMAIL_PAASSWORD=**********

HOST_URL=http://localhost

JWT_SECRET=*******
```
## Express Validator

Add dependency **express-validator**

```cmd
npm i express-validator
```

## Hash using bcrypt

Add dependency **bcrypt**

```cmd
npm i bcrypt
```


## Emails

Add dependency **nodemailer**

```cmd
npm i nodemailer
```

Use service https://mailtrap.io/

## CSRF protection

Add dependencies **csurf** and **cookie-parser**

```cmd
npm i csurf cookie-parser
```

## JWT

Add dependency **jsonwebtoken**

```cmd
npm i jsonwebtoken
```

## WebPack

Add dependencies **webpack** and **webpack-cli**

```cmd
npm i -D webpack webpack-cli
```

Add file webpack.config.js

## Concurrently

Use both scripts in one, add dependencie **concurrently**

```cmd
npm i -D concurrently
```

Add script usinng \"

```json

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index",
    "server": "nodemon index",
    "css": "postcss public/css/tailwind.css -o public/css/app.css --watch",
    "js": "webpack --watch",
    "dev":"concurrently \"npm run css\" \"npm run js\""
  },
```

## Maps

In pug file
```js
block styles
    link(rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css")
```

In js file maps.js:

```js
(function() {
    const lat = -12.0466716;
    const lng = -77.0310093;
    const zoom=13;
    let marker;
    const map = L.map('map').setView([lat, lng ], zoom);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    }).addTo(map)
})()
```

## Dropzone

Add dependency **dropzone@5.9.3**

```cmd
npm i dropzone@5.9.3
```
add style in page pug:

```htm
link(rel="stylesheet", href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/dropzone.css")
```


## Multer

Add dependencie **multer**

```cmd
npm i multer
```
