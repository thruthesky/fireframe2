import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SampleHomePage } from '../home/home';
import { User } from '../../user';
@Component({
  selector: 'resign-home',
  templateUrl: 'resign.html'
})
export class ResignPage {
    login;
    constructor( private navCtrl: NavController, private user: User ) {

    }
    onClickHome() {
      this.navCtrl.setRoot( SampleHomePage );
    }
}