import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { HttpService } from '@nestjs/axios';
import { URLSearchParams } from 'url';
import { firstValueFrom } from 'rxjs';
import { SignInDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  private _baseUrl: string;

  constructor(private readonly _http: HttpService) {
    this._baseUrl = `${process.env.KEYCLOAK_URL}`;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  async signIn(signInDto: SignInDto) {
    const { password, username } = signInDto;
    const url = `${this._baseUrl}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const data = new URLSearchParams();
    data.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
    data.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
    data.append('grant_type', 'password');
    data.append('username', username);
    data.append('password', password);
    try {
      const res = await firstValueFrom(
        this._http.post(url, data.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      return res.data;
    } catch (error) {
      console.log(
        '🚀 ~ file: auth.service.ts:46 ~ AuthService ~ signIn ~ error:',
        error
      );
      throw error;
    }
  }

  signOut() {
    return `This action returns all auth`;
  }

  async userInfo() {
    const url = `${this._baseUrl}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;

    return 'hello';
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
