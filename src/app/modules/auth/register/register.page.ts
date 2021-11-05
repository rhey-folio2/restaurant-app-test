import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MiscService } from 'src/app/helpers/misc.service';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { AuthResponse, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private nav: NavController
    , private authService: AuthService
    , private storage: Storage
    , private loading: LoadingController
    , private toast: ToastController) { }

  public email: string;
  public password: string;
  public firstname: string;
  public lastname: string;

  ngOnInit() {

  }

  login() {
    this.nav.navigateBack(`/auth/login`)
  }

  isValid() {
    return this.email && this.password && this.firstname && this.lastname;
  }

  async register() {
    const result = await this.authService.Register({
      email: this.email,
      password: this.password,
      firstname: this.firstname,
      lastname: this.lastname
    });
    const error_result = result as GlobalErrorResponse;
    if (error_result.error) {
      let toast = await this.toast.create({
        message: error_result.message,
        duration: 2000
      });
      toast.present();
    } else {
      const response = result as AuthResponse;
      const storage = await this.storage.create();
      await storage.set(`token`, response.token);
      const loading = await this.loading.create({
        message: `Creating account, please wait...`,
        duration: 2000
      });
      loading.present();
      await MiscService.Sleep(2100);
      this.nav.navigateRoot(`/restaurants/listing`);
    }
  }

}
