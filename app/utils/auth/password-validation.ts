export function isValidPassword (password: string): boolean {
    return(
        password.length >= 12 &&
        password.length <= 123 &&
        /[a-z]/.test(password) &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[!@#$%^&*]/.test(password)
    )
}