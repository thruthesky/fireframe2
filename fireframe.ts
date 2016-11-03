/**
 * @file fireframe.ts
 * @desc To make a unified way of injecting angularfire2
 */
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Injectable()
export class Fireframe {
    constructor( public af: AngularFire ) {
        console.log('Fireframe::constructor( ) af: ', af);
    }
}