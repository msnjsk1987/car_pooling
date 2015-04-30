<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Model extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }
    function saveOfferRide($data){
       $this->db->insert('rides', $data);
        return $this->db->insert_id();
    }
    function getRides($data){
       $this->db->where($data);
       $query = $this->db->get('rides');
       return $query->result_array();
    }

    function getRideDetails($data){
           $this->db->where($data);
           $query = $this->db->get('rides');
           return $query->result_array();
        }

    function getUserDetails($data){
       $this->db->where($data);
                  $query = $this->db->get('users');
                  return $query->result_array();
    }

}