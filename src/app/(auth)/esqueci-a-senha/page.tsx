"use client"

import { useActionState, useState, useEffect } from "react"
import type React from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  KeyRound,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { z } from "zod" // Import Zod

// ----- INÍCIO DOS COMPONENTES REUTILIZÁVEIS (Button, Input, Label, Alert, AlertDescription) -----
// Certifique-se de que seus componentes Button, Input, Label, Alert, AlertDescription estão definidos aqui ou importados.
// Colei as definições que você forneceu anteriormente para manter o exemplo completo.

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

function Button({ className = "", variant = "default", size = "default", children, ...props }: ButtonProps) {
  const baseStyles ="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90", // Supondo que 'primary' esteja definido no seu Tailwind config
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Supondo que 'destructive' esteja definido
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (<button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>);
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
function Input({ className = "", type, ...props }: InputProps) {
  return (<input type={type} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}/>);
}

// Label Component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}
function Label({ className = "", ...props }: LabelProps) {
  return (<label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}/>);
}

// Alert Components
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {variant?: "default" | "destructive"}
function Alert({ className = "", variant = "default", ...props }: AlertProps) {
  // Adapte as classes 'border-border', 'text-foreground', 'border-destructive', 'text-destructive'
  // conforme as suas definições do Tailwind CSS.
  const variantClasses = {
    default: "border-blue-500 text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700", // Exemplo de estilo para 'default'
    destructive: "border-red-500 text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700", // Exemplo de estilo para 'destructive'
  };
  const currentVariantClass = variant === 'destructive' ? variantClasses.destructive : variantClasses.default;

  return (<div role="alert" className={`relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7 ${currentVariantClass} ${className}`} {...props}/>);
}
function AlertDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />;
}
// ----- FIM DOS COMPONENTES REUTILIZÁVEIS -----

// Tipagem para o estado das actions de senha
interface PasswordActionState {
  message: string;
  errors?: {
    email?: string[];
    code?: string[];
    password?: string[];
    password_confirmation?: string[];
    _form?: string[]; // Para erros gerais do formulário
  };
  success: boolean;
  submittedEmail?: string; // Para passar o e-mail para o próximo passo
}

// Esquema de validação para solicitar o código de reset
const requestResetSchema = z.object({
  email: z.string().email({ message: "Formato de email inválido." }),
});

