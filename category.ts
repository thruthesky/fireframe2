//import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Fireframe } from './fireframe';
import { FireframeBase } from './fireframe-base';

@Injectable()
export class Category extends FireframeBase {

    constructor( private ff: Fireframe ) {
        super( ff );
        this.path = 'category';   // @attention - ff is place holder !!
        console.log('Category::constructor() ff: ', ff);
    }

}