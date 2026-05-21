import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    "login.title": "Acesse sua conta",
    "login.subtitle": "A próxima geração de autenticação segura.",
    "login.username": "Usuário",
    "login.username_placeholder": "Digite seu usuário",
    "login.password": "Senha",
    "login.password_placeholder": "Digite sua senha",
    "login.button": "Entrar no Painel",
    "login.welcome": "Bem-vindo de volta!",
    "login.success": "Login realizado com sucesso, redirecionando...",
    "login.failed": "Falha na autenticação",
    "login.invalid": "Credenciais inválidas, tente novamente.",
    "login.required": "Campos obrigatórios",
    "login.required_desc": "Por favor, insira usuário e senha.",
    "footer.rights": "TODOS OS DIREITOS RESERVADOS",
    "footer.secure": "ACESSO SEGURO",
  },
  en: {
    "login.title": "Sign In",
    "login.subtitle": "The next generation of secure authentication.",
    "login.username": "Username",
    "login.username_placeholder": "Enter your username",
    "login.password": "Password",
    "login.password_placeholder": "Enter your password",
    "login.button": "Sign In to Dashboard",
    "login.welcome": "Welcome back!",
    "login.success": "Login successful, redirecting...",
    "login.failed": "Authentication failed",
    "login.invalid": "Invalid credentials, please try again.",
    "login.required": "Required fields",
    "login.required_desc": "Please enter both username and password.",
    "footer.rights": "ALL RIGHTS RESERVED",
    "footer.secure": "SECURE ACCESS",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved as Language) || "pt";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["pt"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
