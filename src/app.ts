import express from 'express';

import mongoose from 'mongoose';

import Controller from './interfaces/controller.interface';

import errorMiddleware from './middlewares/error.middleware';

class App {
    public app: express.Application;
    private PORT =  process.env.PORT || 3000;
    private HOST = process.env.APP_HOST;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.initDatabase();
        this.initMiddlewares();
        this.initController(controllers);
        this.initErrorHendling();
    }
    
    public listen = (): void => {
        this.app.listen(this.PORT as number, this.HOST as string, () => {
            console.log(`Server start on the host ${this.HOST}:${this.PORT}`);
        });
    }

    public getServer = (): express.Application => {
        return this.app;
    }

    private initDatabase = () => {
        mongoose.connect(
            `mongo mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}
            ?authSource=${process.env.DB_PASSWORD} 
            --username ${process.env.DB_USERNAME}` ,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            }
        );

        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    }

    private initMiddlewares = () => {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initController = (controllers: Controller[]) => {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    private initErrorHendling = () => {
        this.app.use(errorMiddleware);
    }
}

export default App;
