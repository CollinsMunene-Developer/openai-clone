import * as React from 'react'

interface ResendEmailButtonProps {
  email: string | null
  onResendSuccess?: (email: string) => void
  onResendError?: () => void
  className?: string
}

export function ResendEmailButton({ 
  email,
  onResendSuccess,
  onResendError,
  className
}: ResendEmailButtonProps) {
  const [isSending, setIsSending] = React.useState(false)

  const handleClick = React.useCallback(async () => {
    if (!email || !onResendSuccess) return
    
    setIsSending(true)
    try {
      await onResendSuccess(email)
    } catch (error) {
      console.error('Error resending email:', error)
      onResendError?.()
    } finally {
      setIsSending(false)
    }
  }, [email, onResendSuccess, onResendError])

  return (
    <button
      className={`inline text-blue-500 hover:text-blue-700 ml-1 ${className || ''}`}
      disabled={isSending}
      onClick={handleClick}
    >
      {isSending ? "Sending..." : "Resend email."}
    </button>
  )
} 