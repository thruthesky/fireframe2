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
    progress = null;
    error = null;

    constructor( 
        public navCtrl: NavController,
        public user: User
    ) {
        let id = 'user16';
        this.data.email = id + '@naver.com';
        this.data.password = id;
        this.data.name = "Name: " + id;
        this.data.mobile = "Mobile: " + id;
        this.data.address = "Adderss: " + id;
    }

    onClickRegister() {
        console.log('RegisterPage::onClickRegister() data : ', this.data);
        this.user.sets(this.data).create( () => {
            console.log("RegisterPage::onClickRegister() create OK: this.data: ", this.data);
            this.user.sets(this.data).login( userData => {
                console.log('login ok: Data from Stroage: ', userData);
                this.data.uid = userData.uid;
                delete this.data.password;
                console.log("RegisterPage::onClickRegister() login OK: this.data: ", this.data);
                this.user.sets(this.data).update( () => {
                    console.log('User update success');
                }, e => {
                    alert('User update error: ' + e );
                })
            }, e => {
                alert('User Login ERROR: ' + e);
            })
        }, e => {
            alert('User Registration ERROR: ' + e);
        });

        // create user
            // if ok,
                // update user information with other registration data.
    }
}