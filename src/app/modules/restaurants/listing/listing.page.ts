import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { MiscService } from 'src/app/helpers/misc.service';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { Restaurant, RestaurantService } from 'src/app/services/restaurant.service';
import { AddRestaurantModalComponent } from './components/add-restaurant-modal/add-restaurant-modal.component';
import { findIndex } from 'underscore';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class ListingPage implements OnInit {

  constructor(private modal: ModalController
    , private nav: NavController
    , private storage: Storage
    , private domSanitizer: DomSanitizer
    , private loading: LoadingController
    , private alert: AlertController
    , private restaurantService: RestaurantService) { }

  public restaurants: Array<Restaurant> = [];
  ngOnInit() {
    this.init();
  }

  async init(){
    const restaurants = await this.restaurantService.GetListing();
    const restaurants_error = restaurants as GlobalErrorResponse;
    if(!restaurants_error.error){
      this.restaurants = restaurants as Array<Restaurant>;
    }
  }

  async add(){
    const modal = await this.modal.create({
      component: AddRestaurantModalComponent
    });
    modal.present();

    const result = await modal.onDidDismiss();
    if(result.data){
      await this.restaurantService.Save(result.data);
      this.init();
    }
  }

  view(item: Restaurant){
    this.nav.navigateForward(`/restaurants/menus/${item.id}`);
  }

  async edit(item: Restaurant, e: any){
    e.stopPropagation();
    const modal = await this.modal.create({
      component: AddRestaurantModalComponent,
      componentProps: item
    });
    modal.present();

    const result = await modal.onDidDismiss();
    if(result.data){
      await this.restaurantService.Save(result.data);
      this.init();
    }
  }

  async remove(item: Restaurant, e: any){
    e.stopPropagation();
    const alert = await this.alert.create({
      header: `Remove Restaurant`,
      message: `You are about to remove restaurant, Do you want to continue ?`,
      buttons: [
        {
          text: `Cancel`
        },
        {
          text: `Remove`,
          handler: async ()=>{
            const result = await this.restaurantService.Remove(item.id);
            const result_error = result as GlobalErrorResponse;
            if(!result_error.error){
              const index = findIndex(this.restaurants, _item=>{
                return item.id === _item.id
              });
              if(index > -1){
                this.restaurants.splice(index, 1);
              }
            }
          }
        }
      ]
    });
    alert.present();
  }

  sanitize(url: string){
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url as string);
  }

  async logout(){
    const storage = await this.storage.create();
    await storage.clear();
    const loading = await this.loading.create({
      message: `Logging out, please wait...`
    });
    loading.present();
    await MiscService.Sleep(1000);
    loading.dismiss();
    this.nav.navigateRoot(`/auth/login`);
  }
}
