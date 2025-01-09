import * as React from "react"

import { AlertTriangle, MailCheck } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface ResendVerificationEmailAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string | null
  error?: string | null
}

export function ResendVerificationEmailAlertDialog({
  open,
  onOpenChange,
  email,
  error
}: ResendVerificationEmailAlertDialogProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  // Determine if we're in an error state
  const isError = error || !email

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {isError ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <MailCheck className="h-5 w-5 text-green-600" />
            )}
            <AlertDialogTitle>
              {isError ? "Failed to Send Email" : "Email Sent"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {error
              ? "We couldn't resend the verification email. Please try again later."
              : email 
                ? `We've sent you another verification email to ${email}. Please check your inbox.`
                : "We couldn't process your request. Please try again."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            handleClose()
          }}>
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 