import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck, User, Wrench, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

type LoginState = {
  email?: string;
  password?: string;
  availableRoles?: Array<'customer' | 'worker'>;
  message?: string;
};

const getDashboardByRole = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'worker':
      return '/dashboard';
    case 'customer':
    default:
      return '/dashboard';
  }
};

const LoginRoleChoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const state = (location.state || {}) as LoginState;

  const [isLoading, setIsLoading] = useState<'customer' | 'worker' | null>(null);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardByRole(user.role)} replace />;
  }

  if (!state.email || !state.password || !state.availableRoles?.length) {
    return <Navigate to="/login" replace />;
  }

  const handleSelect = async (role: 'customer' | 'worker') => {
    setIsLoading(role);
    setError('');

    try {
      const result = await login(state.email!, state.password!, role);
      if ('requiresRoleSelection' in result && result.requiresRoleSelection) {
        setError(result.message || 'Please choose an account type.');
        return;
      }

      navigate(getDashboardByRole(result.role), { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(135deg,_#f8fffb_0%,_#f8fafc_52%,_#eefbf5_100%)] py-10 px-4">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-emerald-100/40 to-transparent blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <Card className="w-full overflow-hidden border-emerald-100/80 bg-white/90 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative hidden min-h-[28rem] flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white lg:flex">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-white blur-2xl" />
                <div className="absolute right-10 top-24 h-32 w-32 rounded-full bg-cyan-300 blur-3xl" />
                <div className="absolute bottom-10 left-12 h-40 w-40 rounded-full bg-lime-200 blur-3xl" />
              </div>

              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">
                  <Sparkles className="h-4 w-4" />
                  Multiple accounts detected
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl font-extrabold tracking-tight">
                    Pick the profile you want to enter.
                  </h1>
                  <p className="max-w-md text-base leading-7 text-emerald-50">
                    Your email and password are valid for more than one account. Choose the profile that matches what you want to do right now.
                  </p>
                </div>
              </div>

              <div className="relative space-y-3 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg backdrop-blur-sm">
                <p className="text-sm font-medium text-emerald-50">
                  {state.message || 'The same login credentials are available in more than one account.'}
                </p>
                <p className="text-xs text-emerald-100/90">
                  You can always switch later from your account menu.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <CardHeader className="px-0 pt-0 text-left">
                <div className="mb-4 flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Choose account type</CardTitle>
                    <CardDescription className="mt-1">
                      Select the profile you want to open.
                    </CardDescription>
                  </div>
                </div>

                <div className="hidden lg:block">
                  <CardTitle className="text-3xl font-bold">Choose account type</CardTitle>
                  <CardDescription className="mt-2 max-w-md text-base">
                    Select the profile you want to open.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 px-0 pb-0">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4">
                  {state.availableRoles.includes('customer') && (
                    <button
                      type="button"
                      onClick={() => handleSelect('customer')}
                      disabled={!!isLoading}
                      className="group w-full rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                          {isLoading === 'customer' ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">Continue as Customer</h3>
                              <p className="mt-1 text-sm text-slate-600">
                                Browse services, book workers, and manage your orders.
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-sky-500 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </button>
                  )}

                  {state.availableRoles.includes('worker') && (
                    <button
                      type="button"
                      onClick={() => handleSelect('worker')}
                      disabled={!!isLoading}
                      className="group w-full rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                          {isLoading === 'worker' ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Wrench className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">Continue as Labour</h3>
                              <p className="mt-1 text-sm text-slate-600">
                                Open your worker profile, jobs, earnings, and availability.
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-emerald-500 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    to="/login"
                    replace
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Use different credentials
                  </Link>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginRoleChoice;
