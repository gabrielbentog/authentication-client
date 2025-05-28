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
} from "lucide-react"
import Link from "next/link"
import { loginAction } from "@/app/actions/auth"

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
    default: "border-border text-foreground",
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

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, {
    message: "",
    errors: {},
  })
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [floatingElementsStyles, setFloatingElementsStyles] = useState<React.CSSProperties[]>([]); // State for styles

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

    // Generate styles for floating elements on client side
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
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000 ease-in-out`}
          />

          {/* Floating Elements */}
          {floatingElementsStyles.length > 0 && ( // Render only when styles are generated
            <div className="absolute inset-0">
              {floatingElementsStyles.map((style, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                  style={style} // Apply the generated styles
                />
              ))}
            </div>
          )}

          {/* Geometric Shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-spin-slow" />
          <div className="absolute bottom-32 right-16 w-24 h-24 border-2 border-white/30 rotate-45 animate-pulse" />
          <div className="absolute top-1/2 left-8 w-16 h-16 bg-white/10 rounded-lg rotate-12 animate-bounce-slow" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center w-full max-w-none px-4 lg:px-12 text-white">
          <div className="relative min-h-[300px] w-full">
            {slides.map((slide, index) => {
              const Icon = slide.icon;
              const isActive = index === currentSlide;

              return (
                <div
                  key={index}
                  className={`
                    absolute inset-0 w-full transition-opacity duration-700 ease-out
                    ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}
                  `}
                >
                  {/* Ícone */}
                  <div
                    className={`
                      mb-6 flex justify-center transition-all duration-700 ease-out transform
                      ${isActive ? "opacity-100 translate-y-0 delay-100" : "opacity-0 -translate-y-4"}
                    `}
                  >
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <Icon className="w-12 h-12" />
                    </div>
                  </div>

                  {/* Título */}
                  <h2
                    className={`
                      text-4xl font-bold mb-4 leading-tight transition-all duration-700 ease-out transform
                      ${isActive ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-4"}
                    `}
                  >
                    {slide.title}
                  </h2>

                  {/* Descrição */}
                  <p
                    className={`
                      text-xl text-white/90 max-w-md mx-auto leading-relaxed text-left transition-all duration-700 ease-out transform
                      ${isActive ? "opacity-100 translate-y-0 delay-[300ms]" : "opacity-0 -translate-y-4"}
                    `}
                  >
                    {slide.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={prevSlide}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Bem-vindo de volta</h1>
            <p className="text-slate-600 dark:text-slate-400">Entre na sua conta para continuar sua jornada</p>
          </div>

          {/* Social Login */}
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">ou continue com email</span>
            </div>
          </div>

          {/* Login Form */}
          <form action={formAction} className="space-y-6">
            {state.message && (
              <Alert variant={state.message.includes("sucesso") ? "default" : "destructive"} className="border-l-4">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
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
                      placeholder="Digite sua senha"
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
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  disabled={isPending}
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">Lembrar de mim</span>
              </label>
              <Link
                href="/esqueci-a-senha"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Esqueceu a senha?
              </Link>
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
                  Entrando...
                </>
              ) : (
                <>
                  Entrar na conta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Sign up link */}
            <div className="text-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Não tem uma conta?{" "}
                <Link
                  href="/registro"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Cadastre-se gratuitamente
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
