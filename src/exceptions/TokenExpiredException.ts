import HttpException from './HttpException';

class UserNotFoundException extends HttpException {
    constructor() {
        super(403, 'token expired');
    }
}

export default UserNotFoundException;
