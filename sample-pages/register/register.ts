import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SampleHomePage } from '../home/home';
import { User, USER_DATA } from '../../user';
import { Data } from '../../data';


export interface DATA extends USER_DATA {
    name: string;
    mobile: string;
    address: string;
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
    position = 0;
    urlPhoto;

    constructor( 
        public navCtrl: NavController,
        public user: User,
        private data: Data
    ) {
        this.checkLogin();
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
            .get( (user) => {
            console.log('user: ', user);
            this.userData.name = user.name;
            this.userData.mobile = user.mobile;
            this.userData.address = user.address;
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
        console.log('RegisterPage::onClickUpdate() : ', this.userData);
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
    onFileChange(event) {
        this.data.upload( event.target.files[0], url => {
            this.urlPhoto = url;
        },
        e => alert(e),
        percent => {
            this.position = percent;
        } );
    }
}