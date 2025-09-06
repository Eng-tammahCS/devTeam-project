import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Store, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, isLoading, error, clearError } = useAuthStore();

  const form = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect if already logged in
  if (user && !isLoading) {
    const defaultRoute = user.roleName === 'Admin' ? '/dashboard' : '/pos';
    return <Navigate to={defaultRoute} replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      clearError();
      await login({
        username: data.username,
        password: data.password,
        rememberMe: false
      });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const fillDemoCredentials = (role: 'admin' | 'pos') => {
    if (role === 'admin') {
      form.setValue('username', 'admin');
      form.setValue('password', 'password123');
    } else {
      form.setValue('username', 'pos');
      form.setValue('password', 'password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow animate-pulse-glow">
              <Store className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              متجر الإلكترونيات الذكي
            </h1>
            <p className="text-muted-foreground">
              نظام إدارة متقدم للمتاجر الإلكترونية
            </p>
          </div>
        </div>

                 {/* Demo Credentials */}
         <div className="bg-muted/50 rounded-lg p-4 space-y-3">
           <h3 className="text-sm font-medium text-foreground">حسابات تجريبية:</h3>
           <div className="flex gap-2">
             <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => fillDemoCredentials('admin')}
               className="flex-1 text-xs"
             >
               مدير النظام (Admin)
             </Button>
             <Button
               type="button"
               variant="outline"
               size="sm"
               onClick={() => fillDemoCredentials('pos')}
               className="flex-1 text-xs"
             >
               نقاط البيع (POS)
             </Button>
           </div>
         </div>

        {/* Login Form */}
        <Card className="border-border/50 shadow-soft animate-scale-in">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل بيانات الدخول للوصول إلى النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               {/* Error Alert */}
               {error && (
                 <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                   {error}
                 </div>
               )}

               {/* Username Field */}
               <div className="space-y-2">
                 <label className="text-sm font-medium">اسم المستخدم</label>
                 <Input
                   placeholder="أدخل اسم المستخدم"
                   {...form.register('username', { 
                     required: "اسم المستخدم مطلوب",
                     minLength: { value: 3, message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }
                   })}
                   disabled={isLoading}
                   className="text-right"
                 />
                 {form.formState.errors.username && (
                   <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
                 )}
               </div>
               
               {/* Password Field */}
               <div className="space-y-2">
                 <label className="text-sm font-medium">كلمة المرور</label>
                 <div className="relative">
                   <Input
                     type={showPassword ? "text" : "password"}
                     placeholder="أدخل كلمة المرور"
                     {...form.register('password', { 
                       required: "كلمة المرور مطلوبة",
                       minLength: { value: 6, message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }
                     })}
                     disabled={isLoading}
                     className="text-right pl-10"
                   />
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="absolute left-0 top-0 h-full w-10 hover:bg-transparent"
                     onClick={() => setShowPassword(!showPassword)}
                     disabled={isLoading}
                   >
                     {showPassword ? (
                       <EyeOff className="h-4 w-4" />
                     ) : (
                       <Eye className="h-4 w-4" />
                     )}
                   </Button>
                 </div>
                 {form.formState.errors.password && (
                   <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                 )}
               </div>

                                 <Button
                   type="submit"
                   className="w-full h-11 text-base font-medium"
                   disabled={isLoading}
                 >
                   {isLoading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       جاري تسجيل الدخول...
                     </>
                   ) : (
                     "تسجيل الدخول"
                   )}
                 </Button>
               </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 متجر الإلكترونيات الذكي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}