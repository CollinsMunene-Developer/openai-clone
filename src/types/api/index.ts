// API-related types including form states and actions
export interface BaseFormState {
  errors?: {
    [key: string]: string | undefined
  }
  success?: boolean
  loading?: boolean
  message?: string
}

export interface SocialAuthResponse {
  provider: 'google' | 'github' | 'microsoft'
  success: boolean
  error?: string
  redirectUrl?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  redirectUrl?: string
  verificationRequired?: boolean
  user?: {
    id: string | number
    email: string
  }
}

export type FormAction<T extends BaseFormState = BaseFormState> = 
  (formData: FormData) => Promise<T>

export interface AuthFormData {
  signupEmail: string
  signupPassword: string
  signupName: string
  loginEmail: string
  loginPassword: string
  [key: string]: string
} 