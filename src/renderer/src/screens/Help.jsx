//import  { useState } from 'react'
//import Login from './Login'
//import { Button } from "primereact/button";
import { useNavigate } from 'react-router-dom'

const Help = () => {
  const navigator = useNavigate()

  return (<div>

    <div>code here</div>






    <div onClick={() => navigator('/')}>Go Login</div></div>)
}

export default Help
