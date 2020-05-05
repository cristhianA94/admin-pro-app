import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    ImagenPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImagenPipe
  ]
})
export class PipesModule { }
