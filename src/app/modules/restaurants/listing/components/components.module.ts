import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRestaurantModalComponent } from './add-restaurant-modal/add-restaurant-modal.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  exports: [
    AddRestaurantModalComponent
  ],
  declarations: [
    AddRestaurantModalComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class ComponentsModule { }
