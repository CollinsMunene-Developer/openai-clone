import * as React from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff, CheckCircle } from "lucide-react"

import { PasswordRequirements, validatePassword } from "./password-requirements-alert"
import { cn } from "../../utils/styles/styleUtils"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showRequirements?: boolean
  persistRequirements?: boolean
  showSuccessMessage?: boolean
}

export function PasswordInput({ 
  className, 
  showRequirements = false,
  persistRequirements = false,
  showSuccessMessage = true,
  value = "",
  id,
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [hasInteracted, setHasInteracted] = React.useState(false)

  const isPasswordValid = value ? validatePassword(value.toString()) : false
  const shouldShowRequirements = showRequirements && 
    (persistRequirements ? value.toString().length > 0 :
     (hasInteracted && value.toString().length > 0)) &&
    !isPasswordValid

  return (
    <div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          value={value}
          id={id}
          onFocus={() => setHasInteracted(true)}
          onChange={(e) => {
            setHasInteracted(true)
            props.onChange?.(e)
          }}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      {shouldShowRequirements ? (
        <PasswordRequirements password={value.toString()} />
      ) : (
        showSuccessMessage && value && isPasswordValid && (
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Password meets requirements</span>
          </div>
        )
      )}
    </div>
  )
} 