import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Users from './users/pages/Users'
import NewPlace from './places/pages/NewPlace'
import {UserPlaces} from './places/pages/UserPlaces'
import MainNavigation from './shared/components/Navigation/MainNavigation'
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from './users/pages/Auth'
import { AuthContext } from './shared/context/auth-context'
import { useAuth } from './shared/hooks/auth-hook'
let routes

const App = () => {
    const { token, login, logout, userId } = useAuth()
        if(token){
            routes = (
                <>
                <Route path="/" element={<Users />}/>
                <Route path="/places/new" element={<NewPlace />}/>
                <Route path='/:userId/places' element={<UserPlaces />}/>
                <Route path='/places/:placeId' element={<UpdatePlace />}/>
                <Route path="*" element={<Navigate to="/" />} />
                </>
            )
        }
        else{
            routes = (
                <>
                <Route path="/" element={<Users />}/>
                <Route path='/:userId/places' element={<UserPlaces />}/>
                <Route path='/users/auth' element={<Auth />} />
                <Route path="*" element={<Navigate to="/users/auth" />} />
                </>
            )
        }
  return (
        <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout}}>
            <Router>
                <MainNavigation />
                <main>
                    <Routes>
                        {routes}
                    </Routes>
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App