import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Fireframe } from './fireframe';
import { FireframeBase } from './fireframe-base';
import { FirebaseAuth, AuthProviders, AuthMethods } from 'angularfire2';

// --------------- Const ------------
export const KEY_USER_DATA = 'user.data';
// ------------------------------ INTERFACES --------------
export interface USER_DATA {
  email: string;
  password?: string;
  uid?: string;
};

@Injectable()
export class User extends FireframeBase {

    /** 'this.data' is for holding user information to create/update only.
     *  This is not for holding user login data. */
    data: USER_DATA;
    auth: FirebaseAuth;
    constructor( private storage: Storage, private ff: Fireframe ) {
        super( ff );
        this.path = 'user';   // @attention - ff is place holder !!
        this.auth = ff.auth;
        console.log('User::constructor() ff: ', ff);
    }


    /**
     * Saves user data.
     */
    setLoginData( data: USER_DATA, callback? ) {
        console.log('User::setLoginData() data : ', data);
        this.storage
            .set( KEY_USER_DATA, JSON.stringify( data ) )
            .then( callback );
    }
    /**
     * Gets user data
     */
    getLoginData( callback ) {
        this.storage
            .get( KEY_USER_DATA )
            .then( callback );
    }
    loggedIn( yesCallback, noCallback ) {
        console.log('User::loggedIn()');
        this.getLoginData( ( re ) => {
            console.log("User::loggedIn() getLoginData() callback: re: ", re);
            if ( re == null || re == '' ) return noCallback();
            try {
                let data: USER_DATA = JSON.parse( re );
                console.log('User::loggedIn()::getLoginData():: has data.', data);
                if ( data == null ) return noCallback();
                if ( data.email !== void 0 ) yesCallback( data );
                else noCallback();
            }
            catch ( e ) {
                noCallback( e );
            }
        });
    }
    logout( callbcak ) {
        this.storage
            .remove( KEY_USER_DATA )
            .then( callbcak );
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
        console.log('User::create() data: ', this.data);
        if ( this.data.email === void 0 ) return failureCallback( 'no email provided' );
        if ( this.data.password === void 0 ) return failureCallback( 'no password provided' );
        this.auth.createUser( <any> this.data )
            .then( authData => {
                console.log('User::create() success - authData: ', authData);
                this.clear();
                successCallback();
            })
            .catch( e => {
                this.clear();
                failureCallback( e );
            });
    }

    login( successCallback, failureCallback ) {
        console.log('User::login() data: ', this.data);
        if ( this.data.email === void 0 ) return failureCallback( 'no email provided' );
        if ( this.data.password === void 0 ) return failureCallback( 'no password provided' );
        this.auth.login( <any> this.data, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            })
            .then((authData) => {
                let userData = <USER_DATA> {};
                userData.email = this.data.email;
                userData.uid = authData.uid;
                this.setLoginData( userData, () => {
                    this.clear();
                    successCallback( userData );
                } );
            })
            .catch( e => {
                this.clear();
                failureCallback( e );
            } );
    }



    /**
     * Updates user profile.
     * @note if the key of user profile data on database, it create a dummy profile with the key, so the next update call will work.
     */
    update( successCallback, failureCallback ) {
        console.log('User::update()');
        this.loggedIn( ( user : USER_DATA ) => {
            let key = user.uid;
            this.set('key', key).set('uid', key);
            console.log('User::update() currentUser : ', user, key );
            this.get( key, re => { // get data to check if it exists.
                console.log('User::update() get() re: ', re);
                if ( re == null ) { // key does not exist.
                    console.log('User::update() get callback() : key does not exist');
                    super.create( re => { // create one
                        super.update( successCallback, e => failureCallback('update sync error after crate: ' + e) ); // update
                    }, e => failureCallback( 'create sysn error: ' + e) ); // sync error
                }
                else super.update( successCallback, e => failureCallback('key exists but update sysn error: ' + e) ); // key already exsit, update
            }, e => failureCallback('get sysn error: ' + e)); // sync error on getting data.
        }, () => {
            failureCallback('user not logged in');
        });
    }
    // delete

    delete( successCallback , failureCallback){
            

    }

}