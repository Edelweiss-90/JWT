import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.headers && req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SALT as string);
        req.body.decoded = decoded;
        next();
    }else{
        next(new WrongAuthenticationTokenException());
    }
};
