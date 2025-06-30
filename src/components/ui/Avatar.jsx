const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  }

  const baseClasses = `rounded-full flex items-center justify-center font-bold ${sizeClasses[size]} ${className}`

  if (src) {
    return <img src={src || "/placeholder.svg"} alt={alt} className={`${baseClasses} object-cover`} />
  }

  return <div className={baseClasses}>{alt.charAt(0).toUpperCase()}</div>
}

export default Avatar
