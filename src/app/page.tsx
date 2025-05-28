"use client"

import { useState } from "react"
import { CheckCircle, Sparkles, PartyPopper } from "lucide-react"
import confetti from "canvas-confetti"
import { logoutAction } from "@/app/actions/logout"

export default function LoginSuccessPage() {
  const [isFireworking, setIsFireworking] = useState(false)

  const fireFireworks = () => {
    if (isFireworking) return // Evita múltiplos cliques simultâneos

    setIsFireworking(true)

    // Função para criar jorro contínuo de confetes
    const createFireworkStream = (side: "left" | "right") => {
      const isLeft = side === "left"
      const originX = isLeft ? 0.05 : 0.95 // Posição horizontal
      const angle = isLeft ? 60 : 120 // Ângulo diagonal

      // Cores vibrantes para cada lado
      const leftColors = ["#ff0066", "#00ff66", "#6600ff", "#ffff00", "#ff6600", "#00ffff"]
      const rightColors = ["#ff3366", "#33ff66", "#3366ff", "#ffff33", "#ff9933", "#33ffff"]
      const colors = isLeft ? leftColors : rightColors

      // Jorro contínuo por 3 segundos
      const streamDuration = 3000 // 3 segundos
      const burstInterval = 100 // Nova rajada a cada 100ms
      const totalBursts = streamDuration / burstInterval

      for (let i = 0; i < totalBursts; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 15, // Menos partículas por rajada para efeito contínuo
            angle: angle + (Math.random() - 0.5) * 20, // Variação no ângulo
            spread: 35,
            origin: {
              x: originX + (Math.random() - 0.5) * 0.1, // Pequena variação na posição
              y: 0.9 + (Math.random() - 0.5) * 0.1,
            },
            colors: colors,
            gravity: 0.4, // REDUZIDO: Menos gravidade = vão mais alto
            scalar: 1.0 + Math.random() * 0.5, // Tamanhos variados
            drift: isLeft ? 0.5 : -0.5, // Drift para o centro
            ticks: 400, // AUMENTADO: Mais tempo no ar
            startVelocity: 80 + Math.random() * 30, // AUMENTADO: Velocidade inicial muito maior (era 45+15)
          })
        }, i * burstInterval)
      }
    }

    // Inicia os fogos dos dois lados simultaneamente
    createFireworkStream("left")
    createFireworkStream("right")

    // Explosões extras no meio do jorro para mais impacto
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 60,
        origin: { x: 0.3, y: 0.7 },
        colors: ["#ff1744", "#00e676", "#2979ff", "#ffc107"],
        gravity: 0.3, // REDUZIDO: Menos gravidade
        scalar: 1.2,
        ticks: 500, // AUMENTADO: Mais tempo no ar
        startVelocity: 90, // AUMENTADO: Velocidade inicial maior
      })
    }, 1000)

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 60,
        origin: { x: 0.7, y: 0.7 },
        colors: ["#e91e63", "#4caf50", "#3f51b5", "#ff9800"],
        gravity: 0.3, // REDUZIDO: Menos gravidade
        scalar: 1.2,
        ticks: 500, // AUMENTADO: Mais tempo no ar
        startVelocity: 90, // AUMENTADO: Velocidade inicial maior
      })
    }, 1500)

    // Grande finale
    setTimeout(() => {
      // Explosão final do lado esquerdo
      confetti({
        particleCount: 80,
        angle: 45,
        spread: 80,
        origin: { x: 0.1, y: 0.8 },
        colors: ["#ff5722", "#009688", "#673ab7", "#cddc39"],
        gravity: 0.2, // MUITO REDUZIDO: Quase sem gravidade
        scalar: 1.4,
        drift: 1,
        ticks: 600, // MUITO AUMENTADO: Muito tempo no ar
        startVelocity: 100, // MUITO AUMENTADO: Velocidade máxima
      })

      // Explosão final do lado direito
      confetti({
        particleCount: 80,
        angle: 135,
        spread: 80,
        origin: { x: 0.9, y: 0.8 },
        colors: ["#f44336", "#00bcd4", "#9c27b0", "#8bc34a"],
        gravity: 0.2, // MUITO REDUZIDO: Quase sem gravidade
        scalar: 1.4,
        drift: -1,
        ticks: 600, // MUITO AUMENTADO: Muito tempo no ar
        startVelocity: 100, // MUITO AUMENTADO: Velocidade máxima
      })
    }, 2500)

    // Libera o botão após o show completo
    setTimeout(() => {
      setIsFireworking(false)
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="text-center z-20 relative max-w-xl w-full space-y-8">
        {/* Ícone de sucesso */}
        <div className="relative mx-auto w-28 h-28 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-gentle">
          <CheckCircle className="w-14 h-14 text-white" />
          <Sparkles className="absolute -top-3 -right-3 w-7 h-7 text-yellow-500 animate-pulse" />
          <Sparkles className="absolute -bottom-3 -left-3 w-5 h-5 text-blue-500 animate-pulse delay-300" />
          <Sparkles className="absolute top-1/2 -right-8 w-6 h-6 text-purple-500 animate-pulse delay-500" />
          <Sparkles className="absolute top-1/4 -left-6 w-4 h-4 text-pink-500 animate-pulse delay-700" />
        </div>

        {/* Mensagem */}
        <h1 className="text-4xl md:text-10xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 animate-fade-in">
          🎉 Você está logado!
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 animate-fade-in-delay font-medium">
          Login realizado com sucesso! Bem-vindo de volta.
        </p>

        {/* Botão */}
        <div className="animate-fade-in-delay-2 flex flex-col items-center space-y-4">
          {/* Botão de fogos */}
          <button
            onClick={fireFireworks}
            disabled={isFireworking}
            className={`group px-10 py-4 bg-gradient-to-r text-white font-semibold text-lg md:text-xl rounded-full shadow-2xl transform transition-all duration-300 relative overflow-hidden ${
              isFireworking
                ? "from-gray-400 to-gray-600 cursor-not-allowed scale-95"
                : "from-purple-500 via-pink-500 to-red-500 hover:shadow-3xl hover:scale-105"
            }`}
          >
            <div className="flex items-center gap-2 justify-center">
              <PartyPopper className={`w-6 h-6 ${isFireworking ? "animate-spin" : "group-hover:animate-bounce"}`} />
              <span>{isFireworking ? "Fogos de Artifício!" : "Soltar Fogos! 🎆"}</span>
              <PartyPopper
                className={`w-6 h-6 ${isFireworking ? "animate-spin delay-100" : "group-hover:animate-bounce delay-100"}`}
              />
            </div>

            {!isFireworking && (
              <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 group-hover:animate-shimmer"></div>
            )}
          </button>

          {/* Botão de sair */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-md rounded-lg shadow"
            >
              Sair
            </button>
          </form>
        </div>
      </div>

      {/* Estilos animados continuam os mesmos */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out 0.4s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 1.2s ease-out 0.8s both;
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}
