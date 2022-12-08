import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const authStr = localStorage.getItem("bookstop_auth");
    if (authStr) {
      setAuth(JSON.parse(authStr));
    }
  }, []);

  useEffect(() => {
    if (auth) {
      localStorage.setItem("bookstop_auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("bookstop_auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  return { auth, setAuth };
};
