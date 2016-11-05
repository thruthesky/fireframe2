import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../../pages/home/home';
import { RegisterPage } from '../register/register';
import { User, USER_DATA } from '../../user';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  data = <USER_DATA> {};
  loginData: USER_DATA = null;
  progress = null;
  error = null;
  constructor(
    public navCtrl: NavController,
    private user: User
    ) {
      console.log('LoginPage::constructor()');

      this.checkUserLogin();
  }

  checkUserLogin() {
      this.user.loggedIn( ( user: USER_DATA ) => {
        console.log('Yes, user has logged in as : ' + user.email );
        this.loginData = user;
      }, () => {
        console.log('No, user not logged in');
        this.loginData = null;
      });
  }
  ionViewDidLoad() {
  }

  onClickHome() {
    this.navCtrl.setRoot( HomePage );
  }

  onClickLogin() {
    console.log('onClickLogin()');
    this.progress = "Connecting to server ...";
    this.error = null;
    this.user
      .set('email', this.data.email)
      .set('password', this.data.password)
      .login( re => {
        console.log('login success : user has logged in? re: ', re);
        this.progress = null;
        this.checkUserLogin();
      }, e => {
        // alert( 'Login Error: ' + e );
        this.progress = null;
        this.error = e;
      } );
  }
  onClickLogout() {
    this.user.logout( () => this.checkUserLogin() );
  }
  onClickRegister() {
    console.log('onClickRegister()');
    this.navCtrl.setRoot( RegisterPage );
  }

}
