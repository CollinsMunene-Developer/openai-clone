/**
 * AuthAlerts: The Alert Message Orchestrator
 * ----------------------------------------
 * Think of this as the alert decision maker that:
 * 
 * - Manages Alert Creation:
 *   • Interprets auth events (errors, messages)
 *   • Creates appropriate alert types
 *   • Handles verification states
 * 
 * - Handles Email Verification:
 *   • Manages resend verification flow
 *   • Tracks verification states
 *   • Shows verification dialogs
 * 
 * - Maintains Alert History:
 *   • Prevents duplicate alerts
 *   • Tracks previous states
 *   • Updates only on changes
 */

import * as React from "react"
import { useAlerts } from "../../context/GlobalAlertManager"
import { AuthAlertsProps } from "../../types/ui"
import { createAuthAlert, AUTH_ALERTS } from '../../lib/auth/alerts/auth-alerts'

import { type AuthFormState } from "../../types/auth"
import { ResendVerificationEmailAlertDialog } from "./resend-verification-email-alert-dialog"
import { resendVerification } from "../../actions/auth-service"

export function AuthAlerts({
  error,                      // Current error state
  message,                    // Success/info message
  verificationState,          // Email verification status
  showVerificationAlert,      // Control verification alert visibility
  email,                    // User's email for verification
  socialAuthState           // Add this new prop
}: AuthAlertsProps) {
  // Access global alert management
  const { addAlert } = useAlerts()
  
  // Track previous states to prevent duplicate alerts
  const prevError = React.useRef(error)
  const prevMessage = React.useRef(message)
  
  // Manage verification dialog state
  const [showResendDialog, setShowResendDialog] = React.useState(false)
  const [resendError, setResendError] = React.useState<string | null>(null)
  const [resendEmail, setResendEmail] = React.useState<string | null>(null)

  // Handle successful verification email resend
  const handleResendSuccess = React.useCallback(async (email: string) => {
    try {
      const formData = new FormData()
      formData.append('email', email)
      
      const result = await resendVerification({} as AuthFormState, formData)
      if (result.success) {
        setResendEmail(email)
        setResendError(null)
      } else {
        setResendError(result.errors?.general || 'Failed to resend verification email')
      }
      setShowResendDialog(true)
    } catch (error: unknown) {
      console.error('Error resending verification email:', error)
      setResendError('Failed to resend verification email')
      setShowResendDialog(true)
    }
  }, [])

  // Handle failed verification email resend
  const handleResendError = React.useCallback(() => {
    setResendError('Failed to resend verification email')
    setShowResendDialog(true)
  }, [])
  
  // Monitor and handle error state changes
  React.useEffect(() => {
    if (error && error !== prevError.current) {
      // Handle various error scenarios with appropriate alerts
      if (error === 'email_not_confirmed') {
        addAlert(createAuthAlert('LOGIN', 'VERIFICATION_REQUIRED', {
          resendVerificationEmail: email ? {
            enabled: true,
            email,
            onResendSuccess: handleResendSuccess,
            onResendError: handleResendError
          } : undefined
        }))
      } else if (error === AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS.message) {
        addAlert(createAuthAlert('SIGNUP', 'ACCOUNT_EXISTS'))
      } else if (error === AUTH_ALERTS.SIGNUP.ACCOUNT_EXISTS_UNVERIFIED.message) {
        addAlert(createAuthAlert('SIGNUP', 'ACCOUNT_EXISTS_UNVERIFIED', {
          resendVerificationEmail: email ? {
            enabled: true,
            email,
            onResendSuccess: handleResendSuccess,
            onResendError: handleResendError
          } : undefined
        }))
      } else if (error === 'verification_expired') {
        addAlert(createAuthAlert('VERIFICATION', 'EXPIRED', {
          resendVerificationEmail: email ? {
            enabled: true,
            email,
            onResendSuccess: handleResendSuccess,
            onResendError: handleResendError
          } : undefined
        }))
      } else if (!error.includes('verify')) {
        addAlert(createAuthAlert('LOGIN', 'ERROR', {
          message: error
        }))
      }
    }
    prevError.current = error
  }, [error, addAlert, email, handleResendSuccess, handleResendError, verificationState])

  // Monitor and handle message state changes
  React.useEffect(() => {
    if (message && message !== prevMessage.current) {      
      // Handle various success/info scenarios with appropriate alerts
      if (message === 'verification_success') {
        addAlert(createAuthAlert('VERIFICATION', 'SUCCESS'))
      } else if (message === 'already_verified') {
        addAlert(createAuthAlert('VERIFICATION', 'ALREADY_VERIFIED'))
      } else if (message === 'verified_different_browser') {
        addAlert(createAuthAlert('VERIFICATION', 'VERIFIED_DIFFERENT_BROWSER'))
      } else if (message === AUTH_ALERTS.SIGNUP.SUCCESS.message) {
        addAlert(createAuthAlert('SIGNUP', 'SUCCESS', {
          resendVerificationEmail: email ? {
            enabled: true,
            email,
            onResendSuccess: handleResendSuccess,
            onResendError: handleResendError
          } : undefined
        }))
      } else {
        addAlert(createAuthAlert('LOGIN', 'SUCCESS', { message }))
      }
    }
    prevMessage.current = message
  }, [message, addAlert, email, handleResendSuccess, handleResendError])

  // Monitor verification state for expired links
  React.useEffect(() => {
    if (showVerificationAlert && verificationState.expired) {
      addAlert(createAuthAlert('VERIFICATION', 'EXPIRED'))
    }
  }, [showVerificationAlert, verificationState.expired, addAlert])

  // Monitor social auth state
  React.useEffect(() => {
    if (socialAuthState?.redirecting && socialAuthState.provider) {
      const redirectAlerts = {
        microsoft: 'REDIRECT_MICROSOFT',
        google: 'REDIRECT_GOOGLE',
        github: 'REDIRECT_GITHUB'
      } as const;

      const alertType = redirectAlerts[socialAuthState.provider]
      if (alertType) {
        addAlert(createAuthAlert('LOGIN', alertType))
      }
    }
  }, [socialAuthState, addAlert])

  return (
    <>
      <ResendVerificationEmailAlertDialog
        open={showResendDialog}
        onOpenChange={setShowResendDialog}
        email={resendEmail}
        error={resendError}
      />
    </>
  )
} 