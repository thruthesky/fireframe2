import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { Fireframe } from './fireframe';
import { Category } from './category';
import { CategoryTest } from './test/category-test';
import { Post } from './post';
import { PostTest } from './test/post-test';

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
  providers: [ Fireframe, Category, CategoryTest, Post, PostTest ]
})
export class FireModule {}