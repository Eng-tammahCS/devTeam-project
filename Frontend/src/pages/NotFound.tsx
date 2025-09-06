import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowRight, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl">الصفحة غير موجودة</CardTitle>
            <CardDescription>
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                يمكنك العودة إلى الصفحة الرئيسية أو البحث عن ما تحتاجه
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  الصفحة الرئيسية
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  لوحة التحكم
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;