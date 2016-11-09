//  constructor(@Inject(FirebaseApp) firebaseApp: any) {
import { Inject, Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
export interface FILE_UPLOAD {
  file: any;
  ref?: string;
}
export interface FILE_UPLOADED {
  url: string;
  ref: string;
}
@Injectable()
export class Data {
    storage: firebase.storage.Storage;
  constructor(@Inject(FirebaseApp) firebaseApp: any) {
    this.storage = firebaseApp.storage(); // storage reference
    // storageRef.getDownloadURL().then(url => this.image = url);

  }

  upload( data: FILE_UPLOAD, successCallback: (uploaded:FILE_UPLOADED) => void, failureCallback: (error:string) => void, progressCallback?: ( percent: number ) => void ) {
    if ( data.ref === void 0 ) data.ref = Date.now() + '/' + data.file.name;
    let task = this.storage.ref( data.ref )
      .put( data.file, {contentType: data.file.type});

    task.then( snapshot => {
      this.storage.ref( data.ref ).getDownloadURL().then( url => {
        let uploaded = { url: url, ref: data.ref };
        successCallback( uploaded );
      });
    })
    .catch( e => failureCallback( e.message ) );

    task.on( firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
      let percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      progressCallback( percent );
    });
  }

  delete( ref: string, successCallback: () => void, failureCallback: (error:string) => void ) {
    console.log('delete() ref: ', ref);
    this.storage.ref().child( ref )
      .delete()
      .then( successCallback )
      .catch( e => {
        failureCallback( e.message );
    });
  }
}