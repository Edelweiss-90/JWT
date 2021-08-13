import {
    IsString as isString,
    Length as length,
    Matches as matches,
} from 'class-validator';


class CreateUserDto {
    @isString()
    @length(3, 15)
    public name!: string;

    @isString()
    @matches(/[0-9]/, { message: 'Password is too simple.' })
    @length(5, 15)
    public password!: string;
}

export default CreateUserDto;
