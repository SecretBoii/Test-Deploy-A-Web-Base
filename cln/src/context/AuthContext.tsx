import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../api/client";

interface User {
    userId: number;
    username: string;
    roleId: number;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
        try {
                const response = await apiClient.get('/profile');
                setUser(response.data);            
        }
        catch (err) {
            sessionStorage.clear();
            setUser(null);
        } 
        finally {
            setLoading(false);
        }
    };
    checkAuthStatus();
  }, []);

const logout = async () => {
    try{
        await apiClient.post('/logout');
        sessionStorage.clear();
        setUser(null);
    }catch(err){
        console.error('logout error',err);
    }
};

return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
        {children}
    </AuthContext.Provider>
    );  
}   

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

