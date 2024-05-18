import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

export const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        getUserOnload()
    }, [])

    const getUserOnload = async () => {
        try{
            const accountDetails = await account.get()

            setUser(accountDetails)

        } catch (error) {
            console.info("There is some issue: ",error)
        }
        setLoading(false)
    }

    const handleLogin = async (e, credentials) => {
        e.preventDefault()

        try {
            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password
            )

            const accountDetails = await account.get()

            setUser(accountDetails)

            navigate("/")

        } catch (error) {
            alert(error)
        }
    }

    const handleLogout = async() => {
        await account.deleteSession('current')
        setUser(null)
    }

    const handleRegister = async (e, credentials) => {
        e.preventDefault()
        
        if (credentials.password1 !== credentials.password2) alert("Passwords do not match!!!")

        try {
            await account.create(
                ID.unique(), 
                credentials.email,
                credentials.password1,
                credentials.name        
            )

            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password1
            )

            const accountDetails = await account.get()
            setUser(accountDetails)

            navigate('/')

        } catch (error) {
            alert(error)
        }
    }

    return (
        <AuthContext.Provider value={{ user, handleLogin, handleLogout, handleRegister }}>
            {loading ? <p style={{fontSize: '34px', marginLeft: '10px'}}>loading...</p> : children}
        </AuthContext.Provider>
    )

}