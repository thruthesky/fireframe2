import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { ResignPage } from '../resign/resign';
import { User, USER_DATA } from '../../user';
import { UserTest } from '../../test/user-test';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class SampleHomePage {
    loginData: USER_DATA = null;

  constructor(
      public navCtrl: NavController,
      private user: User,
      private userTest: UserTest ) {
//    this.navCtrl.setRoot(LoginPage);
//     this.navCtrl.setRoot(RegisterPage);
      //this.navCtrl.setRoot(ResignPage);

//    this.userTest.test( () => {} );
//this.loginPage = LoginPage;
    

    user.loggedIn( u => this.loginData = u, () => this.loginData = null );
  }
  get login() {
      return !! this.loginData;
  }
  onClickLogout() {
    this.user.logout( () => this.loginData = null );
  }
  onClickLogin() {
      this.navCtrl.setRoot( LoginPage );
  }
  onClickRegister() {
      this.navCtrl.setRoot( RegisterPage );
  }
  onClickProfile() {
      this.navCtrl.setRoot( RegisterPage );
  }
  onClickResign() {
      this.navCtrl.setRoot( ResignPage );
  }

}
