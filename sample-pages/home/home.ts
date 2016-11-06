import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { UserTest } from '../../test/user-test';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class SampleHomePage {

  constructor(public navCtrl: NavController, private userTest: UserTest ) {
    //this.navCtrl.setRoot(LoginPage);
    this.navCtrl.setRoot(RegisterPage);

//    this.userTest.test( () => {} );

  }

}
