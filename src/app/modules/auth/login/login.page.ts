import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MiscService } from 'src/app/helpers/misc.service';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { AuthResponse, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private nav: NavController
    , private toast: ToastController
    , private storage: Storage
    , private loading: LoadingController
    , private authService: AuthService) { }
  public email: string;
  public password: string;

  ngOnInit() {

  }

  isValid(){
    return this.email && this.password;
  }

  register(){
    this.nav.navigateForward(`/auth/register`)
  }

  async login(){
    const result = await this.authService.Login({
      email: this.email,
      password: this.password
    });
    const result_error = result as GlobalErrorResponse;
    if(!result_error.error){
      const response = result as AuthResponse;
      const storage = await this.storage.create();
      await storage.set(`token`, response.token);
      const loading = await this.loading.create({
        message: `Logging in, please wait...`,
        duration: 1000
      });
      loading.present();
      await MiscService.Sleep(1000);
      this.nav.navigateRoot(`/restaurants/listing`);
    }else{
      const toast = await this.toast.create({
        message: result_error.message,
        duration: 1000
      });
      toast.present();
    }
  }  
}
