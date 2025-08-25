import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { Sun, Moon } from 'lucide-react'
import { getTheme, setTheme, syncThemeWithBody } from '../theme'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Car, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import './Auth.css'

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [theme, setThemeState] = useState<'dark' | 'light'>(getTheme())

  useEffect(() => {
    const applyTheme = (themeValue: 'dark' | 'light') => {
      setThemeState(themeValue)
      setTheme(themeValue)
    }
    const current = getTheme()
    applyTheme(current)
    const handler = (e: any) => {
      applyTheme(e.detail)
    }
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    setThemeState(newTheme)
  }
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!formData.email) {
      newErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.'
    }
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    setIsLoading(true)
    try {
  const response = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      setIsLoading(false)
      if (response.ok) {
        // Save tokens to localStorage
        if (data.access) localStorage.setItem('token', data.access);
        if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
        
        const from = location.state?.from || '/';
        const previousFormData = location.state?.formData;
        const shouldAutoSubmit = location.state?.autoSubmit;
        const activeTab = location.state?.activeTab;
        
        // Navigate back to the previous page with appropriate flags
        navigate(from, {
          state: {
            formData: previousFormData,
            justSignedIn: true,
            autoSubmit: shouldAutoSubmit, // Preserve autoSubmit flag from landing page
            activeTab: activeTab // Preserve the active tab state
          }
        });
        
      } else {
        let errorMsg = data?.detail || '';
        if (!errorMsg && typeof data === 'object') {
          errorMsg = Object.entries(data)
            .map(([key, val]) => `${Array.isArray(val) ? val.join(', ') : val}`)
            .join('\n');
        }
        Swal.fire({
          icon: 'error',
          title: 'Sign in failed',
          text: errorMsg || 'Invalid credentials.',
          confirmButtonColor: '#e53e3e',
        })
        setErrors({ email: errorMsg || 'Invalid credentials.' })
      }
    } catch (error) {
      setIsLoading(false)
      Swal.fire({
        icon: 'error',
        title: 'Network error',
        text: 'Please try again.',
        confirmButtonColor: '#e53e3e',
      })
      setErrors({ email: 'Network error. Please try again.' })
    }
  }

  return (
    <div className={`auth-container ${theme}`}> 
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Car className="logo-icon" />
            <span className="logo-text">Caralytix</span>
          </Link>
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="username"
                className={errors.email ? 'input-error' : ''}
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                minLength={8}
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? <Car className="spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
