import { Injectable } from '@angular/core';
import { Camera, CameraDirection } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos:UserPhoto[] = [];
  
  public async addNewToGallery(){
    // Scattiamo una foto
    const capturedPhoto = await Camera.takePhoto({
      cameraDirection: CameraDirection.Front,
      quality: 100
    })

    // Memorizziamo la foto scattata 
    // (unshift è come push, ma aggiunge il nuovo elemento all'inizio dell'array)
    this.photos.unshift({
      filepath: "",
      webviewPath: capturedPhoto.webPath
    })

    console.log(this.photos);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}