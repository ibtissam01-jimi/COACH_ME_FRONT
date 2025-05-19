import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/Login'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import UserDetail from './pages/users/UserDetail'
import UserProfile from '@/pages/users/UserProfile'
import './App.css'
import { Toaster } from "@/components/ui/toaster"

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register/>} />
          
         
          <Route path="/users" element={
           
              <UserList />
            
          } />
          <Route path="/users/add" element={
           
              <UserForm />
            
          } />
          <Route path="/users/edit/:id" element={
           
              <UserForm />
            
          } />
          <Route path="/users/:id" element={
           
              <UserDetail />
            
          } />
          <Route path="/profile" element={
           
              <UserProfile />
            
          } />
        </Routes>
        {/* </AuthProvider> */}
      </div>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
