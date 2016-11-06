import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../../home/home';
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
        let id = 'user17';
        this.data.email = id + '@naver.com';
        this.data.password = id;
        this.data.name = "Name: " + id;
        this.data.mobile = "Mobile: " + id;
        this.data.address = "Adderss: " + id;
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
        console.log('RegisterPage::onClickRegister() data : ', this.data);
        this.setProgress('Registraion is on going...')
        this.user.sets(this.data).create( () => {
            console.log("RegisterPage::onClickRegister() create OK: this.data: ", this.data);
            this.user.sets(this.data).login( userData => {
                console.log('login ok: Data from Stroage: ', userData);
                this.data.uid = userData.uid;
                delete this.data.password;
                console.log("RegisterPage::onClickRegister() login OK: this.data: ", this.data);
                this.user.sets(this.data).update( () => {
                    console.log('User update success');
                    this.setResult('User registration success.');
                }, e => {
                    //alert('User update error: ' + e );
                    this.setError(e);
                })
            }, e => {
                //alert('User Login ERROR: ' + e);
                this.setError(e);
            })
        }, e => {
            //alert('User Registration ERROR: ' + e);
            this.setError(e);
        });

    }
    onClickCancel() {
        this.navCtrl.setRoot( HomePage );
    }
}