# fireframe2
fireframe version 2


# TODO List

    * user password update & email address update
    * user resign with deleting user data in database.
    * photo upload
    * add more tests. 20 tests on category, 20 tests on user. 30 test on post.


    @done merge webapp/providers/app into fireframe2


# install

npm install firebase angularfire2 --save
npm install lodash --save




# TEST

How to test...

  this.categoryTest.test( () =>
    this.postTest.test( () => {
      console.log('TEST END');
    })
  );
//  this.userTest.test( () => {} );

# Coding Guideline

It uses @ionic/storage to support offline login.


# USER

## Basic User Data

* 'USER_DATA' interface has User login, register interface.
  if you need to as more property on 'USER_DATA', you can extend it.
  @see sample-pages/register


### User login check and user data

Below are one way to use user code.

````

  user.loggedIn( u => this.loginData = u, () => this.loginData = null );
  get login() {
      return !! this.loginData;
  }
  <section *ngIf=" login ">...</section>
  <ion-item *ngIf=" ! login ">...</ion-item>

````

Or you can do something like Below

````

    this.checkLogin();
    checkLogin() {
        this.user.loggedIn( u => this.loginData = u, () => this.loginData = null );
    }

````


### User Registration

* way to do Registration

````

    this.user
     .sets(this.userData)
     .register(
        ( ) => this.alert('User registration success'),
        (e) => this.alert(e) );

````



### How to show loader



class ABC {
  track;
  update() {
    if ( this.question.answer == '' ) {
      this.track = { error: 'Input answer' };
      return;
    }
    this.track = { progress: 'Updating ...' };
    this.questionPost
      .set( 'key', this.questionID )
      .set( 'question', this.question.question )
      .set( 'answer', this.question.answer )
      .update( () => {
        this.track = { success: 'Update success!' };
      },e=>{
        this.track = { error: 'Update error...'};
      })
  }
}


* How to put CSS

````

    [progress] {
        background-color: blue;
        color:white;
    }
    [error] {
        background-color: red;
        color: white;
    }
    [success] {
        background-color: green;
        color: white;
    }

````



