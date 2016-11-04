import { Injectable } from '@angular/core';
import { Fireframe } from './fireframe';
import { FireframeBase } from './fireframe-base';
import { FirebaseAuth, AuthProviders } from 'angularfire2';

@Injectable()
export class User extends FireframeBase {

    auth: FirebaseAuth;
    constructor( private ff: Fireframe ) {
        super( ff );
        this.auth = ff.auth;
        console.log('User::constructor() ff: ', ff);
    }

    set( key:string, value:string) : User {
        super.set( key, value );
        return this;
    }
    sets( data ) : User {
        super.sets( data );
        return this;
    }
    create( successCallback, failureCallback ) {
        if ( this.data.email === void 0 ) return failureCallback( 'no email provided' );
        if ( this.data.password === void 0 ) return failureCallback( 'no password provided' );
        this.auth.createUser( this.data )
            .then( authData => {
                console.log('User::create() success - authData: ', authData);
                successCallback();
            })
            .catch( e => failureCallback( e ));
    }


    // update
    // delete
    // add more information like phone number, address, birth year/month/day, gender, etc...

}