// Server action para solicitar o código de reset de senha
async function requestPasswordResetAction(
  prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const validatedFields = requestResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      message: "Dados inválidos. Verifique o e-mail inserido.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { email } = validatedFields.data;
  const apiHost = process.env.NEXT_PUBLIC_API_HOST

  try {
    const response = await fetch(`${apiHost}/auth/password/send_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // A API send_code sempre retorna 200 OK e uma mensagem genérica,
      // mesmo que o e-mail não exista, para evitar enumeração de e-mails.
      // Então, um erro aqui seria inesperado (ex: problema de servidor).
      return {
        message: responseData.message || "Ocorreu um erro ao solicitar o código. Tente novamente.",
        errors: { _form: [responseData.message || "Erro do servidor."] },
        success: false,
      };
    }
    
    // Sucesso - a API retornou a mensagem padrão
    return {
      message: responseData.message, // "Se o e-mail existir, um código foi enviado."
      errors: {},
      success: true,
      submittedEmail: email, // Passa o e-mail para o próximo passo
    };

  } catch (error) {
    console.error("requestPasswordResetAction Error:", error);
    return {
      message: "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      errors: { _form: ["Erro de conexão."] },
      success: false,
    };
  }
}

// Esquema de validação para redefinir a senha com o código
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Email inválido." }), // Vem do estado, mas validamos
  code: z.string().min(1, { message: "O código de verificação é obrigatório." }),
  password: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
  password_confirmation: z.string(),
}).refine(data => data.password === data.password_confirmation, {
  message: "As senhas não coincidem.",
  path: ["password_confirmation"], // Erro associado ao campo de confirmação
});


// Server action para redefinir a senha com o código
async function resetPasswordWithCodeAction(
  prevState: PasswordActionState,
  formData: FormData
): Promise<PasswordActionState> {
  const validatedFields = resetPasswordSchema.safeParse({
    email: formData.get("email"), // O e-mail é enviado via campo oculto
    code: formData.get("code"),
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  if (!validatedFields.success) {
    return {
      message: "Dados inválidos. Verifique os campos e tente novamente.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      submittedEmail: formData.get("email") as string || undefined, // Manter o e-mail no estado
    };
  }

  const { email, code, password, password_confirmation } = validatedFields.data;
  const apiHost = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

  try {
    const response = await fetch(`${apiHost}/auth/password/reset_with_code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password, password_confirmation }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Status 422 para erros de validação da API (código inválido, senhas não batem, etc.)
      let apiErrorMessage = "Erro ao redefinir senha.";
      if (responseData.error) {
        apiErrorMessage = Array.isArray(responseData.error) ? responseData.error.join(", ") : responseData.error;
      }
      
      // Tenta mapear erros para campos específicos se a API retornar um objeto de erros
      // Sua API atual retorna uma string ou array em 'error', então usaremos _form
      const fieldErrors: PasswordActionState['errors'] = { _form: [apiErrorMessage] };
      if (apiErrorMessage.toLowerCase().includes("código")) {
        fieldErrors.code = [apiErrorMessage];
      } else if (apiErrorMessage.toLowerCase().includes("senha")) {
        fieldErrors.password = [apiErrorMessage];
      }

      return {
        message: apiErrorMessage,
        errors: fieldErrors,
        success: false,
        submittedEmail: email,
      };
    }

    // Sucesso - senha redefinida
    return {
      message: responseData.message, // "Senha redefinida com sucesso."
      errors: {},
      success: true,
      submittedEmail: email,
    };

  } catch (error) {
    console.error("resetPasswordWithCodeAction Error:", error);
    return {
      message: "Não foi possível conectar ao servidor. Tente novamente.",
      errors: { _form: ["Erro de conexão."] },
      success: false,
      submittedEmail: email,
    };
  }
}


