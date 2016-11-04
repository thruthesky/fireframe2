import { Injectable } from '@angular/core';
import { Category } from '../category';
import { Test as test } from '../test';
@Injectable()
export class CategoryTest {
    constructor( private category: Category ) {
        console.log('CategoryTest::constructor() category: ', category);
    }
    test( callback ) {
        console.log('test()');
        console.log( this.category, this.category.path );


        if ( this.category.path == 'category' ) test.pass('success');
        else test.fail('path of cateogry is not category');

        this.destroy( () => 
            this.create( 'apple', 'red', () =>
                this.create( 'banana', 'yellow', () =>
                    this.create( 'cherry', 'darkred', () =>
                        this.count( 3, () =>
                            this.delete( 'banana', () => 
                                this.count( 2, () =>
                                    this.update('apple', () =>
                                        this.get('apple', () =>
                                           this.getNonExistKey( () =>
                                              this.gets( () =>
                                                  this.count( 2, callback
                                                      ))))))))))));            
         }


    destroy( callback ) {
        this.category.destroy( () => {
            test.pass('reset category stroage');
            callback();
        }, e => {
            test.fail( e );
            callback();
        });
    }

    gets( callback ){    
        this.category.gets( s =>{
          if(s) test.pass('gets(): result : ' + JSON.stringify(s)); 
          else  test.fail('failed to gets(): should not return :' + s );
            callback();
        }, e =>{
            test.fail('failed to gets(): error ' + e );
            callback();
        });

    }


    getNonExistKey( callback){
        this.category.get("notexist", s=>{
            if(s) test.fail('get: non existing key ');
            else  test.pass(' get: fail to get non existing key. result is: ' + s );
            callback();
        },e=>{
            test.fail('failed to getNonExisting error:' + e);
            callback();
        });
    }

    get(key, callback){
        this.category.get(key, s=>{
           if(s)  test.pass('get: ' + key + ": " + JSON.stringify(s));
           else  test.fail('failed to get:' + key );
            callback();
        },e=>{
            test.fail('failed to get: error ' + e );
            callback();
        });

    }

    delete( key, callback ) {
        this.category.delete( key, () => {
            test.pass('deleted: ' + key );
            callback();
        }, e => {
            test.fail('failed to delete: ' + key );
            callback();
        })
    }

    create( name, color, callback ) {
        console.log('createApple');
        this.category
            .set('key', name)
            .set('name', name)
            .set('color', color)
            .set('title', 'This is my ' + name )
            .create( () => {
                test.pass('apple created');
                callback();
            }, e => {
                test.pass('apple not created');
                callback();
            });
    }

    count( num, callback ) {
        this.category.count( count => {
            if ( num == count ) test.pass('there are ' + num +' categories');
            else test.fail('there are ' + count + ' categories');
            callback();
        }, e => {
            test.fail('failed to query');
            callback();
        })
    }

    update( key, callback ) {
        this.category.set( 'key', key );
        this.category.set( 'name', key + ' : updated on ' + new Date().getTime());
        this.category.update( re => {
            test.pass( key + ' updated');
            callback();
        }, e => {
            test.fail( key + ' update fail');
            callback();
        });
    }





}

