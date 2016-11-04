import { Injectable } from '@angular/core';
import { User } from '../user';
import { Test as test } from '../test';
@Injectable()
export class UserTest {
    constructor( private user: User) {
        console.log('UserTest::constructor() user: ', user);
    }
    test( callback ) {
        console.log('UserTest::test()');

        this.user
            .set('email', 'second@email.com')
            .set('password', 'abcd1234')
            .create( re => {
                test.pass('registeration success');
                callback();
            }, e => {
                test.fail('registeration failed: ' + e);
                callback();
            })
    }
}

