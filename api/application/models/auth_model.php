<?php
class Auth_model extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }
	
	function insertUser($data){            
	    $this->db->insert('users', $data);
            return $this->db->insert_id();
	}
        
        function loginUser($email,$pass){
            $this->db->select('*');
            $this->db->from('users');
            $this->db->where('email_id =', $email);
            $this->db->or_where('mobile_number =', $email);
            $query = $this->db->get();
            $userID = "";
            $password = "";
            foreach ($query->result() as $row)
            {
               $userID = $row->user_id;
               $password = $row->password;
            }           
            if($userID && $this->check_password($password, $pass)){
                $this->updateLoginTime($userID);
                return $userID;
            }else{
                return '';
            }
            
        }
        
        function updateLoginTime($userID){
            $data = array('last_login_time'=>date('Y-m-d H:i:s'));
            $this->db->update('users', $data, array('user_id' => $userID));
        }
        
        function updateUserProfile($data,$userID){
            $this->db->update('users', $data, array('user_id' => $userID));
        }
        
        function updateUserProfilePicture($data,$userID){
            $this->db->update('users', $data, array('user_id' => $userID));
        } 
        
        function getAllCarMake(){
            $this->db->select('make_id as ID, make_name as Name');
            $this->db->from('car_make');            
            $query = $this->db->get();            
            return $query->result_array();
        }
        
        function getOneCarModel($makeID){
            $this->db->select('model_id as ModelID,model_name as ModelName');
            $this->db->from('car_model'); 
            $this->db->where('make_id =', $makeID);
            $query = $this->db->get();
            return $query->result_array();
        }
        
        function getAllCarList(){
            $this->db->select('car_model.model_id as ModelID,car_model.model_name as ModelName,car_make.make_id as MakeID, car_make.make_name as MakeName');
            $this->db->from('car_make');          
            $this->db->join('car_model', 'car_model.make_id = car_make.make_id');  
            $query = $this->db->get();
            return $query->result_array();
        }

        /*************************  Password Functionality   **************************/
      public static function check_password($hash, $password) {
        $full_salt = substr($hash, 0, 29);
        $new_hash = crypt($password, $full_salt);
        return ($hash == $new_hash);
      }
      /*************************  End Password Functionality   **************************/
}