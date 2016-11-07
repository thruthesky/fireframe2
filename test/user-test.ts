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


        let id = 'user-no-4';
        this.login( id, id, x => {
          //  this.update( id, x => {
            //    this.logout( x => {
                 //   this.logoutUpdate( id, x => {
                        callback()
                 //   });
              //  })
          //  })
        });


       
        // this.create(id, x =>
        //     this.login( id, id, x => {
        //         this.update( id, x => 
        //             callback()
        //         )
        //     } )
        // );
        


    }
    create( name, callback ) {
        this.user
            .set('email', name + '@gmail.com')
            .set('password', name )
            .create( () => {
                test.pass('registeration success');
                callback();
            }, e => {
                test.fail('registeration failed: ' + e);
                callback();
            })
    }
    login( id, password, callback ) {
        this.user
            .set('email', id + '@gmail.com')
            .set('password', password)
            .login( re => {
                test.pass( id + ' user logged in');
                callback();
            }, e => {
                test.fail('UserTest::login() failed: ' + e );
                callback();
            });
    }
    logout( callback ) {
        this.user.logout( callback );
    }
    update( id, callback ) {
        this.user
            .set('name', 'Name: ' + id )
            .set('mobile', 'Mobile: ' + id )
            .set('gender', 'Gender: ' + id )
            .set('address', 'Address: ' + id )
            .update( () => {
                test.pass('updated');
                callback();
            }, e => {
                test.fail( id + ' - failed on update: ' + e );
                callback();
            });
    }
    logoutUpdate( id, callback ) {
        this.user.set('name', 'wrong update. the user logged out')
            .update( () => {
                test.fail('user logged out already. should not be able to update');
                callback();
            }, e => {
                test.pass('User cannot update since he logged out');
                callback();
            });
    }
}


