import 'dotenv/config';

import App from './app';

import UserController from './controllers/user/user.controller';

const app = new App([
    new UserController(),
]);

app.listen();
