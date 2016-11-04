import { Injectable } from '@angular/core';
import { Fireframe } from './fireframe';
import { FireframeBase } from './fireframe-base';
import { FirebaseAuth, AuthProviders, AuthMethods } from 'angularfire2';
@Injectable()
export class User extends FireframeBase {

    auth: FirebaseAuth;
    currentUser;
    constructor( private ff: Fireframe ) {
        super( ff );
        this.path = 'user';   // @attention - ff is place holder !!
        this.auth = ff.auth;
        console.log('User::constructor() ff: ', ff);
    }



    /**
     * returns firebase.User or null
     */
    current() {
        return this.currentUser;
    }
    logged() {
        return !! this.current();
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
        this.auth.createUser( this.data )
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
        this.auth.login( this.data, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            })
            .then((authData) => {
                this.clear();
                this.currentUser = authData;
                successCallback( authData );
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
        let user = this.current();
        if ( ! user ) return failureCallback('user not logged ini');
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
    }
    // delete

    delete( successCallback , failureCallback){
            

    }

}