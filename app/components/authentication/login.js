angular.module('app').component('login', {
  templateUrl: './components/authentication/login.html',
  controller: ['$firebaseAuth', '$state', '$mdToast', function($firebaseAuth, $state, $mdToast){

  	var self = this;

  	this.isSignUp = false;

  	this.toggleSignUp = function(){
  		this.isSignUp = !this.isSignUp;
  	}

    this.submit = function(){
      if (this.isSignUp)
        this.signup();
      else
        this.login();
    }

  	this.login = function(){
  		$firebaseAuth()
  		.$signInWithEmailAndPassword(this.email, this.password)
  		.then(function(user){
  			console.log(user);
  			$state.go('editor.home')
  		}, this.handleError)
  	}

  	this.signup = function(){
  		$firebaseAuth()
  		.$createUserWithEmailAndPassword(this.email, this.password)
  		.then(function(user){
  			firebase.database().ref('users').child(user.uid).set({
  				name: self.name,
  				email: self.email
  			}).then(function(){
  				$state.go('editor.home')
  			}, this.handleError)
  		}, this.handleError)
  	}

  	this.handleError = function(error){
  		console.log(error);
  		$mdToast.showSimple(error.message)
  	}

  }]
});