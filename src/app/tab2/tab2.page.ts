import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonImg, IonCol, IonRow, IonIcon, IonFabButton, IonFab, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid]
})
export class Tab2Page {

  public photoService: PhotoService = inject(PhotoService);

  constructor() {
    addIcons({ camera });
  }

  ngOnInit() {
    this.photoService.loadSaved();
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
