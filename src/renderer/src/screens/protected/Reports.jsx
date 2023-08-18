import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from 'primereact/button'
import Navbar from '../../components/Navbar'
import { API_URL } from '../../utils/exports'
import { useReactToPrint } from 'react-to-print'
import Users from './Users'

const Reports = () =>
{
  const conponentPDF= useRef();
  const [userData, setUsers]= useState([]);

  useEffect(() => {
    return AcceptedUsers()
  }, [])

  const AcceptedUsers = () => {
      const registerUserdata= async()=>{
       axios.get(`${API_URL}/users`, { headers: { 'x-access-token': token } })  
       .then(res=>setUsers(res.data.data) )
       .catch(error=>console.log(error)); 

      }
       registerUserdata()
  }, []);

  const generatePDF= useReactToPrint({
      content: ()=>conponentPDF.current,
      documentTitle:"Userdata",
      onAfterPrint:()=>alert("Data saved in PDF")
  });
   
  return (
    <div>
      <Navbar activeIndex={4} />

      <div className="container">
                <div className="row">
                    <div className="col-md-12">
                    <h5 className="mt-2">User List</h5> 
                      
                    <div className="d-grid d-md-flex justify-content-md-end mb-3">
                    <Link to="/userregistration" className="btn btn-success">Add New User</Link>                       
                    </div> 
                   <div ref={conponentPDF} style={{width:'100%'}}>
                    <table className="table table-bordered" >
                        <thead className="bg-light">
                           <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Action</th>
                            </tr> 
                        </thead>
                        <tbody>
                            {
                                userData.map( (uData, index)=>(
                                 <tr key={index}>
                                <td>{index+1}</td>
                                <td>{user.user_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link to="/userUpdate" ><Button className="btn btn-success mx-2">Update</Button></Link>
                                    <Link to="/userDelete" ><Button  className="btn btn-danger">Delete</Button></Link>
                                </td>
                            </tr>
                            )) }
                        </tbody>                        
                    </table>         
                    </div>
                    <div className="d-grid d-md-flex justify-content-md-end mb-3">
                    <Button className="btn btn-success" onClick={ generatePDF}>PDF</Button>                       
                    </div> 
                    </div>
                </div>
            </div>           
    </div>
  )
}


export default Reports
