import React, {useState, useContext, useEffect} from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({children}) => {

  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const [ isLoading, setIsLoading ] = useState(true)
  const { captain, setCaptain } = useContext(CaptainDataContext)
    

  useEffect(() => {
    if (!token) {
        navigate('/captain-login')
    } 
  }, [token])

  axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((response) => {
      if (response.status === 200) {  
        const data = response.data
        setCaptain(data.captain)
        setIsLoading(false)
      }
    }).catch((error) => {
      console.error('Error fetching captain profile:', error)
      localStorage.removeItem('token')
      navigate('/captain-login')
    })

  if (isLoading) {
    return (
    <div className="flex justify-center items-center h-screen">Loading...</div>
    )
  }

  return (
    <>
     
     {children}
    
    </>
    
  )
}

export default CaptainProtectWrapper
