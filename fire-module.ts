import { NgModule } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { Fireframe } from './fireframe';
import { Category } from './category';
import { CategoryTest } from './test/category-test';
import { Post } from './post';
import { PostTest } from './test/post-test';
import { User } from './user';
import { UserTest } from './test/user-test';

/**
 * Withcenter Dev Team Open Account.
 * 
 * @warning Do not change this unless you have right reason.
 */
let firebaseConfig = {
    apiKey: "AIzaSyD_qAm3uzodD-Ea_hoDw_Dr0daMOcAi9uQ",
    authDomain: "ionicafire2-2d83c.firebaseapp.com",
    databaseURL: "https://ionicafire2-2d83c.firebaseio.com",
    storageBucket: "ionicafire2-2d83c.appspot.com",
    messagingSenderId: "107650475664"
};


@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [
    Storage,
    Fireframe, Category, User, Post,
    CategoryTest, PostTest, UserTest
   ]
})
export class FireModule {}