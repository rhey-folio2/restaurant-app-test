import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import LightningFS from '@isomorphic-git/lightning-fs';
import { environment } from 'src/environments/environment';
import { GlobalErrorResponse } from '../helpers/models';
import { findIndex, findWhere } from 'underscore';

interface Restaurant {
  id?: number,
  name: string,
  address: string,
  description: string,
  image_url: string
}

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(private storage: Storage) {
    this.fs = new LightningFS(environment.fs_name).promises;
  }
  private fs = null;

  async Save(restaurant: Restaurant): Promise<Restaurant | GlobalErrorResponse> {
    try {
      const storage = await this.storage.create();
      const user = await storage.get(`token`);
      const email = user.split(':')[0];
      const base_dir = `/${email}`;

      let restaurants: Array<Restaurant> = [];

      try {
        restaurants = await this.fs.readFile(`${base_dir}/restaurants.json`);
      } catch (e) {
        console.log(`no restaurants.json yet`)
      }

      if (restaurant.id) {
        let index = findIndex(restaurants, item => {
          return item.id === restaurant.id
        });
        console.log(restaurants, index, restaurant)
        if (index > -1) {
          restaurants[index] = restaurant;
        } else {
          restaurants.push(restaurant);
        }
      } else {
        restaurant.id = new Date().getTime();
        restaurants.push(restaurant);
      }
      await this.fs.writeFile(`${base_dir}/restaurants.json`, restaurants, {
        encoding: `utf8`
      });
      return restaurant;
    } catch (e) {
      return {
        error: true
      }
    }
  }

  async GetListing(): Promise<Array<Restaurant> | GlobalErrorResponse> {
    try {
      const storage = await this.storage.create();
      const user = await storage.get(`token`);
      const email = user.split(':')[0];
      const base_dir = `/${email}`;
      const restaurants: Array<Restaurant> = await this.fs.readFile(`${base_dir}/restaurants.json`);
      return restaurants;
    } catch (e) {
      return {
        error: true
      }
    }
  }

  async Get(id: number): Promise<Restaurant | GlobalErrorResponse> {
    try {
      const storage = await this.storage.create();
      const user = await storage.get(`token`);
      const email = user.split(':')[0];
      const base_dir = `/${email}`;
      const restaurants: Array<Restaurant> = await this.fs.readFile(`${base_dir}/restaurants.json`);
      return findWhere(restaurants, {
        id: id
      });
    } catch (e) {
      return {
        error: true
      }
    }
  }

  async Remove(id: number): Promise<Boolean | GlobalErrorResponse> {
    const storage = await this.storage.create();
    const user = await storage.get(`token`);
    const email = user.split(':')[0];
    const base_dir = `/${email}`;

    const restaurants: Array<Restaurant> = await this.fs.readFile(`${base_dir}/restaurants.json`);

    const index = findIndex(restaurants, item => {
      return item.id === id;
    });
    if (index > -1) {
      restaurants.splice(index, 1);
      await this.fs.writeFile(`${base_dir}/restaurants.json`, restaurants, {
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
  Restaurant
}