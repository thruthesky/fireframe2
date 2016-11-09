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
import * as _ from 'lodash';
export class FireframeBase {
    private f: Fireframe;
    private af: AngularFire;
    public __path: string;
    private object: FirebaseObjectObservable<any>;
    private list: FirebaseListObservable<any>;
    data: any = {};


    private pagination_key: string = '';
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
    set( key:string, value:string|number) : FireframeBase {
        this.data[ key ] = value;
        return this;
    }
    sets( data ) : FireframeBase {
        this.data = data;
        return this;
    }
    /**
     * @todo remove this method. It produces more errors.
     */
    clear() {
        this.data = {};
        return this;
    }

    /**
     *
     */
    create( successCallback: () => void, failureCallback: (e: string) => void ) {
        console.log('FireframeBase::create() data: ', this.data);

        let data = _.cloneDeep(this.data);
        this.clear();
        if ( data.key === void 0 ) { // push the data ( push a key and then set )
            console.log('No key. Going to push()');
            this.list
                .push( data )
                .then( () => { successCallback(); } )
                .catch( e => { failureCallback(e.message); } );
        }
        else { // set the data
            let key = data.key;
            delete data.key;
            console.log('Key exists. Going to set() with key : ' + key);
            console.log('FireframeBase::create() data: ', data);
            this.list
            this.getChildObject( key )
                .set( data )
                .then( () => { successCallback(); } )
                .catch( e => {
                    console.log("set() ERROR: " + e);
                    failureCallback(e.message);
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
    get(successCallback, failureCallback ) {
        //let ref = this.object.$ref.child(key);
        //ref
       let key = this.data.key;
        this.getChild( key )
            .once('value', snapshot => {
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

nextPage( successCallback, failureCallback ) {
    let num = this.data['numberOfPosts'];
    let ref = this.object.$ref;
    console.log('pagination_key: ' + this.pagination_key);
    let order = ref.orderByKey();
    let q;
    if ( this.pagination_key ) {
        q = order.endAt( this.pagination_key ).limitToLast( num );
    }
    else {
        q = order.limitToLast(num); 
    }
    q
        .once('value', snapshot => {
        let data = snapshot.val();
        console.log('fetch 2: once: snapshot: ', snapshot.val() );
        console.log('keys: ', Object.keys( data ) );
        this.pagination_key = Object.keys( data ).shift();
        successCallback( data );
    },
    failureCallback );
}
    /**
     * Returns requested data in the path
     *
     */
    fetch( successCallback, failureCallback ) {
      let ref = this.object.$ref;
      //let ref = this.list.$ref;


      /**
       *
       * is it posible to do something like
       *
       * @startCode
       *
       * let ref = this.object.$ref;
       * ref.orderByKey();
       * ref.endAt( this.data.lastKey );
       * ref.limitToLast( parseInt(this.data.limitToLast) )
       * ref.once('value', (snapshot) => {
       *  successCallback( snapshot.val() );
       *  }, failureCallback );
       *  @endCode
       */


      if(this.data.lastKey != '' && (typeof this.data.limitToLast !== void 0)) {
        console.log('lastkey not empty', this.data.lastKey);
        console.log('limitToLast not empty', this.data.limitToLast);
        ref.orderByKey()
          .endAt( this.data.lastKey )
          .limitToLast( parseInt(this.data.limitToLast) )
          .once('value', (snapshot) => {
            successCallback( snapshot.val() );
          }, failureCallback );
      }
      else if(typeof this.data.limitToLast !== void 0) {
        console.log('limitToLast was provided', this.data.limitToLast);;
        ref.orderByKey()
          .limitToLast( parseInt(this.data.limitToLast) )
          .once('value', (snapshot) => {
            successCallback( snapshot.val() );
          }, failureCallback );
      }
      else if(this.data.lastKey != '') {
        console.log('lastKey was provided', this.data.lastKey);;
        ref.orderByKey()
          .endAt( this.data.lastKey )
          .limitToLast( 10 )
          .once('value', (snapshot) => {
            successCallback( snapshot.val() );
          }, failureCallback );
      }
      else {
        console.log('default fetch');
        ref.orderByKey()
          .limitToLast( 10 )
          .once('value', (snapshot) => {
            successCallback( snapshot.val() );
          }, failureCallback );
      }


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
    update( successCallback: () => void, failureCallback: (e: string) => void ) {

        console.log("FireframeBase::update() : this.data : ", this.data);
        if ( _.isEmpty( this.data )) return failureCallback('data is empty');

        let data = _.cloneDeep(this.data);

        // @todo data validation. check if key exists in this.data and in server. check if data exists.

        this.get( re => {   // yes, key exists on server, so you can update.
            if ( re == null ) return failureCallback('key does not exists');
            console.log("Going to update: data : ", data);
            this.getChild( this.data.key )
                .update( data, re => {
                    if ( re == null ) successCallback();
                    else failureCallback( re.message );
                } )
                .catch( e => failureCallback( e.message ) );
        }, e => failureCallback('sync failed: ' + e) );


    }

    // delete
    delete(successCallback, failureCallback ) {
        if ( ! this.isValidKey(this.data.key) ) return failureCallback('invalid key');
        this.get( re => {
            if ( re == null ) return failureCallback( 'key does not exist' );
            //let ref = this.object.$ref;
            //ref.child(key).remove()
            this.getChild(this.data.key).remove()
                .then( successCallback )
                .catch( e => failureCallback( e ) );
        }, e => failureCallback( e ) );
    }


    /**
     *
     */
    getChild( key: string ) : firebase.database.Reference {
        if ( this.isValidKey( key ) ) {
            let ref = this.object.$ref;
            return ref.child( key )
        }
        else {
            console.error("FireframeBase::getChild() invalid key: " + key);
            return null;
        }
    }

    /**
     * return true if the key is valied
     */
    isValidKey(key) {
        if ( key === undefined ) return false;
        var invalidKeys = { '': '', '$': '$', '.': '.', '#': '#', '[': '[', ']': ']' };
        return invalidKeys[key] === undefined;
    }

}
