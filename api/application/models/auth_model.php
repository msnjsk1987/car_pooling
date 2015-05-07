<?php
class Auth_model extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }
	
	function insertUser($data,$email,$mobile){      
            $arraySet = $this->checkUserName($email, $mobile);
            if(empty($arraySet)){
                $this->db->insert('users', $data);
                return $this->db->insert_id();
            }else{
                return 0;
            }
	    
	}
        
        function checkUserName($email,$mobile){
            $whereCase = '(email_id = "'.$email.'")';
            $this->db->select('*');
            $this->db->from('users');
            $this->db->where($whereCase);
            $query = $this->db->get();           
            $data = "";
            $data =  $query->result();
            if(empty($data)){
                $whereCase = '(mobile_number = "'.$mobile.'")';
                $this->db->select('*');
                $this->db->from('users');
                $this->db->where($whereCase);
                $query = $this->db->get();
                $data =  $query->result();
            }  
            return $data;
        }
        function loginUser($email,$pass){
            $data = $this->checkUserName($email, $email);
            if(!empty($data)){
            $userID = "";
            $password = "";                      
                foreach ($data as $row)
                {
                   $userID = $row->user_id;
                   $password = $row->password;
                   $email = $row->email_id;
                   $firstname = $row->first_name;
                   $lastname = $row->last_name;
                   $profilepic = $row->profile_picture;
                   $logtype = $row->logintype;
                   $soicalid = $row->social_id;
                }           
                if($userID && $this->check_password($password, $pass)){
                    $this->updateLoginTime($userID);
                    $data = array('userid'=>$userID,'firstname'=>$firstname,'lastname'=>$lastname,'email'=>$email,'pic'=>$profilepic,'logtype'=>$logtype,'socialid'=>$soicalid,'status' => 'success');
                    return $data;
                }else{
                    return '';
                }
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
        
       

        /*************************  Password Functionality   **************************/
      public static function check_password($hash, $password) {
        $full_salt = substr($hash, 0, 29);
        $new_hash = crypt($password, $full_salt);
        return ($hash == $new_hash);
      }
      /*************************  End Password Functionality   **************************/
}