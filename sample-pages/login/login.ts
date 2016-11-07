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
      this.checkLogin();
  }
  get login() {
    return !! this.loginData;
  }
  checkLogin() {
      this.user.loggedIn( u => this.loginData = u, () => this.loginData = null );
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
        this.checkLogin();
      }, e => {
        // alert( 'Login Error: ' + e );
        this.progress = null;
        this.error = e;
      } );
  }
  onClickLogout() {
    this.user.logout( () => this.checkLogin() );
  }
  onClickRegister() {
    console.log('onClickRegister()');
    this.navCtrl.setRoot( RegisterPage );
  }

}
