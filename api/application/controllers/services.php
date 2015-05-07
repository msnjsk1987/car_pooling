<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example
 *
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array.
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Phil Sturgeon
 * @link		http://philsturgeon.co.uk/code/
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Services extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('Auth_model', 'Auth');
        
        // Configure limits on our controller methods. Ensure
        // you have created the 'limits' table and enabled 'limits'
        // within application/config/rest.php
        $this->methods['user_get']['limit'] = 500; //500 requests per hour per user/key
        $this->methods['user_post']['limit'] = 100; //100 requests per hour per user/key
        $this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key

        $this->load->library('session');
        $this->load->model('Model');
    }

    //service calls starts here
      function offerRides_post()
        {
          $data = array(
                        'departure' => $this->post('departureField'),
                        'arrival' => $this->post('arrivalField') ,
                        'departure_date' => $this->post('dt'),
                         'departure_time' => $this->post('mytime'),
                         'price' =>  $this->post('price'),
                         'seats' =>  $this->post('seats'),
                         'further_details' =>  $this->post('futureDetails'),
                         'luggage_size' => $this->post('luggage'),
                         'leave' =>  $this->post('leave'),
                         'detour' => $this->post('detour'),
                         'userid' =>$this->post('userid'),
                         'created_date' =>date('Y-m-d H:i:s'),
                         'user_type'=>$this->post('userType')
                     );
            $offerRide = $this->Model->saveOfferRide($data);
            $this->response($offerRide, 200); // 200 being the HTTP response code
        }

     function getRides_get(){
         $data=array(
             'departure'=>$this->get('origin'),
             'arrival' => $this->get('destination')
         );
         $rides = $this->Model->getRides($data);
         $this->response($rides, 200); // 200 being the HTTP response code
     }

      function getRideDetails_get(){
              $data=array(
                  'id'=>$this->get('id')
              );
              $rideDetails = $this->Model->getRideDetails($data);
              $this->response($rideDetails, 200); // 200 being the HTTP response code
          }



    function facebookUserSignUp_post(){
            $data=array(
                 'social_id'=> $this->post('social_id'),
                  'logintype'=>'facebook',
                 'first_name'=>$this->post('first_name'),
                 'last_name'=>$this->post('last_name'),
                  'gender'=>$this->post('gender'),
                  'email_id'=>$this->post('email_id'),

              );
            $checkUser=$this->Model->checkUser($this->post('social_id'));
            if(!$checkUser){
               $saveDetails = $this->Model->saveFbUserDetails($data);
            }else{
               $saveDetails="facebook user registed already";
            }

          $this->response($saveDetails, 200); // 200 being the HTTP response code
    }


     function storeUsersIdSession_post(){
            $user_data=array(
                'uid'=>$this->post('ID')
            );
            $this->session->set_userdata($user_data);
            $this->response($this->session->all_userdata(), 200); // 200 being the HTTP response code
     }

     function destorySession_get(){
         if($this->session->sess_destroy()){
             $this->response('session destroyed', 200); // 200 being the HTTP response code
         }

     }

     function getUserDetails_get(){
     if($this->get('uType')=='facebook'){
         $searchRow='social_id';
     }else{
        $searchRow='user_id';
     }
         $data=array(
             $searchRow=>$this->get('id')
         );
         $userDetails = $this->Model->getUserDetails($data);
         $this->response($userDetails, 200); // 200 being the HTTP response code
     }


    
    function user_get() {
        $email = $this->get('username');
        $pass = $this->get('password');
        if ($email && $pass) {
            $data = $this->Auth->loginUser($email, $pass);
            if ($data) {
                $this->response($data, 200); 
            } else {
                $this->response(array('error' => 'Invalid Username/Password'), 200);
            }
        } else {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }
    
    function userSignUp_post()
    {
        $fname = $this->post('fname');
        $lname = $this->post('lname');
        $email = $this->post('email');
        $mobile = $this->post('mobile');
        $gender = $this->post('gender');
        $password = $this->post('password');

        $data = array('first_name' => $fname, 'last_name' => $lname, 'email_id' => $email, 'mobile_number' => $mobile, 'gender' => $gender, 'password' => $this->create_password($password), 'last_login_time' => date('Y-m-d H:i:s'));
        $insertID = $this->Auth->insertUser($data,$email,$mobile);
        if ($insertID && $insertID != 0) {
            $message = array('userid' => $insertID,'message' => 'User has added successfully', 'status' => 'success');
            $this->response($message, 200); 
        }elseif($insertID == 0){
            $this->response(array('error' => 'Already username has taken'), 200);
        }else {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }
    
    
    function carAllModels_get() {
        $value = $this->Model->getAllCarList();
        $carAllModel = array();
        if(!empty($value)){
            foreach ($value as $allModel){                
                array_push($carAllModel, $allModel);
            }
        }       
        $this->response($carAllModel, 200); 
    }
    
    function saveCar_post(){
         $car_data=array(
                'user_id'=>$this->post('userID'),
                'car_make_id'=>$this->post('makeModel'),
                'car_model_id'=>$this->post('model'),
                'car_comfort'=>$this->post('comfort'),
                'car_color'=>$this->post('color')
         );
         $carDetail=$this->Model->set_carData($car_data);
         $this->response($carDetail, 200); // 200 being the HTTP response code
        
    }
    
    function getUserCarDetails_get(){
        
        $carDetails = $this->Model->getUserCarDetail($this->get('id'));
        $this->response($carDetails, 200); // 200 being the HTTP response code
    }
    
    
    function user_delete()
    {
    	//$this->some_model->deletesomething( $this->get('id') );
        $message = array('id' => $this->get('id'), 'message' => 'DELETED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function users_get()
    {
        //$users = $this->some_model->getSomething( $this->get('limit') );
        $users = array(
			array('id' => 1, 'name' => 'Some Guy', 'email' => 'example1@example.com'),
			array('id' => 2, 'name' => 'Person Face', 'email' => 'example2@example.com'),
			3 => array('id' => 3, 'name' => 'Scotty', 'email' => 'example3@example.com', 'fact' => array('hobbies' => array('fartings', 'bikes'))),
		);
        
        if($users)
        {
            $this->response($users, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any users!'), 404);
        }
    }


	public function send_post()
	{
		var_dump($this->request->body);
	}


	public function send_put()
	{
		var_dump($this->put('foo'));
	}
        
    /**
     * Password Functionality   
     */

    private static $algo = '$2a';
    private static $cost = '$10';

    public static function unique_salt() {
        return substr(sha1(mt_rand()), 0, 22);
    }

    public static function create_password($password) {

        return crypt($password, self::$algo .
                self::$cost .
                '$' . self::unique_salt());
    }

    /**
     * End Password Functionality  
     */
}