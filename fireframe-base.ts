/**
 * 
 * @Injectable() class cannot (or may not) be extendend.
 * Category, post and other classes need a parent class to extend to share common code.
 * And this is why we have FireframeBase.
 * It is more likely a proxy between fireframe and indivisual classes.
 */
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
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

    create( successCallback, failureCallback ) {
        let data = (JSON.parse(JSON.stringify( this.data )));
        this.clear();


        if ( data.key === void 0 ) { // push the data ( push a key and then set )
            this.list
                .push( data )
                .then( successCallback )
                .catch( e => failureCallback(e) );
        }
        else { // set the data
            let key = data.key;
            delete data.key;
            this.getChildObject( key )
                .set( data )
                .then( successCallback )
                .catch( e => failureCallback(e) );
        }
    }
    getChildObject( child_path: string ) {
        return this.af.database.object( '/' + this.path + '/' + child_path );
    }


    destroy( successCallback, failureCallback? ) {
        this.object.remove()
            .then( successCallback )
            .catch( e => failureCallback( e ) );
    }


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

    // update
    update( successCallback, failureCallback ) {
        let data = (JSON.parse(JSON.stringify( this.data )));
        this.clear();
        // @todo data validation. check if key exists in this.data and in server. check if data exists.
        let key = data.key;
        delete data.key;
        let ref = this.object.$ref;
        ref.child( key )
            .update( data, re => {
                if ( re == null ) successCallback();
                else failureCallback( re );
            } )
            .catch( e => failureCallback( e.message ) );
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