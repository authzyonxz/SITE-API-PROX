import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

type LocalUser = {
  id: number;
  username: string;
  role: "admin" | "reseller";
  credits: number;
};

type LocalAuthContextType = {
  user: LocalUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refetch: () => void;
};

const LocalAuthContext = createContext<LocalAuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  refetch: () => {},
});

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = trpc.localAuth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = data ?? null;

  return (
    <LocalAuthContext.Provider
      value={{
        user,
        loading: isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        refetch,
      }}
    >
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  return useContext(LocalAuthContext);
}
