import { useMutation } from '@tanstack/react-query'
import { loginSchema, registerSchema } from './helpers'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import z from 'zod'

type LoginData = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

// Mock API functions - replace with actual API calls
const loginApi = async (data: LoginData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (data.email === user.email && data.password === user.password) {
    return { token: 'mock-token', user: { email: data.email } }
  }
  throw new Error('Invalid credentials')
}

const registerApi = async (data: RegisterData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { token: 'mock-token', user: { email: data.email } }
}

export const useAuth = () => {
  const navigate = useNavigate()

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // Store token, redirect, etc.
      localStorage.setItem('token', data.token)
      navigate({ to: '/' })
    },
    onError: (error) => {
      alert('Login failed: ' + error)
      console.error('Login failed:', error)
    },
  })

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      // Store token, redirect, etc.
      localStorage.setItem('token', data.token)
      navigate({ to: '/' })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })

  const submitLogin = (data: LoginData) => {
    loginMutation.mutate(data)
  }

  const submitRegister = (data: RegisterData) => {
    localStorage.setItem('user', JSON.stringify(data))
    registerMutation.mutate(data)
  }

  return {
    loginForm,
    registerForm,
    submitLogin,
    submitRegister,
    loginMutation,
    registerMutation,
  }
}
