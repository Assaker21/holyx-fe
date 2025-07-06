import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useApi from "../hooks/useApi.hook";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginApi = useApi({ settings: { url: "/login", method: "post" } });
  const userApi = useApi({ settings: { url: "/profile", method: "get" } });

  const login = async (credentials) => {
    setLoading(true);
    const response = await loginApi.call({
      body: credentials,
    });
    if (response.ok) {
      localStorage.setItem("access", response.data.access);
      await fetchUser(false);
      navigate("/");
    }
    setLoading(false);

    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("access");
  };

  const fetchUser = async (loading = true) => {
    if (loading) setLoading(true);
    const response = await userApi.call({});
    if (response.ok) {
      setUser(response.data);
    }
    if (loading) setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading: loginApi.loading || userApi.loading || loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
