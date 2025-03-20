import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Redirect if already logged in
    useEffect(() => {
      if (authService.isAuthenticated()) {
        navigate("/dashboard");
      }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });

            // Store token and user info
            localStorage.setItem("token", response.token);
            localStorage.setItem("user", JSON.stringify(response.user));
            
            // Update app-level state
            setIsAuthenticated(true);
            setUser(response.user);

            // Get the redirect path from location state or default to dashboard
            const from = location.state?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white dark:bg-gray-800 shadow-xl border-none overflow-hidden">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            <motion.div
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                            >
                                <label className="block text-sm font-medium mb-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium" htmlFor="password">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                        Forgot Password?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="flex items-center"
                            >
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </label>
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="pt-2"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-3 rounded-lg shadow-lg transition-colors ${isLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                        } text-white`}
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                </motion.button>
                            </motion.div>

                            <motion.div
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="text-center text-sm"
                            >
                                Don't have an account?{" "}
                                <a href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                    Sign up
                                </a>
                            </motion.div>
                        </motion.form>
                    </CardContent>
                </Card>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm"
                >
                    &copy; {new Date().getFullYear()} PhotoVault. All rights reserved.
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
