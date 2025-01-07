// UI-related types including components and alerts
import { AuthFormData } from "../api"
import { AuthFormState } from "../auth"
export enum AlertVariant {
  WARNING = 'warning',
  CRITICAL = 'destructive',
  SUCCESS = 'success',
  INFORMATION = 'info'
}

export enum AlertType {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  VERIFICATION = 'VERIFICATION',
  PASSWORD = 'PASSWORD',
  FORM = 'FORM'
}

export enum AlertStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO'
}

export interface AlertAction {
  label: string
  handler: () => void
}

export interface AuthAlert {
  type: AlertType
  status: AlertStatus
  title: string
  message: string
  variant: AlertVariant
  action?: AlertAction
  duration?: number
  onClose?: () => void
  persistent?: boolean
  resendVerificationEmail?: {
    enabled: boolean
    email: string | null
    onResendSuccess?: (email: string) => void
    onResendError?: () => void
  }
}

// Component Props Types
export interface AuthContentProps {
  variant?: "default" | "forgot-password" | "reset-password"
}

export interface LoginFormProps {
  loginState: AuthFormState
  loginAction: (formData: FormData) => Promise<void>
  formRef: React.RefObject<HTMLFormElement>
  formData: AuthFormData
  setFormData: (value: React.SetStateAction<AuthFormData>) => void
  loginErrors?: AuthFormState['errors']
}

export interface SignupFormProps {
  signupState: AuthFormState
  signupAction: (formData: FormData) => Promise<void>
  formRef: React.RefObject<HTMLFormElement>
  formData: AuthFormData
  setFormData: (value: React.SetStateAction<AuthFormData>) => void
  passwordError?: string
  setPasswordError: (error: string | undefined) => void
}

// Table Types
export interface DataTableRow {
  microservice: string
  project: string
  status: string
  lastUpdated: string
}

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  qty: number
}

// Add AlertState type
export interface AlertState {
  error: string | null
  message: string | null
  signupState: Partial<AuthFormState>
  loginState: Partial<AuthFormState>
  verificationState: {
    expired: boolean
  }
  isPostSignup: boolean
  showVerificationAlert: boolean
  email?: string | null
}

export interface EnhancedAlertProps {
  title?: string
  message: string
  variant: AlertVariant
  action?: {
    label: string
    handler: () => void
  }
  onClose?: () => void
  className?: string
  showTitle?: boolean
  /** @default true */
  showCloseButton?: boolean
  resendVerificationEmail?: {
    enabled: boolean
    email: string | null
    onResendSuccess?: (email: string) => void
    onResendError?: () => void
  }
}

// Add missing auth mode type
export type AuthMode = 'signin' | 'signup' | 'reset' | 'verify'

// Add missing social auth button props
export interface SocialAuthButtonProps {
  provider: 'google' | 'github' | 'microsoft'
  loading?: boolean
  onClick?: () => void
}

export interface AuthAlertsProps {
  error?: string | null
  message?: string | null
  verificationState: {
    expired: boolean
  }
  showVerificationAlert: boolean
  email?: string | null
  socialAuthState?: SocialAuthState
}

// Add SocialAuthState type here since it's used by a UI prop interface
export interface SocialAuthState {
  redirecting: boolean
  provider?: 'google' | 'github' | 'microsoft'
} 