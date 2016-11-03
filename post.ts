//import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Fireframe } from './fireframe';
import { FireframeBase } from './fireframe-base';

@Injectable()
export class Post extends FireframeBase {

    constructor( private ff: Fireframe ) {
        super( ff );
        this.path = 'post';   // @attention - ff is place holder !!
        console.log('Post::constructor() ff: ', ff);
    }



}