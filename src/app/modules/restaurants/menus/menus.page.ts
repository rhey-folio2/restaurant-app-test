import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { Menu, MenuService } from 'src/app/services/menu.service';
import { Restaurant, RestaurantService } from 'src/app/services/restaurant.service';
import { AddRestaurantModalComponent } from '../listing/components/add-restaurant-modal/add-restaurant-modal.component';
import { AddMenuModalComponent } from './components/add-menu-modal/add-menu-modal.component';
import { findIndex } from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.page.html',
  styleUrls: ['./menus.page.scss'],
})
export class MenusPage implements OnInit {

  constructor(private route: ActivatedRoute
    , private alert: AlertController
    , private menuService: MenuService
    , private domSanitizer: DomSanitizer
    , private modal: ModalController
    , private restaurantService: RestaurantService) { }

  public restaurant: Restaurant;
  public menus: Array<Menu> = [];
  public is_ready: boolean;

  ngOnInit() {
    this.init();
  }

  async init() {
    const id = this.route.snapshot.paramMap.get('id');
    const restaurant = await this.restaurantService.Get(parseInt(id));
    const restaurant_error = restaurant as GlobalErrorResponse;
    if (!restaurant_error.error) {
      this.restaurant = restaurant as Restaurant;

      const menus = await this.menuService.GetByRestaurant(parseInt(id));
      const menus_error = menus as GlobalErrorResponse;
      if (!menus_error.error) {
        this.menus = menus as Array<Menu>;
      }
    }

    this.is_ready = true;
  }

  async add() {
    const modal = await this.modal.create({
      component: AddMenuModalComponent,
      componentProps: {
        restaurant_id: this.restaurant.id
      }
    });
    modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      const data = result.data as Menu;
      const menu = await this.menuService.Save(data);
      this.menus.push(menu as Menu);
    }
  }

  async edit(item: Menu, e: any) {
    e.stopPropagation();
    const modal = await this.modal.create({
      component: AddMenuModalComponent,
      componentProps: item
    });
    modal.present();
    const result = await modal.onDidDismiss();
    if (result.data) {
      const data = result.data as Menu;
      const menu = await this.menuService.Save(data) as Menu;
      const index = findIndex(this.menus, _item => {
        return _item.id === menu.id;
      });
      console.log(this.menus, menu, index);
      if(index > -1){
        this.menus[index] = menu;
      }
    }
  }

  async remove(item: Menu, e: any){
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
            const result = await this.menuService.Remove(this.restaurant.id, item.id);
            const result_error = result as GlobalErrorResponse;
            if(!result_error.error){
              const index = findIndex(this.menus, _item=>{
                return item.id === _item.id
              });
              if(index > -1){
                this.menus.splice(index, 1);
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

}
