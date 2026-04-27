import { useEffect, useRef, useCallback } from "react";

interface UseIdleLogoutOptions {
  timeout?: number; // Tempo em milissegundos (padrão: 15 minutos)
  onLogout: () => void;
  enabled?: boolean;
}

export function useIdleLogout({
  timeout = 15 * 60 * 1000,
  onLogout,
  enabled = true,
}: UseIdleLogoutOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (enabled) {
      // Usar uma referência estável para onLogout para evitar loops
      timerRef.current = setTimeout(() => {
        console.log("[IdleLogout] Inatividade detectada, executando logout...");
        onLogout();
      }, timeout);
    }
  }, [enabled, timeout, onLogout]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // Inicializar o timer
    resetTimer();

    // Adicionar listeners para atividade do usuário
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, resetTimer]);

  return { resetTimer };
}
