import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SampleHomePage } from '../home/home';
import { User, USER_DATA } from '../../user';

export interface DATA extends USER_DATA {
    name: string;
    mobile: string;
    address: string;
}

@Component({
    templateUrl: 'register.html'
})
export class RegisterPage {
    data = <DATA> {};
    loginData: USER_DATA = null;
    result = null;
    progress = null;
    error = null;

    constructor( 
        public navCtrl: NavController,
        public user: User
    ) {
        this.checkLogin();
        let id = 'user24';
        this.data.email = id + '@naver.com';
        this.data.password = id;
        this.data.name = "Name: " + id;
        this.data.mobile = "Mobile: " + id;
        this.data.address = "Adderss: " + id;
    }
    checkLogin() {
        this.user.loggedIn( u => this.loginData = u, () => this.loginData = null );
    }
    get login() {
        return !! this.loginData;
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
        this.user.sets(this.data).register( () => {
           this.setResult('User registration success.');
           this.checkLogin();
        }, e => this.setError( e ) );
    }
    onClickUpdate() {

    }

    onClickCancel() {
        this.navCtrl.setRoot( SampleHomePage );
    }
    onClickHome() {
        this.navCtrl.setRoot( SampleHomePage );
    }
}