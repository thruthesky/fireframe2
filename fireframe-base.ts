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


  private pagination_key: string = '';      // pagination key
  private pagination_last_page: boolean = false; // become true when last page has extracted.
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
    this.data = _.omitBy( this.data, _.isEmpty );

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

  /**
   *
   * Gets posts of next page.
   *
   *
   * @param this.data['numberOfPosts'] is optional. default is 10.
   *
   * @code
   *
        this.post.resetPagination();  // put it in constructor

        loadPosts( infinite? ) {      // put this block inside infinite scroll
            this.post
              .set('numberOfPosts', 40)
              .nextPage( data => {
                console.log('loadPoss: ', data);
                if ( infinite ) infinite.complete();
                this.displayPosts( data );
                if ( this.post.isLastPage() ) {
                  this.noMorePost = true;
                  infinite.enable( false );
                }
              },
              e => {
                if ( infinite ) infinite.complete();
                console.log("fetch failed: ", e);
              });
        }
   * @endcode
   */
  nextPage( successCallback, failureCallback ) {
    let num = ( this.data['numberOfPosts'] ? this.data['numberOfPosts'] : 10 ) + 1;
    let ref = this.object.$ref;
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
          let keys = Object.keys( data );
          let newData;
          if ( keys.length < this.data['numberOfPosts'] + 1 ) {
            newData = data;
            this.pagination_last_page = true;
          }
          else {
            this.pagination_key = Object.keys( data ).shift();
            newData = _.omit( data, this.pagination_key );
          }
          successCallback( newData );
        },
        failureCallback );
  }
  isLastPage() {
    return this.pagination_last_page;
  }
  resetPagination() {
    this.pagination_key = '';
  }

  /**
   *
   */
  search(successCallback, failureCallback? ) {
    let num = ( this.data['numberOfPosts'] ? this.data['numberOfPosts'] : 10 ) + 1;
    let ref = this.object.$ref;
    ref
      .limitToLast( num )
      .once('value', snapshot => {
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
  update( successCallback: () => void, failureCallback: (e: string) => void ) {

    if ( _.isEmpty( this.data )) return failureCallback('data is empty');
    this.data = _.omitBy( this.data, v => v === void 0 );
    console.log("FireframeBase::update() : this.data : ", JSON.stringify(this.data));

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
