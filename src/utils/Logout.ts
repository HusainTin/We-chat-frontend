import { userLogout } from "@/features/services/userService"
import { unSetUser } from "@/features/redux/user/userSlice"
import { unSetAuth } from "@/features/redux/auth/authSlice"

// import 
export const LogoutUser = async(dispatch:any)=>{
    
    try {
        await userLogout()
    } catch (error) {
        
    }finally{
        localStorage.clear()
        dispatch(unSetAuth())
        dispatch(unSetUser())
    }
}