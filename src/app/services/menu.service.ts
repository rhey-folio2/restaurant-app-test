import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import LightningFS from '@isomorphic-git/lightning-fs';
import { environment } from 'src/environments/environment';
import { GlobalErrorResponse } from '../helpers/models';
import { findIndex, findWhere } from 'underscore';

interface Menu {
  id?: number,
  name: string,
  price: number,
  description: string,
  restaurant_id: number,
  image_url: string
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private storage: Storage) {
    this.fs = new LightningFS(environment.fs_name).promises;
  }
  private fs = null;

  async Save(menu: Menu): Promise<Menu | GlobalErrorResponse> {
    try{
      const storage = await this.storage.create();
      const user = await storage.get(`token`);
      const email = user.split(':')[0];
      const base_dir = `/${email}`;

      let menus: Array<Menu> = [];

      try {
        menus = await this.fs.readFile(`${base_dir}/menus-${menu.restaurant_id}.json`);
      } catch (e) {
        console.log(`no menus-${menu.restaurant_id}.json yet`)
      }
      if (menu.id) {
        let index = findIndex(menus, item => {
          return item.id === menu.id
        });
        if (index > -1) {
          menus[index] = menu;
        } else {
          menus.push(menu);
        }
      } else {
        menu.id = new Date().getTime();
        menus.push(menu);
      }

      await this.fs.writeFile(`${base_dir}/menus-${menu.restaurant_id}.json`, menus, {
        encoding: `utf8`
      });
      return menu;

    }catch(e){
      return {
        error: true
      }
    }
  }

  async GetByRestaurant(id: number): Promise<Array<Menu> | GlobalErrorResponse> {
    try {
      const storage = await this.storage.create();
      const user = await storage.get(`token`);
      const email = user.split(':')[0];
      const base_dir = `/${email}`;
      const menus: Array<Menu> = await this.fs.readFile(`${base_dir}/menus-${id}.json`);
      return menus;
    } catch (e) {
      return {
        error: true
      }
    }
  }

  async Remove(restaurant_id: number,id: number): Promise<Boolean | GlobalErrorResponse> {
    const storage = await this.storage.create();
    const user = await storage.get(`token`);
    const email = user.split(':')[0];
    const base_dir = `/${email}`;

    const menus: Array<Menu> = await this.fs.readFile(`${base_dir}/menus-${restaurant_id}.json`);

    const index = findIndex(menus, item => {
      return item.id === id;
    });
    if (index > -1) {
      menus.splice(index, 1);
      await this.fs.writeFile(`${base_dir}/menus-${restaurant_id}.json`, menus, {
        encoding: `utf8`
      });
      return true;
    } else {
      return {
        error: true
      }
    }
  }

}


export {
  Menu
}