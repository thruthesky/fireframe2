//  constructor(@Inject(FirebaseApp) firebaseApp: any) {


import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
@Injectable()
export class Data {
    storage: firebase.storage.Storage;
  constructor(@Inject(FirebaseApp) firebaseApp: any) {
    this.storage = firebaseApp.storage(); // storage reference
    // storageRef.getDownloadURL().then(url => this.image = url);

  }

  upload( file, successCallback: (url:string) => void, failureCallback: (error:string) => void, progressCallback?: ( percent: number ) => void ) {
    let path = Date.now() + '/' + file.name;
    let task = this.storage.ref( path )
      .put( file, {contentType: file.type});

    task.then( snapshot => {
      this.storage.ref(path).getDownloadURL().then( url => {
        successCallback( url );
      });
    })
    .catch( e => failureCallback( e.message ) );

    task.on( firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
      let percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressCallback( percent );
    });
  }
}