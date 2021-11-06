import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage
    , private nav: NavController){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.isLogin();
  }

  async isLogin(){
    const storage = await this.storage.create();
    const token = await storage.get(`token`);
    if(token){
      return true;
    }else{
      this.nav.navigateRoot(`/auth/login`);
      return false;
    }
  }
  
}
