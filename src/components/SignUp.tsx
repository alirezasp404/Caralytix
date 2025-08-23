import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Sun, Moon } from 'lucide-react'
import { getTheme, setTheme, syncThemeWithBody } from '../theme'
import { Link } from 'react-router-dom'
import { Car, Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import './Auth.css'

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreedToTerms?: string;
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreedToTerms?: string;
    } = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required.'
    if (!formData.lastName) newErrors.lastName = 'Last name is required.'
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }
    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms.'
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
      const response = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        }),
      })
      const data = await response.json()
      setIsLoading(false)
      console.log(response)
      if (response.ok) {
        // Store tokens if present in registration response
        if (data.access) localStorage.setItem('token', data.access);
        if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
        
        // Auto sign in
        try {
          const loginResponse = await fetch(`${import.meta.env.VITE_API_HOST || ''}/user/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });
          
          const loginData = await loginResponse.json();
          
          if (loginResponse.ok) {
            if (loginData.access) localStorage.setItem('token', loginData.access);
            if (loginData.refresh) localStorage.setItem('refreshToken', loginData.refresh);
            const from = location.state?.from || '/';
            // Navigate back to the previous page or home with the form data and justSignedIn flag
            navigate(from, {
              replace: true,
              state: {
                formData: location.state?.formData,
                justSignedIn: true
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Auto sign in failed',
              text: loginData.detail || JSON.stringify(loginData) || 'Please sign in manually.',
              confirmButtonColor: '#e53e3e',
            });
            navigate('/signin', { replace: true });
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Network error',
            text: 'Please sign in manually.',
            confirmButtonColor: '#e53e3e',
          });
          navigate('/signin', { replace: true });
        }
      } else {
        // Show backend errors from registration
        let errorMsg = data?.detail || '';
        if (!errorMsg && typeof data === 'object') {
          errorMsg = Object.entries(data)
            .map(([key, val]) => `${Array.isArray(val) ? val.join(', ') : val}`)
            .join('\n');
        }
        Swal.fire({
          icon: 'error',
          title: 'Sign up failed',
          text: errorMsg || 'An error occurred. Please try again.',
          confirmButtonColor: '#e53e3e',
        });
        setErrors({ email: errorMsg || 'Registration failed.' })
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
          <h1>Create Account</h1>
          <p>Join thousands of car dealers using Caralytix</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className={errors.firstName ? 'input-error' : ''}
                />
              </div>
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className={errors.lastName ? 'input-error' : ''}
                />
              </div>
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>

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
                placeholder="Create a password"
                required
                minLength={8}
                autoComplete="new-password"
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
            <div className="password-requirements">
              <small>Password must be at least 8 characters long</small>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <div className="checkbox-wrapper">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <span className="checkmark"></span>
              <div className="terms-text">
                I agree to the
                <Link to="/terms">Terms of Service</Link>
                and
                <Link to="/privacy">Privacy Policy</Link>
              </div>
            </div>
            {errors.agreedToTerms && <div className="error-message">{errors.agreedToTerms}</div>}
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
