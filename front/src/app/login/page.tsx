import {AuthWrapper} from "@/components/auth/auth-wrapper";
import {LoginForm} from "@/components/auth/login-form";


const LoginPage = () => {
    return (
        <AuthWrapper>
            <LoginForm/>
        </AuthWrapper>
    );
};

export default LoginPage;