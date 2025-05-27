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
    if (responseData && responseData.token) {
      // Armazenar o token em um cookie HTTPOnly para segurança
      (await cookies()).set("authToken", responseData.token, { // Nome do cookie: 'authToken' (exemplo)
        httpOnly: true, // Impede acesso via JavaScript no cliente
        secure: process.env.NODE_ENV === "production", // Enviar apenas via HTTPS em produção
        path: "/", // Cookie acessível em todo o site
        sameSite: "lax", // Proteção contra CSRF
        // maxAge: 60 * 60 * 24 * 7, // Opcional: Tempo de vida do cookie (ex: 7 dias em segundos)
      });

      // 5. Redirecionar para o dashboard após o login bem-sucedido
      // O redirecionamento dentro de um try/catch em Server Actions precisa ser tratado
      // ou chamado fora se possível, mas como é o fim da action, é comum aqui.
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
  redirect("/dashboard");
}