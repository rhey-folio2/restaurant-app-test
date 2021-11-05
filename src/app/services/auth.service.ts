import { Injectable } from '@angular/core';
import LightningFS from '@isomorphic-git/lightning-fs';
import { environment } from 'src/environments/environment';
import md5 from 'md5.js';
import { GlobalErrorResponse } from '../helpers/models';

interface User {
  email: string,
  password: string,
  firstname?: string,
  lastname?: string
}

interface AuthResponse {
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { 
    this.fs = new LightningFS(environment.fs_name).promises;
  }
  private fs = null;

  async Login(user: User): Promise<AuthResponse | GlobalErrorResponse> {
    const hash_password = new md5().update(user.password).digest('hex');
    const base_dir = `/${user.email}`;
    try{
        const user: User = await this.fs.readFile(`${base_dir}/users.json`);
        if(user.password === hash_password){
          return {
            token: `${user.email}:${hash_password}`
          }
        }else{
          return {
            error: true,
            message: `Login failed, please try again`
          }
        }
    }catch(e){
      return {
        error: true,
        message: `Login failed, please try again`
      }
    }
  }

  async Register(user: User): Promise<AuthResponse | GlobalErrorResponse> {
    const hash_password = new md5().update(user.password).digest('hex');
    const base_dir = `/${user.email}`;
    try {
      await this.fs.mkdir(base_dir);
      await this.fs.writeFile(`${base_dir}/users.json`, {
        email: user.email,
        password: hash_password,
        firstname: user.firstname,
        lastname: user.lastname
      }, {
        encoding: `utf8`
      });
      return {
        token: `${user.email}:${hash_password}`
      }
    } catch (e) {
      return {
        error: true,
        message: `Account already exists, please login instead`
      }
    }
  }
}

export {
  AuthResponse,
  User
}