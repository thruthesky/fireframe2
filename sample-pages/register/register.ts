import { Component } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { SampleHomePage } from '../home/home';
import { User, USER_DATA } from '../../user';
import { Data, FILE_UPLOAD } from '../../data';
import { Camera } from 'ionic-native';



export interface DATA extends USER_DATA {
    name: string;
    mobile: string;
    address: string;
    urlPhoto?: string;
    refPhoto?: string;
}


@Component({
    templateUrl: 'register.html'
})
export class RegisterPage {
    userData = <DATA> {};
    loginData: USER_DATA = null;
    result = null;
    progress = null;
    error = null;
    file_progress = null;
    position = 0;
    defaultPhoto: string = "assets/images/anonymous.gif";
    urlPhoto: string = this.defaultPhoto;
    cordova: boolean = false;

    constructor( 
        private platform: Platform,
        private alertCtrl: AlertController,
        public navCtrl: NavController,
        public user: User,
        private data: Data
    ) {
        this.checkLogin();

        platform.ready().then( () => {
            if ( platform.is('cordova') ) this.cordova = true;
        });
    }
    checkLogin() {
        this.user.loggedIn( u => {
            this.loginData = u;
            this.loadUser();
        }, () => this.loginData = null );
    }
    get login() {
        return !! this.loginData;
    }
    loadUser() {
        console.log("RegisterPage::loadUser()", this.loginData);
        this.user
            .set('key', this.loginData.uid)
            .get( (user:DATA) => {
            console.log('user: ', user);
            this.userData.name = user.name;
            this.userData.mobile = user.mobile;
            this.userData.address = user.address;
            this.userData.refPhoto = user.refPhoto || null;
            this.userData.urlPhoto = user.urlPhoto || null;
            this.urlPhoto = user.urlPhoto || this.defaultPhoto;
        }, e => {
            alert( e );
        });
    }
    setError( message ) {
        this.result = null;
        this.error = message;
        this.progress = null;
    }
    setProgress( message ) {
        this.result = null;
        this.error = null;
        this.progress = message;
    }
    setResult( message ) {
        this.result = message;
        this.error = null;
        this.progress = null;
    }
    onClickRegister() {
        this.setProgress('Registraion is on going...')
        this.user.sets(this.userData).register( () => {
           this.setResult('User registration success.');
           this.checkLogin();
        }, e => this.setError( e ) );
    }
    onClickUpdate() {
        console.log('RegisterPage::onClickUpdate() : ', JSON.stringify(this.userData));
        this.setProgress('Updating ...');
        this.user
            .sets( this.userData )
            .set( 'key', this.loginData.uid )
            .update( () => {
                this.setResult('User update success.');
                this.checkLogin();
            }, e => this.setError(e) );
    }
    onClickCancel() {
        this.navCtrl.setRoot( SampleHomePage );
    }
    onClickHome() {
        this.navCtrl.setRoot( SampleHomePage );
    }
    onFileUploaded( url, ref ) {
        this.file_progress = false;
        this.urlPhoto = url;
        this.userData.urlPhoto = url;
        this.userData.refPhoto = ref;
    }
    onChangeFile(event) {
        let file = event.target.files[0];
        if ( file === void 0 ) return;
        this.file_progress = true;
        let ref = 'user-primary-photo/' + Date.now() + '/' + file.name;
        this.data.upload( { file: file, ref: ref }, uploaded => {
            this.onFileUploaded( uploaded.url, uploaded.ref );
        },
        e => {
            this.file_progress = false;
            alert(e);
        },
        percent => {
            this.position = percent;
        } );
    }
    onClickDeletePhoto() {
        this.data.delete( this.userData.refPhoto, () => {
            this.urlPhoto = null;
            this.userData.urlPhoto = null;
            this.userData.refPhoto = null;
            console.log('onClickDeletePhoto() : ', JSON.stringify(this.userData));
        }, e => {
            alert("FILE DELETE ERROR: " + e);
        } );
    }
  onClickLogout() {
    this.user.logout( () => this.checkLogin() );
  }
  onClickPhoto() {
      if ( ! this.cordova ) return;
      console.log('onClickPhoto()');
    let confirm = this.alertCtrl.create({
      title: 'PHOTO UPLOAD',
      message: 'Do you want to take photo? or choose photo from gallery?',
      cssClass: 'alert-camera-selection',
      buttons: [
        {
          text: 'Camera',
          handler: () => this.cameraTakePhoto( Camera.PictureSourceType.CAMERA )
        },
        {
          text: 'Gallery',
          handler: () => this.cameraTakePhoto( Camera.PictureSourceType.PHOTOLIBRARY )
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  cameraTakePhoto( type: number ) {
      console.log('cameraTakePhoto()');
    let options = {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: type,
        encodingType: Camera.EncodingType.JPEG,
        quality: 100
    };

    Camera.getPicture(options).then((imageData) => {
        this.file_progress = true;
        let ref = 'user-primary-photo/' + Date.now() + '/' + 'primary-photo.jpg';
        let data : FILE_UPLOAD = {
            file : {
                name: 'primary-photo.jpg',
                type: 'image/jpeg'
            },
            ref: ref,
            base64: imageData
        }
        this.data.upload( data, uploaded => {
            this.onFileUploaded( uploaded.url, uploaded.ref );
        },
        e => {
            this.file_progress = true;
            alert( e );
        },
        percent => {

        } );
    }, (err) => { alert(err); });

  }




}