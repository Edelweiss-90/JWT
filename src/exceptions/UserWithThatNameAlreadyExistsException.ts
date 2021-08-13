import HttpException from './HttpException';

class UserWithThatNameAlreadyExistsException extends HttpException {
    constructor(name: string) {
        super(400, `User with name ${name} already exists`);
    }
}

export default UserWithThatNameAlreadyExistsException;
