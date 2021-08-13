import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
    constructor() {
        super(403, 'Wrong credentials provided');
    }
}

export default WrongCredentialsException;
