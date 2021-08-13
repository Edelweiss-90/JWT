import { Request, Response, NextFunction, Router as router } from 'express';

import bcrypt from 'bcrypt';

import Controller from '../../interfaces/controller.interface';

import { authMiddleware } from '../../middlewares/auth.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';

import UserWithThatNameAlreadyExistsException from '../../exceptions/UserWithThatNameAlreadyExistsException';
import WrongCredentialsException from '../../exceptions/WrongCredentialsException';
import UserNotFoundException from '../../exceptions/UserNotFoundException';
import WrongAuthenticationTokenException from '../../exceptions/WrongAuthenticationTokenException';

import userModel from './user.model';
import CreateUserDto from './user.dbo';
import tokenModel from '../service/refreshTokenModel';


import AuthService from '../service/authentication.service';

class UserController implements Controller {
    public router = router();
    public user = userModel;
    public token = tokenModel;
    public authServace = new AuthService();

    constructor() {
        this.router.get('/profile', authMiddleware, this.profile);
        this.router.post('/signup',
            validationMiddleware(CreateUserDto),
            this.signup);
        this.router.post('/login',  this.login);
        this.router.post('/refresh',  this.refresh);
    }
    private profile = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.body.decoded.id;
        const user = await this.user.findOne({ id: id });
        if(user){
            res.status(200).json({
                id: user.id,
                name: user.name,
            });
        }else{
            next(new UserNotFoundException(id));
        }
    }

    private signup = async (req: Request, res: Response, next: NextFunction) => {
        const userData: CreateUserDto = req.body;

        const user = await this.user.findOne({name: userData.name});
        if(!user){

            //Такое решение было принято в связи с отсутствием метода удаления пользователя.
            const id = await this.user.countDocuments() + 1;

            const hashedPassword = await bcrypt.hash(userData.password, Number(process.env.PASSWORD_SALT));

            await this.user.create({
                id: id,
                name: userData.name,
                hash: hashedPassword,
            });
            res.status(200).json({
                id: id,
            });
        }else{
            next(new UserWithThatNameAlreadyExistsException(userData.name));
        }
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        const logInData = req.body;
        const user = await this.user.findOne({ name: logInData.name });
        
        if (user) {
            const isPassword = await bcrypt.compare(
                logInData.password,
                user.get('hash', null, { getters: false }),
            );
            
            if (isPassword) {
                const {
                    accessToken, 
                    refreshToken
                } = await this.authServace.createAllTokens(user);

                res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            }else {
                next(new WrongCredentialsException());
            }
        }else{
            next(new WrongCredentialsException());
        }
    }

    private refresh = async (req: Request, res: Response, next: NextFunction) => {
        const oldRefreshToken = req.body.refreshToken;
        const oldToken = await this.token.findOne({token: oldRefreshToken});
        if(oldToken){
            try{
                await this.authServace.checkRefreshTokenDate(oldToken);

                const {
                    accessToken, 
                    refreshToken
                } = await this.authServace.deleteAndCreateAllTokens(oldToken);

                res.status(200).json({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            }catch(error){
                return next(error);
            }
        }else{
            next(new WrongAuthenticationTokenException());
        }
    }
}

export default UserController;
