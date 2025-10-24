const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
