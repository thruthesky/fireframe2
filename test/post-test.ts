import { Injectable } from '@angular/core';
import { Post } from '../post';
import { Test as test } from '../test';
@Injectable()
export class PostTest {
    constructor( private post: Post ) {
        console.log('PostTest::constructor() post: ', post);
    }

     toDeleteKeys = [];
    static count =0;


    test( callback ) {
        console.log('test()');
        if ( this.post.path == 'post' ) test.pass('success');
        else test.fail('path of post is not post');

        this.remove( () =>
            this.create('1st post', () =>
                this.create( '2nd post', () =>
                    this.create( '3rd post', () => 
                       this.gets(()=>  
                         this.deleteTest( () =>
                            this.get( () =>
                               callback()
                            )
                         )
                       )
                    )
                )
            )
        );   
    }


    deleteTest( callback ){
        this.create("Hero", ()=>
            this.create("Animals", ()=>
                 this.deleteAll(callback)     
             )
        );
    }

   

    loopThruKeysAndDelete( callback ){                 
            if( PostTest.count < this.toDeleteKeys.length){          
                this.post
                .set('key', this.toDeleteKeys[ PostTest.count])
                .delete( () => {
                    test.pass("Post delete success with key:" + this.toDeleteKeys[ PostTest.count]);
                    PostTest.count++;
                    this.loopThruKeysAndDelete( callback );
                }, e => {
                    test.fail('Post delete failed with key:' + this.toDeleteKeys[ PostTest.count] + ", error: " + e);
                    callback();
                });       
            } else {
                console.log("End of counting");
                callback();
            }      
    }

    deleteAll( callback ){    
       this.post.gets(snapshot=>{             
            if(snapshot) {                 
            for (let key in  snapshot) {  
                this.toDeleteKeys.push(key);                
            }   
            this.loopThruKeysAndDelete( callback );           
            }                                  
       }, e=> {
           test.fail('Post gets() fail to retrieve data, error: ' + e);
            callback();
       });
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

    /*
     * 
     * To iterate over gets() results this method or process
     * 
     * for (let key in  snapshot) {           
     *    console.log(snapshot[key]);          
     * }
     * 
     */

    get( callback ){  
        this.create( 'Fruits', () => 
            this.create( 'Breads', () => {
              this.post.gets( snapValue =>{
                   if(snapValue){ test.pass('Post gets() success');   
                    for (let key in  snapValue) {           
                            this.post.set("key",key);
                            this.post.get( s=> {
                                if(s) test.pass('Post get() success on key:' + key);
                            },e =>{
                                   test.fail('Post get() success on key:' + key + ', Error:' + e);
                            });      
                        }
                   }
              }, e =>{
                  test.fail('Post gets() success with error:' + e);
              })
              
            })
         );
    }
   gets(callback){ 
       this.post.gets(snapshot=>{       
            if(snapshot) test.pass('Post gets() success');    
            callback();                            
       }, e=>{
           test.fail('Post gets() fail to retrieve data, error: ' + e);
           callback();
       })
   }


}

