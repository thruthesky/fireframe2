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
  apiKey: "AIzaSyAMi-uW1xDYaKQj8U2M_DVJ-9ORHzdj-yo",
    authDomain: "test-ad670.firebaseapp.com",
    databaseURL: "https://test-ad670.firebaseio.com",
    storageBucket: "test-ad670.appspot.com",
    messagingSenderId: "441630744163"

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