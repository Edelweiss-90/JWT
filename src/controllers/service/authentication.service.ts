import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; 

import DataStoredInToken from '../../interfaces/dataStoredInToken.interface';
import RefrashToken from './refreshToken.interface';
import User from '../user/user.interface';

import TokenExpiredException from '../../exceptions/TokenExpiredException';

import userModel from './../user/user.model';
import tokenModel from './refreshTokenModel';

class AuthService {
  public user = userModel;
  public token = tokenModel;
  private jwtExpiration = 3600;
  private jwtRefreshExpiration = 86400;

  public createAllTokens = async (user: User): Promise<Record<string, string>> => {
      const accessToken = this.createAccessToken(user.id);
      const refreshToken = await this.createRefreshToken(user.id);

      return {accessToken, refreshToken};
  }

  public deleteAndCreateAllTokens = async (Token: RefrashToken): Promise<Record<string, string>> => {
      await this.token.findOneAndDelete({ token: Token.token });
      const accessToken = this.createAccessToken(Token.id);
      const refreshToken = await this.createRefreshToken(Token.id);

      return {accessToken, refreshToken};
  }

  public checkRefreshTokenDate = async (Token: RefrashToken): Promise<void> => {
      if(Token.date < new Date().getTime()){
          await this.token.findOneAndDelete({ token: Token.token });
          throw new TokenExpiredException();
      }
  }

  private createAccessToken = (id: number): string => {
      const expiresIn = this.jwtExpiration;
      const secret = process.env.JWT_SALT;
      const dataStoredInToken: DataStoredInToken = {
          id: id,
      };
      return jwt.sign(dataStoredInToken, secret as string, { expiresIn });
  }

  private createRefreshToken = async (id: number): Promise<string> => {
      const refreshToken = uuidv4();
      const expiredAt = new Date();
      expiredAt.setSeconds(
          expiredAt.getSeconds() + this.jwtRefreshExpiration
      );

      await this.token.create({
          token: refreshToken,
          id: id,
          date: expiredAt,
      });
    
      return refreshToken;
  }
}

export default AuthService;
