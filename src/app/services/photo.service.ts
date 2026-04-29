import { Injectable } from '@angular/core';

import { Camera, CameraDirection } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];

  // Chiave per reperire la collezione di foto in localstorage
  private PHOTO_STORAGE: string = 'photos';

  public async addNewToGallery() {
    // Scattiamo una foto
    const capturedPhoto = await Camera.takePhoto({
      cameraDirection: CameraDirection.Front,
      quality: 100
    })

    const savedImageFile = await this.savePicture(capturedPhoto.webPath!);

    // Memorizziamo la foto scattata 
    // (unshift è come push, ma aggiunge il nuovo elemento all'inizio dell'array)
    this.photos.unshift(savedImageFile);

    //console.log(this.photos);

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(webPath: string) {
    const response = await fetch(webPath!);
    const blob = await response.blob();
    const base64Data = (await this.convertBlobToBase64(blob)) as string;

    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: webPath
    }
  }

  private convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const { value: photoList } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

    // CHANGE: Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}