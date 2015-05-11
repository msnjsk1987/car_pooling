<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Model extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }

    function sendMessage($data){
     $this->db->insert('message', $data);
     return $this->db->insert_id();
    }

    function getMessageDetails($uid,$userType){

        $this->db->select('users.first_name as first_name,message.message as message,message.status as status,message.created_date as date,message.id as id');
        $this->db->from('message');
        $this->db->where('reciver_id',$uid);
        if($userType=="native"){
                         $this->db->join('users', 'users.social_id = message.sender_id');
                   }else{
                         $this->db->join('users', 'users.user_id = message.sender_id');
                   }


                $query = $this->db->get();
               return $query->result_array();
    }

    function getMessageCount($uid,$userType){
      $this->db->select('users.first_name as first_name');
            $this->db->from('message');
            $this->db->where('reciver_id',$uid);
             if($userType=="native"){
                  $this->db->join('users', 'users.social_id = message.sender_id');
            }else{
                  $this->db->join('users', 'users.user_id = message.sender_id');
            }
                    $query = $this->db->get();
                   return $query->result_array();
    }


    function saveOfferRide($data){
       $this->db->insert('rides', $data);
        return $this->db->insert_id();
    }
    function getRides($departure,$arrival){
       $this->db->like('departure', $departure);
       $this->db->like('arrival', $arrival);
       $query = $this->db->get('rides');
       return $query->result_array();
    }

    function getRideDetails($data){
           $this->db->where($data);
           $query = $this->db->get('rides');
           return $query->result_array();
        }
    function getUserRide($data){
        $this->db->where($data);
        $query = $this->db->get('rides');
        return $query->result_array();

    }

    function deleteUserRide($userId,$rideId){
             $this->db->where('id',$rideId);
              $this->db->where('userid',$userId);
              $query = $this->db->delete('rides');
              return $userId;
    }

    function getUserDetails($data){
       $this->db->where($data);
                  $query = $this->db->get('users');
                  return $query->result_array();
    }
    
    function getUserCarDetail($userId){
        $this->db->select('*');
        $this->db->from('car');
        $this->db->where('user_id=',$userId);
        $this->db->join('car_model', 'car_model.model_id = car.car_model_id'); 
        $this->db->join('car_make', 'car_make.make_id = car_model.make_id');
        $query = $this->db->get();
        return $query->result_array();
          
    }

    function confirmMobileCode($id,$mobile,$code,$uType){
            if($uType=="native"){
                $this->db->where('user_id',$id);
            }else{
                $this->db->where('social_id',$id);
            }

               $this->db->select('*');
               $this->db->where('mobile_number',$mobile);
                $this->db->where('mobile_verify_code',$code);
              $query = $this->db->get('users');
              if($query->result_array()){

                           if($uType=="native"){
                              $this->db->where('user_id',$id);
                          }else{
                              $this->db->where('social_id',$id);
                          }
                           $this->db->where('mobile_number',$mobile);
                              $this->db->where('mobile_verify_code',$code);
                            $data = array(
                                 'mobile_verified' => 1,
                              );

                  return $query = $this->db->update('users',$data);
              }
    }

    function updateMobileData($uid,$userType,$mobile,$code){
             $data = array(
                   'mobile_number' => $mobile,
                   'mobile_verify_code' => $code,
                );
             if($userType=="native"){
             $this->db->where('user_id',$uid);
             }else{
              $this->db->where('social_id',$uid);
             }
             $query = $this->db->update('users',$data);
             return $data;
    }

    function saveFbUserDetails($data){
        $this->db->insert('users', $data);
        return $this->db->insert_id();
    }

    function checkUser($id){
         $this->db->where('social_id=',$id);
         $query = $this->db->get('users');
         return $query->result_array();
    }
    
     function getAllCarList(){
            $this->db->select('car_model.model_id as ModelID,car_model.model_name as ModelName,car_make.make_id as MakeID, car_make.make_name as MakeName');
            $this->db->from('car_make');          
            $this->db->join('car_model', 'car_model.make_id = car_make.make_id');  
            $query = $this->db->get();
            return $query->result_array();
        }
    function set_carData($data){
        $this->db->insert('car', $data);
        return $this->db->insert_id();
    }

}