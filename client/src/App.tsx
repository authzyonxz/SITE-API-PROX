import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PanelLayout from "./components/PanelLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CriarKey from "./pages/CriarKey";
import ChecarKey from "./pages/ChecarKey";
import AtualizarIP from "./pages/AtualizarIP";
import DeletarKey from "./pages/DeletarKey";
import CriarUsuario from "./pages/CriarUsuario";
import Logs from "./pages/Logs";
import BuscarKey from "./pages/BuscarKey";
import Blacklist from "./pages/Blacklist";
import GerarHistory from "./pages/GerarHistory";
import PublicUpdateIp from "@/pages/PublicUpdateIp";
import NatsuUpdateIp from "@/pages/NatsuUpdateIp";
import GranjeiroUpdateIp from "@/pages/GranjeiroUpdateIp";
import AppleIosUpdateIp from "@/pages/AppleIosUpdateIp";
import ProxyIosUpdateIp from "@/pages/ProxyIosUpdateIp";
import AraaoProxyUpdateIp from "@/pages/AraaoProxyUpdateIp";
import HyperProxyUpdateIp from "./pages/HyperProxyUpdateIp";
import SensiMenstruadaUpdateIp from "./pages/SensiMenstruadaUpdateIp";

import AllHackUpdateIp from "@/pages/AllHackUpdateIp";
import FreeFireUpdateIp from "@/pages/FreeFireUpdateIp";
import ChukyXiterUpdateIp from "@/pages/ChukyXiterUpdateIp";
import ProxyGranjeiro from "@/pages/ProxyGranjeiro";

import JzXiterUpdateIp from "@/pages/JzXiterUpdateIp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/update-ip" component={PublicUpdateIp} />
      <Route path="/natsu-update-ip" component={NatsuUpdateIp} />
      <Route path="/granjeiro-update-ip" component={GranjeiroUpdateIp} />
      <Route path="/apple-ios-update-ip" component={AppleIosUpdateIp} />
      <Route path="/proxy-ios-update-ip" component={ProxyIosUpdateIp} />
      <Route path="/araao-proxy" component={AraaoProxyUpdateIp} />
      <Route path="/hyper-proxy" component={HyperProxyUpdateIp} />
      <Route path="/sensi-menstruada" component={SensiMenstruadaUpdateIp} />
      <Route path="/all-hack-update-ip" component={AllHackUpdateIp} />
      <Route path="/free-fire-update-ip" component={FreeFireUpdateIp} />
      <Route path="/chuky-xiter-update-ip" component={ChukyXiterUpdateIp} />
      <Route path="/proxy-granjeiro" component={ProxyGranjeiro} />

      <Route path="/jz-xiter-update-ip" component={JzXiterUpdateIp} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <PanelLayout><Dashboard /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/criar-key">
        <ProtectedRoute>
          <PanelLayout><CriarKey /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/checar-key">
        <ProtectedRoute>
          <PanelLayout><ChecarKey /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/atualizar-ip">
        <ProtectedRoute>
          <PanelLayout><AtualizarIP /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/deletar-key">
        <ProtectedRoute>
          <PanelLayout><DeletarKey /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/criar-usuario">
        <ProtectedRoute adminOnly>
          <PanelLayout><CriarUsuario /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/logs">
        <ProtectedRoute adminOnly>
          <PanelLayout><Logs /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/buscar-key">
        <ProtectedRoute adminOnly>
          <PanelLayout><BuscarKey /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/blacklist">
        <ProtectedRoute adminOnly>
          <PanelLayout><Blacklist /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/historico-geracao">
        <ProtectedRoute adminOnly>
          <PanelLayout><GerarHistory /></PanelLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <LanguageProvider>
            <LocalAuthProvider>
              <Toaster
                theme="dark"
                position="top-center"
                toastOptions={{
                  style: {
                    background: "rgba(15, 15, 25, 0.8)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#ffffff",
                    fontFamily: "'Orbitron', sans-serif",
                    borderRadius: "24px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                    padding: "16px 24px",
                  },
                  className: "sonner-toast-custom",
                }}
              />
              <Router />
            </LocalAuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