const slides = [
  {
    title: "Recupere seu Acesso",
    description: "Processo simples e seguro para você voltar a ter controle da sua conta rapidamente.",
    icon: Shield,
    gradient: "from-cyan-600 via-sky-600 to-blue-600",
  },
  {
    title: "Segurança em Primeiro Lugar",
    description: "Utilizamos códigos de verificação enviados diretamente para seu e-mail para garantir sua identidade.",
    icon: Lock,
    gradient: "from-teal-600 via-emerald-600 to-green-600",
  },
  {
    title: "Suporte Ágil",
    description: "Se encontrar dificuldades, nossa equipe de suporte está pronta para ajudar a qualquer momento.",
    icon: Sparkles,
    gradient: "from-purple-600 via-pink-600 to-rose-600",
  },
];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request_code' | 'reset_password'>('request_code');
  const [emailForReset, setEmailForReset] = useState<string>("");

  const initialRequestState: PasswordActionState = { message: "", errors: {}, success: false, submittedEmail: "" };
  const [requestCodeState, requestCodeFormAction, isRequestCodePending] = useActionState(
    requestPasswordResetAction,
    initialRequestState
  );

  const initialResetState: PasswordActionState = { message: "", errors: {}, success: false };
  const [resetPasswordState, resetPasswordFormAction, isResetPasswordPending] = useActionState(
    resetPasswordWithCodeAction,
    initialResetState
  );

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [floatingElementsStyles, setFloatingElementsStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const styles = Array(20).fill(null).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));
    setFloatingElementsStyles(styles);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (requestCodeState.success && requestCodeState.submittedEmail) {
      setEmailForReset(requestCodeState.submittedEmail);
      setStep('reset_password');
      // Limpar o estado da action anterior para não mostrar mensagem de sucesso na próxima tela
      // (Opcional, mas pode melhorar a UX)
      // Se você tiver uma função para resetar o estado da action, chame-a aqui.
      // Por ora, a mensagem de sucesso será exibida brevemente.
    }
  }, [requestCodeState.success, requestCodeState.submittedEmail]);

  // Não é mais necessário, useActionState lida com o submit
  // const handleRequestCodeFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => { ... };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000 ease-in-out`}
          />
          {floatingElementsStyles.length > 0 && (
            <div className="absolute inset-0">
              {floatingElementsStyles.map((style, i) => (
                <div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse" style={style} />
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
                <div key={index} className={`absolute inset-0 w-full transition-opacity duration-700 ease-out ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className={`mb-6 flex justify-center transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-100" : "opacity-0 -translate-y-4"}`}>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"><Icon className="w-12 h-12" /></div>
                  </div>
                  <h2 className={`text-4xl font-bold mb-4 leading-tight transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-200" : "opacity-0 -translate-y-4"}`}>{slide.title}</h2>
                  <p className={`text-xl text-white/90 max-w-md mx-auto leading-relaxed text-left transition-all duration-700 ease-out transform ${isActive ? "opacity-100 translate-y-0 delay-[300ms]" : "opacity-0 -translate-y-4"}`}>{slide.description}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={prevSlide} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex space-x-2">
              {slides.map((_, index) => (<button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-white" : "bg-white/40"}`} />))}
            </div>
            <button onClick={nextSlide} className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Right side - Password Recovery Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600">
                <HelpCircle className="w-7 h-7" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {step === 'request_code' ? "Esqueceu sua senha?" : "Redefinir Senha"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {step === 'request_code'
                ? "Não se preocupe! Insira seu e-mail para enviarmos um código de recuperação."
                : (resetPasswordState.success ? "Sua senha foi alterada com sucesso!" : `Um código foi enviado para ${emailForReset}. Insira-o abaixo com sua nova senha.`)}
            </p>
          </div>

          {step === 'request_code' && (
            <form action={requestCodeFormAction} className="space-y-6">
              {/* Exibe mensagem de erro geral ou da API para o passo de solicitar código */}
              {(requestCodeState.message && !requestCodeState.success && requestCodeState.errors?._form) && (
                <Alert variant="destructive" className="border-l-4">
                  <AlertDescription>{requestCodeState.errors._form.join(', ')}</AlertDescription>
                </Alert>
              )}
              {/* Exibe mensagem de erro específica do campo email */}
              {(requestCodeState.message && !requestCodeState.success && requestCodeState.errors?.email) && (
                 <Alert variant="destructive" className="border-l-4">
                   <AlertDescription>{requestCodeState.errors.email.join(', ')}</AlertDescription>
                 </Alert>
              )}
              {/* Exibe mensagem de sucesso APÓS o envio do código, antes da transição de passo */}
              {(requestCodeState.message && requestCodeState.success && step === 'request_code') && (
                 <Alert variant="default" className="border-l-4">
                   <AlertDescription>{requestCodeState.message}</AlertDescription>
                 </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email-request" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Seu endereço de e-mail
                </Label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "email-request" ? "opacity-100" : ""}`} style={{ padding: "1px" }}>
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "email-request" ? "text-blue-600" : "text-slate-400"}`} />
                    <Input
                      id="email-request"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isRequestCodePending}
                      onFocus={() => setFocusedField("email-request")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {/* Erro específico do Zod para o campo email, caso não seja _form */}
                {requestCodeState.errors?.email && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{requestCodeState.errors.email.join(', ')}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                disabled={isRequestCodePending}
              >
                {isRequestCodePending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Enviando...</>
                ) : (
                  <>Enviar Código de Recuperação <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>

              <div className="text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Lembrou a senha?{" "}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Fazer login
                  </Link>
                </span>
              </div>
            </form>
          )}

          {step === 'reset_password' && (
            <form action={resetPasswordFormAction} className="space-y-6">
              {/* Exibe mensagem geral (sucesso ou erro) para o passo de redefinir senha */}
              {resetPasswordState.message && (
                <Alert variant={resetPasswordState.success ? "default" : "destructive"} className="border-l-4">
                  <AlertDescription>{resetPasswordState.message}</AlertDescription>
                </Alert>
              )}
              
              <input type="hidden" name="email" value={emailForReset} />

              <div className="space-y-2">
                <Label htmlFor="email-display" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </Label>
                 <Input
                    id="email-display"
                    type="email"
                    value={emailForReset}
                    readOnly
                    className="pl-3 h-12 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                  />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Código de Verificação
                </Label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "code" ? "opacity-100" : ""}`} style={{ padding: "1px" }}>
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" />
                  </div>
                  <div className="relative">
                    <KeyRound className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "code" ? "text-blue-600" : "text-slate-400"}`} />
                    <Input
                      id="code"
                      name="code"
                      type="text"
                      placeholder="Digite o código recebido"
                      className="pl-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isResetPasswordPending || resetPasswordState.success}
                      onFocus={() => setFocusedField("code")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
                {resetPasswordState.errors?.code && (
                  <p className="text-sm text-red-500 flex items-center mt-1">{resetPasswordState.errors.code.join(', ')}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "newPassword" ? "opacity-100" : ""}`} style={{ padding: "1px" }}><div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" /></div>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "newPassword" ? "text-blue-600" : "text-slate-400"}`} />
                    <Input
                      id="newPassword"
                      name="password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Sua nova senha"
                      className="pl-11 pr-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isResetPasswordPending || resetPasswordState.success}
                      onFocus={() => setFocusedField("newPassword")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)} disabled={isResetPasswordPending || resetPasswordState.success}>
                      {showNewPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                    </Button>
                  </div>
                </div>
                {resetPasswordState.errors?.password && (<p className="text-sm text-red-500 mt-1">{resetPasswordState.errors.password.join(', ')}</p>)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                 <div className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${focusedField === "confirmNewPassword" ? "opacity-100" : ""}`} style={{ padding: "1px" }}><div className="h-full w-full bg-white dark:bg-slate-900 rounded-lg" /></div>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-3 h-5 w-5 transition-colors ${focusedField === "confirmNewPassword" ? "text-blue-600" : "text-slate-400"}`} />
                    <Input
                      id="confirmNewPassword"
                      name="password_confirmation"
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Confirme sua nova senha"
                      className="pl-11 pr-11 h-12 border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-600"
                      required
                      disabled={isResetPasswordPending || resetPasswordState.success}
                      onFocus={() => setFocusedField("confirmNewPassword")}
                      onBlur={() => setFocusedField(null)}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} disabled={isResetPasswordPending || resetPasswordState.success}>
                      {showConfirmNewPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                    </Button>
                  </div>
                </div>
                {resetPasswordState.errors?.password_confirmation && (<p className="text-sm text-red-500 mt-1">{resetPasswordState.errors.password_confirmation.join(', ')}</p>)}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                disabled={isResetPasswordPending || resetPasswordState.success}
              >
                {isResetPasswordPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Redefinindo...</>
                ) : (
                  <>Redefinir Senha <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>

              {resetPasswordState.success ? (
                 <div className="text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        Ir para Login
                    </Link>
                    </span>
                </div>
              ) : (
                <div className="text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                    Não recebeu o código ou quer tentar com outro e-mail?{" "}
                    <button 
                        type="button" 
                        onClick={() => { 
                            setStep('request_code'); 
                            setEmailForReset(''); 
                            // Idealmente, você resetaria os estados das actions aqui se useActionState permitisse
                            // Por ora, as mensagens de erro/sucesso anteriores podem persistir brevemente
                            // ou você pode limpar manualmente os estados `requestCodeState` e `resetPasswordState`
                            // se tiver funções `set...State` para eles (o que `useActionState` não fornece diretamente).
                        }} 
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        Solicitar novamente
                    </button>
                    </span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
