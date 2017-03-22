var mongoose = require('mongoose');
var Schema   = mongoose.Schema ;
var bcrypt   = require('bcrypt-nodejs');
var titlize  = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
    message: 'Name must be at least 3 characters,max 20,no special characters or numbers,must have space between name.'
  }),
   validate({
  validator: 'isLength',
  arguments: [3,20],
  message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
})

];

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Is not a valid email.'
  }),
  validate({
  validator: 'isLength',
  arguments: [3,50],
  message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
})
];

var usernameValidator = [
  validate({
    validator:'isAlphanumeric',
    message:'Username should contain only letters and numbers'
  }),
  validate({
  validator: 'isLength',
  arguments: [3,25],
  message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
})
];

var passwordValidator = [
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\w]).{8,35}$/,
    message: 'password Must be at least one lower case,one uppercase,one number,one special character and must be atleast 8 characters but not more than 35.'
  }),
   validate({
  validator: 'isLength',
  arguments: [3,35],
  message: 'password should be between {ARGS[0]} and {ARGS[1]} characters'
})

];
var UserSchema = new Schema({
  name :{ type: String,required:true, validate:nameValidator},
	username: { type:String , lowercase : true ,unique: true, validate: usernameValidator},
	password: { type:String , required:true , validate:passwordValidator , select:false},
	email: { type: String , required: true , lowercase : true , unique:true,validate:emailValidator},
  active : {type:Boolean , required:true,default :false},
  temporarytoken:{ type:String,required:true},
  resettoken:{ type:String,required:false},
  permission:{ type:String, required: true, default:'user'}
});

UserSchema.pre('save', function(next) {
  var user = this;
  if( !user.isModified('password')) return next();
  bcrypt.hash(user.password,null,null,function(err,hash){
  	if(err)
  		return next(err);
  	user.password = hash;
  	next();

  });
 
});

UserSchema.plugin(titlize, {
  paths: [ 'name' ]
});


UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password,this.password);
}; 
module.exports = mongoose.model('User',UserSchema);


