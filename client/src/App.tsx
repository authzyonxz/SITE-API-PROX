import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocalAuthProvider } from "./contexts/LocalAuthContext";
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
import PublicUpdateIp from "@/pages/PublicUpdateIp";
import NatsuUpdateIp from "@/pages/NatsuUpdateIp";
import GranjeiroUpdateIp from "@/pages/GranjeiroUpdateIp";
import ProxyIosUpdateIp from "@/pages/ProxyIosUpdateIp";
import AllHackUpdateIp from "@/pages/AllHackUpdateIp";
import FreeFireUpdateIp from "@/pages/FreeFireUpdateIp";
import ChukyXiterUpdateIp from "@/pages/ChukyXiterUpdateIp";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/update-ip" component={PublicUpdateIp} />
      <Route path="/natsu-update-ip" component={NatsuUpdateIp} />
      <Route path="/granjeiro-update-ip" component={GranjeiroUpdateIp} />
      <Route path="/proxy-ios-update-ip" component={ProxyIosUpdateIp} />
      <Route path="/all-hack-update-ip" component={AllHackUpdateIp} />
      <Route path="/free-fire-update-ip" component={FreeFireUpdateIp} />
      <Route path="/chuky-xiter-update-ip" component={ChukyXiterUpdateIp} />
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
          <LocalAuthProvider>
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: "oklch(0.11 0.025 260)",
                  border: "1px solid rgba(0,212,255,0.2)",
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "'Rajdhani', sans-serif",
                },
              }}
            />
            <Router />
          </LocalAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
