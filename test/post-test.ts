import { Injectable } from '@angular/core';
import { Post } from '../post';
import { Test as test } from '../test';
@Injectable()
export class PostTest {
    constructor( private post: Post ) {
        console.log('PostTest::constructor() post: ', post);
    }
    test( callback ) {
        console.log('test()');
        if ( this.post.path == 'post' ) test.pass('success');
        else test.fail('path of post is not post');

        this.remove( () =>
            this.create('1st post', () =>
                this.create( '2nd post', () =>
                    this.create( '3rd post', () => {
                        callback();
                    })
                )
            )
        );
    }
    remove( callback ) {
        this.post.destroy( () => {
            test.pass('reset post stroage');
            callback();
        }, e => {
            test.fail( e );
            callback();
        });
    }


    create( title, callback ) {
        this.post
            .set('title', title)
            .set('content', 'Content of : ' + title )
            .create( () => {
                test.pass( title + ' created' );
                callback();
            }, e => {
                test.fail( title + ' not created' );
                callback();
            });
    }


}

