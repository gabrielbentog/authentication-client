"use client"

import { useActionState } from "react"
import { useState, useEffect } from "react"
import type React from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  User, // Adicionado para o campo nome
} from "lucide-react"
import Link from "next/link"
// Substitua pela sua ação de registro
// import { loginAction } from "@/app/actions/auth"; // Ação original de login
import { registerAction } from "@/app/actions/auth"; // Assumindo que você criará esta ação

// ----- INÍCIO DOS COMPONENTES REUTILIZÁVEIS (Button, Input, Label, Alert, AlertDescription) -----
// Mantenha os componentes Button, Input, Label, Alert e AlertDescription como no seu arquivo original.
// Cole-os aqui ou importe-os de um arquivo de componentes compartilhados.
// Para fins de brevidade, não os repetirei aqui, mas eles são essenciais.

// Exemplo de como os componentes seriam definidos (baseado no seu código):

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

function Button({ className = "", variant = "default", size = "default", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ className = "", type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  )
}

// Alert Components
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
}

function Alert({ className = "", variant = "default", ...props }: AlertProps) {
  const variants = {
    default: "border-border text-foreground", // Adapte as cores se necessário para sucesso
    destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  }

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}

function AlertDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
}


// ----- FIM DOS COMPONENTES REUTILIZÁVEIS -----


const slides = [
  {
    title: "Segurança Avançada",
    description: "Protegemos seus dados com criptografia de ponta e autenticação multi-fator.",
    icon: Shield,
    gradient: "from-blue-600 via-purple-600 to-indigo-600",
  },
  {
    title: "Performance Extrema",
    description: "Experiência ultra-rápida com tecnologia de última geração e otimizações inteligentes.",
    icon: Zap,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
  },
  {
    title: "Inovação Constante",
    description: "Sempre à frente com recursos inovadores e atualizações que transformam sua experiência.",
    icon: Sparkles,
    gradient: "from-pink-600 via-rose-600 to-orange-600",
  },
]

export default function SignupPage() { // Nome do componente alterado
  const [state, formAction, isPending] = useActionState(registerAction, { // Alterado para registerAction
    message: "",
    errors: {},
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // Estado para confirmar senha
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [floatingElementsStyles, setFloatingElementsStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const styles = Array(20).fill(null).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));
    setFloatingElementsStyles(styles);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section (Mantida como no original) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000 ease-in-out`}
          />
          {floatingElementsStyles.length > 0 && (
            <div className="absolute inset-0">
              {floatingElementsStyles.map((style, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                  style={style}
                />
              ))}
            </div>
          )}
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-32 right-16 w-24 h-24 border-2 border-white/30 rotate-45 animate-pulse" />
          <div className="absolute top-1/2 left-8 w-16 h-16 bg-white/10 rounded-lg rotate-12 animate-bounce-slow" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center w-full max-w-none px-4 lg:px-12 text-white">
          <div className="relative min-h-[300px] w-full">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = index === currentSlide;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 w-full transition-opacity duration-700 ease-out ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                >
                  <div className={`mb-6 flex justify-center transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-100" : "opacity-0 -translate-y-4"}`}>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Icon className="w-12 h-12" />
                    </div>
                  </div>
                  <h2 className={`text-4xl font-bold mb-4 leading-tight transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-4"}`}>
                    {slide.title}
                  </h2>
                  <p className={`text-xl text-white/90 max-w-md mx-auto leading-relaxed text-left transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-[300ms]" : "opacity-0 -translate-y-4"}`}>
                    {slide.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={prevSlide} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Crie sua conta</h1>
            <p className="text-slate-600 dark:text-slate-400">Cadastre-se para começar sua jornada.</p>
          </div>

          {/* Social Login (Mantido, pode ser usado para registro também) */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continuar com Google
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Github className="w-5 h-5 mr-3" />
              Continuar com GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">ou cadastre-se com email</span>
            </div>
          </div>

          {/* Signup Form */}
          <form action={formAction} className="space-y-6">
            {state.message && (
              <Alert variant={state.message.includes("sucesso") ? "default" : "destructive"} className="border-l-4">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome Completo
                </Label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "name" ? "opacity-100" : ""}`}
                    style={{ padding: "1px" }}
                  >
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "name" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isPending}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {state.errors?.name && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{state.errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </Label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "email" ? "opacity-100" : ""}`}
                    style={{ padding: "1px" }}
                  >
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "email" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isPending}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {state.errors?.email && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{state.errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Senha
                </Label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "password" ? "opacity-100" : ""}`}
                    style={{ padding: "1px" }}
                  >
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "password" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha forte"
                      className="pl-11 pr-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isPending}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
                {state.errors?.password && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{state.errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirmar Senha
                </Label>
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "confirmPassword" ? "opacity-100" : ""}`}
                    style={{ padding: "1px" }}
                  >
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "confirmPassword" ? "text-blue-600" : "text-slate-400"}`}
                    />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className="pl-11 pr-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isPending}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isPending}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>
                {state.errors?.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{state.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
                <div className="flex items-start space-x-2">
                    <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
                    disabled={isPending}
                    // required // Descomente se for obrigatório
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                    Eu li e concordo com os{" "}
                    <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Termos de Serviço
                    </Link>{" "}
                    e a{" "}
                    <Link href="/privacy" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        Política de Privacidade
                    </Link>
                    .
                    </Label>
                </div>
                {state.errors?.terms && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{state.errors.terms}</p>
                )}
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Login link */}
            <div className="text-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Já tem uma conta?{" "}
                <Link
                  href="/login" // Alterado para a página de login
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Faça login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}