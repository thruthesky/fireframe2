import { Injectable } from '@angular/core';
import { Post } from '../post';
import { Test as test } from '../test';
@Injectable()
export class PostTest {
    constructor( private post: Post ) {
        console.log('PostTest::constructor() post: ', post);
    }

     list = [];
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
                            callback()
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

   

    deleteWithPromise(){                 
            if( PostTest.count < this.list.length){
                console.log( this.list[ PostTest.count]);
                 this.post
                     .set('key', this.list[ PostTest.count])
                     .delete( () => {
                        test.pass("Post delete success with key:" + this.list[ PostTest.count]);
                          PostTest.count++;
                          this.deleteWithPromise();
                     }, e => {
                        test.fail('Post delete failed with key:' + this.list[ PostTest.count] + ", error: " + e);
                     });

               
            } else {
                console.log("End of counting");
            }      
    }

    deleteAll(callback ){    
       this.post.gets(snapshot=>{             
            if(snapshot) { 
                     
                for (let key in  snapshot) {  
                    this.list.push(key);                
                }   
                this.deleteWithPromise();           
             }    
             callback();                           
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

