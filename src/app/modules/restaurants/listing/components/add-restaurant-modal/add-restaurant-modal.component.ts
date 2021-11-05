import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { MiscService } from 'src/app/helpers/misc.service';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-add-restaurant-modal',
  templateUrl: './add-restaurant-modal.component.html',
  styleUrls: ['./add-restaurant-modal.component.scss'],
})
export class AddRestaurantModalComponent implements OnInit {

  constructor(private modal: ModalController
    , private fileService: FileService
    , private domSanitizer: DomSanitizer) { }
    
  public id: number;
  public name: string;
  public address: string;
  public description: string;
  public image_url: any;

  ngOnInit() {

  }

  isValid(){
    return this.name && this.address && this.description && this.image_url;
  }

  save(){
    this.modal.dismiss({
      name: this.name,
      address: this.address,
      description: this.description,
      id: this.id,
      image_url: this.image_url
    });
  }

  upload(){
    $('.file-input').click();
  }

  async onFileUpload(e){
    if(e.target.files.length > 0){
      const file = e.target.files[0];

      const upload = await this.fileService.Upload(file);
      const upload_error = upload as GlobalErrorResponse;
      if(!upload_error.error){
        this.image_url = upload as string;
      }
    }
  }

  sanitize(url: string){
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url as string);
  }

  close(){
    this.modal.dismiss();
  }

}
