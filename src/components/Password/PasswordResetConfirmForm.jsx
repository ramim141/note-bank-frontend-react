import { useState } from "react"
import { CheckCircle, AlertCircle, Shield } from "lucide-react"
import passwordResetService from "../../api/apiService/passwordResetService"

const PasswordResetConfirmForm = ({ uidb64, token }) => {
  const [newPassword1, setNewPassword1] = useState("")
  const [newPassword2, setNewPassword2] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")
    try {
      const res = await passwordResetService.confirmReset(
        uidb64,
        token,
        newPassword1,
        newPassword2
      )
      setSuccess(res.detail || "Your password has been reset successfully.")
      setNewPassword1("")
      setNewPassword2("")
    } catch (err) {
      if (err && (err.new_password1 || err.new_password2)) {
        setErrors({
          new_password1: err.new_password1 ? err.new_password1[0] : undefined,
          new_password2: err.new_password2 ? err.new_password2[0] : undefined,
        })
      } else if (err && err.detail) {
        setErrors({ general: err.detail })
      } else {
        setErrors({ general: "An error occurred. Please try again." })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 rounded-2xl border shadow-xl backdrop-blur-sm transition-all duration-300 bg-white/80 border-white/20 hover:shadow-2xl"
    >
      {/* Success Message */}
      {success && (
        <div className="flex items-start p-4 mb-6 space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 transition-all duration-300">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="flex items-start p-4 mb-6 space-x-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 transition-all duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800">{errors.general}</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block mb-3 text-sm font-semibold text-gray-700">New Password</label>
        <div className="relative">
          <input
            type="password"
            name="new_password1"
            value={newPassword1}
            onChange={e => setNewPassword1(e.target.value)}
            className="py-4 pr-4 pl-4 w-full placeholder-gray-500 text-gray-900 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 bg-white/50"
            placeholder="Enter new password"
            required
          />
        </div>
        {errors.new_password1 && (
          <div className="flex items-center mt-2 space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{errors.new_password1}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-3 text-sm font-semibold text-gray-700">Confirm New Password</label>
        <div className="relative">
          <input
            type="password"
            name="new_password2"
            value={newPassword2}
            onChange={e => setNewPassword2(e.target.value)}
            className="py-4 pr-4 pl-4 w-full placeholder-gray-500 text-gray-900 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 bg-white/50"
            placeholder="Confirm new password"
            required
          />
        </div>
        {errors.new_password2 && (
          <div className="flex items-center mt-2 space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">{errors.new_password2}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 animate-spin border-white/30 border-t-white"></div>
            <span>Resetting...</span>
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            <span>Set New Password</span>
          </>
        )}
      </button>
    </form>
  )
}

export default PasswordResetConfirmForm 