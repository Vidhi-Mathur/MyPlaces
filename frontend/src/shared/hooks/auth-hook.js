import { useState, useEffect, useCallback } from "react";
let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false)
    const [tokenExpiry, setTokenExpiry] = useState()
    const [userId, setUserId] = useState(false)
  
    const login = useCallback((uid, token, expirationDate) => {
        setToken(token)
        setUserId(uid)
        const expiry = expirationDate || new Date(new Date().getTime() + 1000*60*60)
        setTokenExpiry(expiry)
        localStorage.setItem('userData', JSON.stringify({userId: uid, token: token, expiry: expiry.toISOString()}))
    },[])

    const logout = useCallback(() => {
        setToken(null)
        setTokenExpiry(null)
        setUserId(null)
        localStorage.removeItem('userData')
    }, [])
  
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'))
        if(storedData && storedData.token && new Date(storedData.expiry) > new Date()){
          login(storedData.userId, storedData.token, new Date(storedData.expiry))
        }
    }, [login])
  
    useEffect(() => {
        if(token && tokenExpiry){
            const remaining = tokenExpiry.getTime() - new Date().getTime()
            logoutTimer = setTimeout(logout, remaining)
        }
        else {
            clearTimeout(logoutTimer)
        }
    }, [token, tokenExpiry, logout])

  return {token, login, logout, userId}

}