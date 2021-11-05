import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMenuModalComponent } from './add-menu-modal/add-menu-modal.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  exports: [
    AddMenuModalComponent
  ],
  declarations: [
    AddMenuModalComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class ComponentsModule { }
