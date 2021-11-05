import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { GlobalErrorResponse } from 'src/app/helpers/models';
import { FileService } from 'src/app/services/file.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-menu-modal',
  templateUrl: './add-menu-modal.component.html',
  styleUrls: ['./add-menu-modal.component.scss'],
})
export class AddMenuModalComponent implements OnInit {

  constructor(private modal: ModalController
    , private domSanitizer: DomSanitizer
    , private fileService: FileService) { }

  public id: number;
  public name: string;
  public price: number;
  public description: string;
  public restaurant_id: number;
  public image_url: string;

  ngOnInit() { }

  save() {
    this.modal.dismiss({
      id: this.id,
      name: this.name,
      price: this.price,
      description: this.description,
      restaurant_id: this.restaurant_id,
      image_url: this.image_url
    });
  }

  isValid(){
    return this.name && this.description && this.image_url;
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

  close() {
    this.modal.dismiss();
  }

}
