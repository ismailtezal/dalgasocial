import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

type ButtonProps = {
    small?: boolean,
    gray?: boolean,
    className?: string,
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export function Button({
    small = false,
    gray = false,
    className = "",
    ...props
}: ButtonProps) {
    const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold"
    const colorClasses = gray ? "bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300" : "bg-slate-800 hover:bg-blue-700 focus-visible:bg-blue-700"
    return <button className={`rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opactiy-50 text-white ${sizeClasses} ${colorClasses} ${className}`} {...props}>Dalgala</button>
}