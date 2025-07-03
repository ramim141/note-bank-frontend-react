"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Key } from "lucide-react"
import passwordChangeService from "../../api/apiService/passwordChangeService"

const PasswordChange = () => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState({
    old_password: false,
    new_password: false,
    new_password2: false,
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: undefined })
    setSuccess("")
  }

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess("")
    try {
      const res = await passwordChangeService.changePassword(form)
      setSuccess(res.detail || "Password updated successfully")
      setForm({ old_password: "", new_password: "", new_password2: "" })
    } catch (err) {
      if (err && err.errors) {
        setErrors(err.errors)
      } else {
        setErrors({ general: "An error occurred. Please try again." })
      }
    } finally {
      setLoading(false)
    }
  }

  const PasswordField = ({ name, label, placeholder, icon: Icon }) => (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-4 pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type={show[name] ? "text" : "password"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="py-4 pr-12 pl-12 w-full placeholder-gray-500 text-gray-900 rounded-xl border border-gray-200 backdrop-blur-sm transition-all duration-300 focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 bg-white/50"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className="flex absolute inset-y-0 right-0 items-center pr-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
          onClick={() => toggleShow(name)}
          tabIndex={-1}
        >
          {show[name] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {errors[name] && (
        <div className="flex items-center mt-2 space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-600">{errors[name][0]}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Title Section */}
      <div className="mb-8 text-center">
        <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
      </div>

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

        <PasswordField
          name="old_password"
          label="Current Password"
          placeholder="Enter your current password"
          icon={Lock}
        />

        <PasswordField name="new_password" label="New Password" placeholder="Enter your new password" icon={Key} />

        <PasswordField
          name="new_password2"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          icon={Key}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 animate-spin border-white/30 border-t-white"></div>
              <span>Changing...</span>
            </>
          ) : (
            <>
              <Key className="w-5 h-5" />
              <span>Change Password</span>
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="/support"
              className="font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700"
            >
              Contact Support
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default PasswordChange
