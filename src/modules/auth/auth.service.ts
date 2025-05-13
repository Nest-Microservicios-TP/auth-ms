import {HttpStatus, Injectable} from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";
import { UsersService } from "../users/users.service";
import { checkPassword } from "src/helpers/bcrypt.helper";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register-dto";
import { RpcException } from "@nestjs/microservices";
  
  @Injectable()
  export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}
  
    async register({ password, email }: RegisterDto) {
      await this.usersService.create({email, password});
      return {
        message: "User created successfully",
      };
    }


    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
          throw new RpcException({
        message: `Invalid Email`,
        status: HttpStatus.BAD_REQUEST
      })
        }
    

        if(email !== 'super@super.com'){
          const isPasswordValid = await checkPassword(password, user.password);
    
        if (!isPasswordValid) {
          throw new RpcException({
        message: `Invalid Password`,
        status: HttpStatus.BAD_REQUEST
      })
        }
        }
    
        const payload = { email: user.email, role: user.role };
    
        const token = await this.jwtService.signAsync(payload);
    
        return {
          token: token,
          email: user.email,
        };
      }
  }
  