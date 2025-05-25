import { useState } from 'react'
import { Route, Routes ,BrowserRouter } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import RessourcesTable from './lists/RessourcesList'
import AddRessource from './pages/addRessource'
import EditRessource from './pages/editRessource'
import PlanList from './lists/planList'
import AddPlan from './pages/addPlan'
import EditPlan from './pages/editPlan'
import CategorieList from './lists/CategorieList'
import AddCategorie from './pages/addCategorie'
import AbonnementList from './lists/AbonnementList'
import AddAbonnement from './pages/AddAbonnement'
import EditAbonnement from './pages/editAbonnement'
import PaiementsList from './lists/paiementsList'
import Sidebar from './sidebar/sidebar'
import AddPaiement from './pages/AddPaiement'
import EditPaiement from './pages/editPaiement'


import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import UserDetail from './pages/users/UserDetail'
import UserProfile from './pages/users/UserProfile'

import CoachObjectivesPage from './pages/Objectifs'

import FeedbackList from './lists/feedbackList'

import ObjectifsList from './lists/ObjectifsList'
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1> */}
      <BrowserRouter>
      
      <Routes>
        {/* Public route */}
        <Route path='/' element={<Sidebar/>} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path='/ressources' element={<RessourcesTable/>} />
        <Route path='/addRessource' element={<AddRessource/>} />
        <Route path='/editRessource/:id' element={<EditRessource/>} />

        <Route path='/plans' element={<PlanList/>} />
        <Route path='/addPlan' element={<AddPlan/>} />
        <Route path="/editPlan/:id" element={<EditPlan />} />

        <Route path='/categories' element={<CategorieList/>} />
        <Route path='/addCategorie' element={<AddCategorie/>} />

        <Route path='/abonnements' element={<AbonnementList/>} />
        <Route path='/addAbonnement' element={<AddAbonnement/>} />
        <Route path='/editAbonnement/:id' element={<EditAbonnement/>} />

        <Route path='/paiements' element={<PaiementsList/>} />
        <Route path='/addPaiement' element={<AddPaiement/>} />
        <Route path="/editPaiement/:id" element={<EditPaiement />} />



        
        <Route path="/users" element={<UserList />} />
        <Route path="/users/add" element={ <UserForm />} />
        <Route path="/users/edit/:id" element={<UserForm />} />
        <Route path="/users/:id" element={ <UserDetail /> } />
        <Route path="/profile" element={ <UserProfile />} />



      
        {/* <Route path='/objectifs' element={<CoachObjectivesPage/>} /> */}
        <Route path='/objectifs' element={<ObjectifsList/>} />
        

         <Route path='/feedbackList' element={<FeedbackList/>} />




      </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
