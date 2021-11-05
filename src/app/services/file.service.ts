import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import LightningFS from '@isomorphic-git/lightning-fs';
import { environment } from 'src/environments/environment';
import { MiscService } from '../helpers/misc.service';
import { GlobalErrorResponse } from '../helpers/models';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: Storage) {
    this.fs = new LightningFS(environment.fs_name).promises;
  }
  private fs = null;

  async Upload(file: File): Promise<string | GlobalErrorResponse> {

    const storage = await this.storage.create();
    const user = await storage.get(`token`);
    const email = user.split(':')[0];
    const base_dir = `/${email}`;

    try {
      const blob = await MiscService.FileToBlob(file);
      try {
        this.fs.mkdir(`${base_dir}/assets`);
      } catch (e) {
        console.log(`user assets already exist`);
      }

      await this.fs.writeFile(`${base_dir}/assets/${file.name}`, blob);
    } catch (e) {
      console.log(`file already exists`);
    }

    try {
      const _file = await this.fs.readFile(`${base_dir}/assets/${file.name}`);
      const blob = new Blob([_file]);
      return URL.createObjectURL(file);
    } catch (e) {
      return {
        error: true
      }
    }

  }
}
