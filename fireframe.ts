/**
 * @file fireframe.ts
 * @desc To make a unified way of injecting angularfire2
 */
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuth } from 'angularfire2';

@Injectable()
export class Fireframe {
    constructor( public af: AngularFire, public auth: FirebaseAuth ) {
        console.log('Fireframe::constructor( ) af: ', af);
    }
}