"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { cookies } from "next/headers" // Para manipular cookies

// Esquema de validação dos dados do formulário
const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
})

export async function loginAction(prevState: any, formData: FormData) {
  // 1. Validar os campos do formulário com Zod
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Verifique os dados inseridos.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    // 2. Chamar sua API externa para autenticar
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    // 3. Tratar a resposta da API
    if (!response.ok) {
      let errorMessage = "Credenciais inválidas ou erro no servidor. Verifique seu email e senha."
      try {
        // Tentar obter uma mensagem de erro mais específica do corpo da resposta da API
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Se não conseguir parsear o JSON de erro, mantém a mensagem genérica
        console.error("Falha ao parsear JSON de erro da API:", e);
      }
      return {
        message: errorMessage,
        errors: {}, // Você pode popular isso se sua API retornar erros específicos por campo
      }
    }

    // Se a resposta for OK (status 2xx), a autenticação foi bem-sucedida
    const responseData = await response.json();

    // 4. Verificar se a API retornou um token (ajuste 'responseData.token' conforme necessário)
    if (responseData && responseData.data.authToken) {
      // Armazenar o token em um cookie HTTPOnly para segurança
      (await cookies()).set("authToken", responseData.data.authToken, { // Nome do cookie: 'authToken' (exemplo)
        httpOnly: true, // Impede acesso via JavaScript no cliente
        secure: process.env.NODE_ENV === "production", // Enviar apenas via HTTPS em produção
        path: "/",
        sameSite: "lax", // Proteção contra CSRF
        // maxAge: 60 * 60 * 24 * 7, // Opcional: Tempo de vida do cookie (ex: 7 dias em segundos)
      });
    } else {
      // Se a API não retornou o token esperado, mesmo com status OK
      return {
        message: "Autenticação bem-sucedida, mas resposta inesperada da API (token não encontrado).",
        errors: {},
      }
    }

  } catch (error) {
    console.error("Erro na loginAction:", error); // Logar o erro no servidor para debugging
    return {
      message: "Algo deu errado ao tentar conectar com o servidor. Tente novamente mais tarde.",
      errors: {},
    }
  }

  // O redirecionamento deve ocorrer fora do try/catch se o fluxo chegou aqui com sucesso
  // e o token foi setado.
  redirect("/");
}

// Esquema de validação dos dados do formulário de registro
const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Formato de email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "A confirmação da senha deve ter pelo menos 6 caracteres." }),
  // 'terms' é enviado como 'on' por FormData quando o checkbox está marcado e tem um 'name'
  terms: z.literal('on', {
    errorMap: () => ({ message: "Você deve aceitar os Termos de Serviço e a Política de Privacidade." })
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"], // Associa o erro de correspondência de senha ao campo confirmPassword
});

// Interface para o estado do formulário, usada por useActionState
interface RegisterState {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    terms?: string[];
    _form?: string[]; // Para erros gerais não associados a um campo específico
  };
  success?: boolean; // Flag para indicar sucesso, especialmente se não houver redirecionamento
}

export async function registerAction(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  // 1. Validar os campos do formulário
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms: formData.get("terms"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Verifique os dados inseridos.",
      success: false,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 2. Chamar a API para registrar o usuário
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // MODIFICAÇÃO AQUI: aninhar os dados do usuário sob a chave "user"
      body: JSON.stringify({
        user: {
          name,
          email,
          password,
          passwordConfirmation: validatedFields.data.confirmPassword, // Usar o valor validado
        }
      }),
    });

    const responseData = await response.json().catch(() => ({}));

    // ... (resto do tratamento da resposta, lógica de cookie e redirect)
    // 3. Tratar a resposta da API
    if (!response.ok) {
      return {
        message: responseData.message || "Erro ao criar usuário. Tente novamente.",
        errors: responseData.errors || { _form: [responseData.message || "Erro desconhecido retornado pela API."] },
        success: false,
      };
    }

    // Verifica se o header Authorization está presente na resposta
    const authHeader = response.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "");
      (await cookies()).set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      });
    } else {
      return {
      message: "Conta criada com sucesso! Você já pode fazer login.",
      errors: {},
      success: true,
      };
    }

  } catch (error) {
    console.error("Erro inesperado na registerAction:", error);
    return {
      message: "Algo deu errado ao tentar criar sua conta. Verifique sua conexão ou tente novamente mais tarde.",
      errors: { _form: ["Ocorreu um problema de conexão ou no servidor. Por favor, tente mais tarde."] },
      success: false,
    };
  }

  redirect("/");
}
