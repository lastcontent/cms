window.config = {
	logos: {
		small: 'YOUR LOGO HERE'
	},
	colors: {
		primaryPalette: 'blue',
		accentPalette: 'orange'
	},
	firebase: {
		apiKey: "YOUR API KEY",
		authDomain: "YOUR AUTH DOMAIN",
		databaseURL: "YOUR DB URL",
		storageBucket: "YOUR STORAGE BUCKET",
		messagingSenderId: "YOUR SENDER ID"
	}
};

firebase.initializeApp(window.config.firebase);
firebase.auth().onAuthStateChanged(function(user) {
	console.log(user)
	angular.bootstrap(document, ['app']);
});