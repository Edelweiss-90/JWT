# Application launch

Create a .env file and fill in the example of the env_template file.

* install dependencies
   * npm i

* commands
   * npm run start:dev - start dev server
   * npm run start - builde and start server
   * npm run build - rebuild the server

   ## Server requests:

   ```
   Request:

   curl --location --request POST 'http://localhost:3000/signup' \

   --header 'Content-Type: application/json' \

   --data-raw '{
    "name": "name",
    "password": "password"}'

    Response: 

    {"id": id}
   ```

   ```
   Request:

   curl --location --request POST 'http://localhost:3000/login' \
   
   --header 'Content-Type: application/json' \
   
   --data-raw '{
    "name": "name",
    "password": "password"
   }'
   
   Response:

   {
    "accessToken": token,
    "refreshToken": token
   }

   ```
   
   
   ```
   Request:

   curl --location --request POST 'http://localhost:3000/refresh' \

   --header 'Content-Type: application/json' \

   --data-raw '{
    "refreshToken": token
  }'

   Response:

   {
    "accessToken": token,
    "refreshToken": token
   }
   ```

   ```
   Request:

   curl --location --request GET 'http://localhost:3000/profile' \
   --header 'Authorization: Bearer token'

   Response: 

   {"id": id, "name": name}
   ```
