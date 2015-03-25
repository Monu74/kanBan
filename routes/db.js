var  mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/test');
var uniqueValidator = require('mongoose-unique-validator');
//**********Schema of user****************************

var userinfo = mongoose.Schema( {
	 name: String,
	 last_name : String,
	 designation : String,
	 mobile_number : Number,
	 skype_id : String,
     email:{type:String, unique:true},
     pass: String,
     verification: { type:Boolean ,default: false},
     verification_token:{ type: String},
     picture: String
},{collection:"user_info"} );
userinfo.plugin(uniqueValidator);
module.exports.user = mongoose.model('my2',userinfo);

//********Schema of project*************************

var projectinfo = mongoose.Schema( {
	name : { type:String },
	email:{ type:Array, default:[]},
	des:{ type:String}
  },{collection:"project_info"} );
//projectinfo.plugin(uniqueValidator);
module.exports.project = mongoose.model('my3',projectinfo);

//***********Schema of task*************************

var taskinfo = mongoose.Schema({
	project_name:{type:String},
	email:{ type:String},
	title:String,
	des: String,
	due_date:Date,
	completion_date:Date,
	order : Number,
	timeAssign : String,
    taskAssign : String,
    taskOwner: String,
	status: { type:String, default:"New"},
	comments:[{
		 user_email: String,
		 user_comments: String,
		 post_date: Date
	}]
	
},{collection:"task_info"});
module.exports.task = mongoose.model('my4',taskinfo);
userinfo.plugin(uniqueValidator);

