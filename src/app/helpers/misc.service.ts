import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor() { }

  static Sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async FileToBlob(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', _e => {
        resolve(_e.target.result);
      });
      reader.readAsText(file);
    });
  }
}
