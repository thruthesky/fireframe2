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


        this.createTest( ()=>
            this.updateTest( ()=>
                this.deleteTest( ()=> 
                    this.getTest( ()=>
                        this.setTest( callback)
                    )
                )
            )
        );     
  }




    deleteTest(callback){
      this.destroy( () =>
         this.create( 'apple', 'red', () =>
             this.count( 1, ()=> 
                 this.delete( 'apple', () => 
                    this.count( 0, ()=> 
                        this.create( 'apple', 'red', () =>
                            this.create( 'banana', 'green', () =>
                                this.delete( 'banana', () => 
                                   this.count( 1, callback)
                                )
                            )
                        )
                    )
                 )
             )
         )
      );
      
    }

   
    createTest(callback){
         this.destroy( () => 
            this.create( 'apple', 'red', () =>
                this.create( 'banana', 'yellow', () =>
                    this.create( 'cherry', 'darkred', () =>
                        this.count( 3, ()=>
                            this.create( 'guava', 'yellow', () =>
                               this.create( 'grapes', 'violet', () =>
                                   this.count( 5, callback)  
                               )                        
                            )
                        )
                    )
                )
            )
         );
    }

    updateTest(callback){
         this.destroy( () => 
            this.create( 'apple', 'red', () =>
                this.create( 'banana', 'yellow', () =>
                     this.update('apple', callback)
                )
            )
         );
    }

    getTest(callback){
          this.get('apple', () =>
            this.getNonExistKey( () =>
                this.gets( callback)
            )
          );
    }

    setTest(callback){
         this.set("key", "cherry", () =>
              this.sets( ()=>
                    this.clear(callback)
              )
         );                                                                                                  
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

  
   clear(callback){
       this.category.clear();

       if(this.category.data['key'] == undefined) test.pass("clear : data is cleared");
       else test.fail("clear: data not cleared");
       callback();
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

    sets(callback){
        let data : any = {};
            data["key"] = "Cherry";
            data['name'] = "Blossom";

            this.category.sets(data);

            let key = this.category.data['key'];
            let name = this.category.data['name'];
            let categoryData = JSON.stringify(this.category.data);
            let sampleData = JSON.stringify(data);

            if(key==="Cherry"
             && name === 'Blossom'
             && categoryData === sampleData)
             test.pass("Sets success on :" + JSON.stringify(data));    
             else  test.fail("Fail sets() on :" + JSON.stringify(data));  
             callback();             
    }


    set(key,value, callback){
        this.category.set(key,value);
        if( this.category.data[ key ] === value) test.pass("set:key:"+ key + " : "+ value);     
        else test.fail("fail to set : "+ key + ":"+ value); 
        callback();                
    }

    update( key, callback ) {
        this.category.set( 'key', key );
        this.category.set( 'name', key + ' : updated on ' + new Date().getTime());
        this.category.update( () => {
            test.pass( key + ' updated');
            callback();
        }, e => {
            test.fail( key + ' update fail');
            callback();
        });
    }





}

