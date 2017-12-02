import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { signupForm } from './main.html';
import { homepage } from './homepage.html';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.main.helpers({
	'isLoggedIn' : function(){
		//alert("isLoggedIn called");
		if(Meteor.user() == null || Meteor.user() == undefined)
			return false;
		return true;
	},
	'isEmergencyClicked' : function(){
		if(Session.get('isEmergencyClicked') == true)
			return true;
		else return false;
	}
});

Template.signupForm.events({
	'submit form' : function(event){
		event.preventDefault();
		rpassword = event.target.password.value;
		rcpassword = event.target.cpassword.value;
		if(rpassword != rcpassword){
			alert("Passwords don't match");
			return;
		}
		remail = event.target.email.value;
		rphone = event.target.phone.value;
		rname = event.target.phone.value;
		rnationality = event.target.nationality.value;
		console.log("Form submitted successfully");

		Accounts.createUser({
			email: remail,
			password: rpassword,
			name : rname,
			phone : rphone,
			nationality : rnationality
		}, function(Err){
			if(Err != null || Err != undefined){
				alert(Err.reason);
			}
			else alert("Signed up successfully");
		});

	}
});


Template.loginForm.events({
	'submit form' : function(event){
		event.preventDefault();
		lemail = event.target.email.value;
		lpassword = event.target.password.value;

		Meteor.loginWithPassword(lemail, lpassword, function(err){
			if(err != null || err != undefined)
				alert(err.reason);
			else
				alert("Logged in successfully!");
		});
	}
});

Template.homepage.helpers({
	'cityList' : function(){
		myArray = Places.find().fetch();
		cityArray = _.uniq(myArray, false, function(d) {return d.city});
		console.log("Cities : " + cityArray);
		return cityArray
	},

	'attractionsList' : function(){
		//Places.find({city:'Jaipur'}).fetch()[0].details;
		myArray = Places.find({city : Session.get('selectedCity')}).fetch()[0];
		//attractionsArray = _.uniq(myArray, false, function(d) {return d.details.attractions});
		console.log("attractions : " + myArray.details.attractions);
		return myArray.details.attractions;
	},

	'eventsList' : function(){
		myArray = Places.find({city : Session.get('selectedCity')}).fetch();
		//attractionsArray = _.uniq(myArray, false, function(d) {return d.details.attractions});
		temp = []
		for(var i = 0; i < myArray.length; i++){
			console.log("events : " + myArray[i].details.local_events);
			temp.push(myArray[i].details.local_events)
		}
		temp2 = _.uniq(myArray, false, function(d) {return d.details.attractions});
		return temp2;
	},

	'guidesList': function(){
		myArray = Guides.find({place_handled:Session.get('selectedCity')}).fetch();
		return myArray;
	},

	'showEmergencyDialog' : function(){
		
	}
});

Template.homepage.events({
	'change #selectedCity' : function(){
		Session.set("selectedCity", document.getElementById('selectedCity').value);
		console.log(document.getElementById('selectedCity').value);
	},
	'click #logout' : function(){
		Session.set('isEmergencyClicked', false);
		Session.set('selectedCity',  null);
		Meteor.logout();
		console.log("Logged out successfully!");
	},

	'click #emergencyButton' : function(){
		Session.set('isEmergencyClicked', true);
	}
});


Template.emergency.events({
	'click #closeEmergency':function(){
		Session.set('isEmergencyClicked', false);
	},
	'click #callpolice' : function(){
    if (Session.get('lat') == undefined 
             || Session.get('lon') == undefined) {
        navigator.geolocation.getCurrentPosition(function(position) {
            Session.set('lat', position.coords.latitude);
            Session.set('lon', position.coords.longitude);
        });
     }
	},

     'click #callambulance' : function(){
    if (Session.get('lat') == undefined 
             || Session.get('lon') == undefined) {
        navigator.geolocation.getCurrentPosition(function(position) {
            Session.set('lat', position.coords.latitude);
            Session.set('lon', position.coords.longitude);
        });
     	}
	},

      'click #callembassy': function(){
      	alert("Phone no of your Embassy : 080-2442234");
      }

});

Template.addGuideForm.helpers({
	'cityList' : function(){
		myArray = Places.find().fetch();
		cityArray = _.uniq(myArray, false, function(d) {return d.city});
		console.log("Cities : " + cityArray);
		return cityArray;
	}
});


Template.addGuideForm.events({
	'submit form': function(event){
		event.preventDefault();
		rguide_name = event.target.guideName.value;
		console.log(event.target.guideName.value);
		rguideplace = event.target.placeHandled.value;
		console.log(event.target.placeHandled)
		rpriceperhr = event.target.price_per_hour.value;
		Guides.insert({guide_name : rguide_name, place_handled: rguideplace, price_per_hour:rpriceperhr});
	}
});

Template.addNewPlaceForm.helpers({
	'cityList' : function(){
		myArray = Places.find().fetch();
		for(var i = 0;i < myArray.length; i++){
			cityArray.push(_.uniq(myArray, false, function(d) {return d.city}));
			console.log("Cities : " + cityArray);
		}
		return cityArray;
	}
});
Template.addNewPlaceForm.events({
	'submit form' : function(event){
		event.preventDefault();
		rplace = event.target.nameOfTheCity.value;
		rattractions = event.target.attractions.value;
		revents = event.target.events.value;
		Places.insert({city:rplace, details :{local_events: [{event:revents}], attractions:[{attraction:rattractions}]}});
	}
});
//to Get the location
Meteor.startup(function() {
	Session.set('selectedCity', 'Udaipur');
    if (Session.get('lat') == undefined 
             || Session.get('lon') == undefined) {
        navigator.geolocation.getCurrentPosition(function(position) {
            Session.set('lat', position.coords.latitude);
            Session.set('lon', position.coords.longitude);
        });
    }
});