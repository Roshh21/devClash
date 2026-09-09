import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  MessageCircle,
  Terminal,
  User,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Tabs from '../components/ui/Tabs';
import Checkbox from '../components/ui/Checkbox';
import ThemeToggle from '../components/ui/ThemeToggle';
import InlineNotice from '../components/ui/InlineNotice';
import { useAuthStore } from '../store/authStore';
import { slideUp, tabContentTransition } from '../lib/motion';

const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Google', icon: Globe },
  { id: 'github', label: 'GitHub', icon: Terminal },
  { id: 'discord', label: 'Discord', icon: MessageCircle },
];

const EMPTY_VALUES = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: false,
  terms: false,
};

function validate(mode, values) {
  const errors = {};

  if (mode === 'signup' && !values.username.trim()) {
    errors.username = 'Username is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (mode === 'signup') {
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords don't match";
    }
    if (!values.terms) {
      errors.terms = 'You must agree to the terms to continue';
    }
  }

  return errors;
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const authStatus = useAuthStore((s) => s.status);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const [mode, setMode] = useState(() => (location.pathname === '/signup' ? 'signup' : 'login'));
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function switchMode(next) {
    setMode(next);
    setErrors({});
    setNotice(null);
    navigate(next === 'signup' ? '/signup' : '/login', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(mode, values);
    setErrors(nextErrors);
    setNotice(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result =
      mode === 'login'
        ? await login({ email: values.email, password: values.password })
        : await signup({
            username: values.username,
            email: values.email,
            password: values.password,
          });
    setSubmitting(false);

    if (result.ok) {
      // Bounced here by RequireAuth? Send them back where they were
      // headed instead of always landing on the dashboard.
      const redirectTo = location.state?.from?.pathname || '/app/dashboard';
      navigate(redirectTo, { replace: true });
      return;
    }

    if (result.fieldErrors) {
      setErrors((prev) => ({ ...prev, ...result.fieldErrors }));
    }
    setNotice(result.message);
  }

  // A still-valid stored session means there's nothing for this form
  // to do — send them straight into the app instead of asking them
  // to log in again.
  if (authStatus === 'authenticated') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg text-primary">
      <header className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Code2 size={18} />
          </span>
          DevClash
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <motion.div initial="hidden" animate="visible" variants={slideUp} className="w-full max-w-md">
          <Card className="p-8 sm:p-10">
            <Tabs
              tabs={[
                { id: 'login', label: 'Log In' },
                { id: 'signup', label: 'Sign Up' },
              ]}
              active={mode}
              onChange={switchMode}
              className="mb-8"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={tabContentTransition.initial}
                animate={tabContentTransition.animate}
                exit={tabContentTransition.exit}
                transition={tabContentTransition.transition}
              >
                <h1 className="text-2xl font-bold text-primary">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h1>
                <p className="mt-1 text-sm text-secondary">
                  {mode === 'login' ? 'Continue your journey.' : 'Start your journey.'}
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
                  {mode === 'signup' && (
                    <Input
                      label="Username"
                      placeholder="yourname"
                      icon={<User size={16} />}
                      value={values.username}
                      onChange={(e) => update('username', e.target.value)}
                      error={errors.username}
                    />
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail size={16} />}
                    value={values.email}
                    onChange={(e) => update('email', e.target.value)}
                    error={errors.email}
                  />

                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    value={values.password}
                    onChange={(e) => update('password', e.target.value)}
                    error={errors.password}
                    rightElement={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-tertiary transition-colors hover:text-primary"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />

                  {mode === 'signup' && (
                    <Input
                      label="Confirm password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      icon={<Lock size={16} />}
                      value={values.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      rightElement={
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirm((v) => !v)}
                          className="text-tertiary transition-colors hover:text-primary"
                          aria-label={showConfirm ? 'Hide password' : 'Show password'}
                        >
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                  )}

                  {mode === 'login' ? (
                    <div className="flex items-center justify-between">
                      <Checkbox
                        label="Remember me"
                        checked={values.remember}
                        onChange={(e) => update('remember', e.target.checked)}
                      />
                      <button
                        type="button"
                        onClick={() => setNotice('Password reset is coming soon.')}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Checkbox
                        label="I agree to the Terms of Service and Privacy Policy"
                        checked={values.terms}
                        onChange={(e) => update('terms', e.target.checked)}
                      />
                      {errors.terms && <p className="mt-1.5 text-xs text-danger">{errors.terms}</p>}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    rightIcon={!submitting && <ArrowRight size={18} />}
                    className="mt-2 w-full"
                  >
                    {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
                  </Button>
                </form>

                <InlineNotice message={notice} />

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[var(--color-border)]" />
                  <span className="text-xs text-tertiary">or continue with</span>
                  <div className="h-px flex-1 bg-[var(--color-border)]" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {SOCIAL_PROVIDERS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setNotice(`${label} sign-in is coming soon.`)}
                      className="flex flex-col items-center gap-1.5 rounded-xl border border-glass bg-surface py-3 text-xs font-medium text-secondary transition-colors hover:bg-surface-strong hover:text-primary"
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>

                <p className="mt-8 text-center text-sm text-secondary">
                  {mode === 'login' ? (
                    <>
                      New here?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('signup')}
                        className="font-semibold text-accent hover:underline"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="font-semibold text-accent hover:underline"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </Card>

          <p className="mt-8 text-center font-mono text-xs italic text-tertiary">
            {mode === 'login' ? '"Same problems. Higher stakes."' : '"Every expert was once a beginner."'}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
