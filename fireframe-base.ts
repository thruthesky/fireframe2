/**
 * 
 * @Injectable() class cannot (or may not) be extendend.
 * Category, post and other classes need a parent class to extend to share common code.
 * And this is why we have FireframeBase.
 * It is more likely a proxy between fireframe and indivisual classes.
 */
import {
    AngularFire, FirebaseObjectObservable, FirebaseListObservable,
    } from 'angularfire2';
import { Fireframe } from './fireframe';
export class FireframeBase {
    private f: Fireframe;
    private af: AngularFire;
    public __path: string;
    private object: FirebaseObjectObservable<any>;
    private list: FirebaseListObservable<any>;
    data: any = {};
    constructor( fireframe ) {
        this.f = fireframe;
        this.af = this.f.af;
        console.log('FireframeBase::constructor( ) ');
    }
    get path() {
        return this.__path;
    }
    set path( path: string ) {
        this.__path = path;
        this.list = this.af.database.list('/' + path);
        this.object = this.af.database.object('/' + path);
    }
    set( key:string, value:string) : FireframeBase {
        this.data[ key ] = value;
        return this;
    }
    sets( data ) : FireframeBase {
        this.data = data;
        return this;
    }
    clear() {
        this.data = {};
        return this;
    }

    /**
     * 
     */
    create( successCallback, failureCallback ) {

        let data = this.data;
        if ( data.key === void 0 ) { // push the data ( push a key and then set )
            this.list
                .push( data )
                .then( () => { this.clear(); successCallback(); } )
                .catch( e => { this.clear(); failureCallback(e); } );
        }
        else { // set the data
            let key = data.key;
            delete data.key;
            this.getChildObject( key )
                .set( data )
                .then( () => { this.clear(); successCallback(); } )
                .catch( e => {
                    this.clear();
                    failureCallback(e);
                } );
        }
    }

    
    getChildObject( child_path: string ) {
        let path: string =  '/' + this.path + '/' + child_path;
        console.log('FireframeBase::getChildObject() path: ', path);
        return this.af.database.object( path );
    }


    destroy( successCallback, failureCallback? ) {
        this.object.remove()
            .then( successCallback )
            .catch( e => failureCallback( e ) );
    }


    /**
     * 
     * @Warning it will pass 'null' if the key does not exsits. This is the nature of firebase.
     */
    get( key, successCallback, failureCallback ) {
        let ref = this.object.$ref.child(key);
        ref.once('value', snapshot => {
            successCallback( snapshot.val() );
        }, failureCallback );
    }

    /**
     * Returns whole data in the path
     */
    gets( successCallback, failureCallback ) {
        let ref = this.object.$ref;
        ref.once('value', snapshot => {
            successCallback( snapshot.val() );
        }, failureCallback );
    }

    count( successCallback, failureCallback? ) {
        let ref = this.object.$ref;
        ref.once('value', snapshot => {
            successCallback( snapshot.numChildren( ));
        }, failureCallback );
    }

    /**
     * update must(should) only update. no create.
     */
    update( successCallback, failureCallback ) {

        let data = (JSON.parse(JSON.stringify( this.data )));
        this.clear();

        let key = data.key;

        // @todo data validation. check if key exists in this.data and in server. check if data exists.

        this.get( key, re => {   // yes, key exists on server, so you can update.
            if ( re == null ) return failureCallback('key does not exists');
            delete data.key;
            let ref = this.object.$ref;
            ref.child( key )
                .update( data, re => {
                    this.clear();
                    if ( re == null ) successCallback();
                    else failureCallback( re );
                } )
                .catch( e => failureCallback( e.message ) );
        }, e => failureCallback('sync failed: ' + e) );


    }

    // delete
    delete( key, successCallback, failureCallback ) {
        this.get( key, re => {
            if ( re == null ) return failureCallback( 'key does not exist' );
            let ref = this.object.$ref;
            ref.child(key).remove()
                .then( successCallback )
                .catch( e => failureCallback( e ) );
        }, e => failureCallback( e ) );
    }


    

}