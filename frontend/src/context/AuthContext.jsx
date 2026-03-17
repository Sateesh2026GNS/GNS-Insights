import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const storedUser = () => {
  try {
    const stored = localStorage.getItem("smrt-user");
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storedUser);

  const login = (authData) => {
    let u;
    if (typeof authData === "object" && authData !== null) {
      const token = authData.access_token ?? authData.token;
      const userPayload = authData.user ?? authData;
      const rest = { ...userPayload };
      delete rest.access_token;
      u = {
        ...rest,
        name: userPayload.full_name ?? userPayload.name ?? "User",
        role: userPayload.role ?? rest.role ?? "Operator",
      };
      if (token) {
        try {
          localStorage.setItem("smrt-token", token);
        } catch {}
      }
    } else {
      u = { name: String(authData), role: "Operator" };
    }
    setUser(u);
    try {
      localStorage.setItem("smrt-user", JSON.stringify(u));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("smrt-user");
      localStorage.removeItem("smrt-token");
    } catch {}
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
