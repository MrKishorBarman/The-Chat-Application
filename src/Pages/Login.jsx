import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import '../index.css'


const Login = () => {

  const {user, handleLogin} = useAuth()

  const navigate = useNavigate()

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  useEffect(()=> {
    if (user) navigate('/')
  }, [user])

  const handleInputChange = (e) => {
    let name = e.target.name 
    let value = e.target.value

    setCredentials({...credentials, [name]:value})
    // console.log(credentials)
  } 

  return (
    <div className='auth--container'>
      <div className='form--wrapper'>
        <form onSubmit={(e) => {handleLogin(e, credentials)}}>

          <div className='field--wrapper'>
            <label>Email:</label>
            <input
              type='email'
              required
              name='email'
              placeholder='Enter your email...'
              value={credentials.email}
              onChange={(e) => {handleInputChange(e)}}
            />
          </div>

          <div className='field--wrapper'>
            <label>Password:</label>
            <input
              type='password'
              required
              name='password'
              placeholder='Enter your password...'
              value={credentials.password}
              onChange={(e) => {handleInputChange(e)}}
              />
          </div>

          <div className='field--wrapper'>
            <input
            className='btn btn--lg btn--main'
             type='submit'
             value="Login"
              />
          </div>

        </form>

        <p>Don't have an account? Register <Link to='/register'>here</Link></p>
      </div>
    </div>
  )
}

export default Login
