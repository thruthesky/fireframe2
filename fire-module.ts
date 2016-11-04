import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { Fireframe } from './fireframe';
import { Category } from './category';
import { CategoryTest } from './test/category-test';
import { Post } from './post';
import { PostTest } from './test/post-test';
import { User } from './user';
import { UserTest } from './test/user-test';

let firebaseConfig = {
    apiKey: "AIzaSyDgVNWHWVRogTbKvTftNoNv7cSmtFaAfz0",
    authDomain: "fir-app-f2d67.firebaseapp.com",
    databaseURL: "https://fir-app-f2d67.firebaseio.com",
    storageBucket: "fir-app-f2d67.appspot.com",
    messagingSenderId: "552188619868"
};


@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [ Fireframe, Category, User, CategoryTest, Post, PostTest, UserTest ]
})
export class FireModule {}