import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../../home/home';
import { User, USER_DATA } from '../../user';


@Component({
    templateUrl: 'register.html'
})
export class RegisterPage {
    data = <USER_DATA> {};
    loginData: USER_DATA = null;
    progress = null;
    error = null;


    onClickRegister() {
        // create user
            // if ok,
                // update user information with other registration data.
    }
}