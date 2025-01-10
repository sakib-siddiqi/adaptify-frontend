import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import supabase from "../../../config/supabase";
import { Link, useNavigate } from "react-router";

interface InputSchema {
    email: string;
    password: string;
}
const SignUpPage = () => {
    const FORM = useForm<InputSchema>();
    const navigate = useNavigate();
    const mutateSignIn = useMutation({
        mutationKey: ['sing-up'],
        mutationFn: async (data: InputSchema) => {
            const { data: result, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password
            });
            if (error) throw error?.message;
            navigate(!result?.user?.user_metadata?.email_verified?'/auth/email-verification':'/', { replace: true })
            return result;
        }
    })

    const onSubmit: SubmitHandler<InputSchema> = (data) => {
        mutateSignIn.mutate(data, {})
    }
    return (
        <main className="bg-indigo-200 flex items-center min-h-dvh py-10">
            <form onSubmit={FORM.handleSubmit(onSubmit)} className="w-full max-w-xs mx-auto bg-white px-3 py-5 rounded shadow-lg">
                <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                <div className="mb-3">
                    <label htmlFor="email" className="text-gray-800 text-sm font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="example@mail.com"
                        className="input"
                        {...FORM.register("email",
                            {
                                required: {
                                    message: 'Enter a email.',
                                    value: true
                                },
                                pattern: {
                                    message: 'Enter a valid email.',
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g
                                }
                            }
                        )}
                    />
                    {FORM.formState.errors.email?.message && <p className="mt-1 form-message">{FORM.formState.errors.email?.message}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="text-gray-800 text-sm font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="******"
                        className="input"
                        {...FORM.register("password",
                            {
                                required: {
                                    message: 'Enter your password.',
                                    value: true
                                },
                                minLength: {
                                    message: 'Minimum length of password should be 6',
                                    value: 6
                                },
                                // pattern:  /^(?=.*[A-Z])(?=.*\d).{6,}$/g
                            }
                        )}
                    />
                    {FORM.formState.errors.password?.message && <p className="mt-1 form-message">{FORM.formState.errors.password?.message}</p>}
                </div>
                {mutateSignIn.isError && <p className="mb-2 form-message">{JSON.stringify(mutateSignIn?.error)}</p>}
                <button type="submit" disabled={mutateSignIn.isLoading} className="btn w-full">
                    {mutateSignIn.isLoading ? 'Loading...' : 'SUBMIT'}
                </button>
                <Link to="/auth/sign-in" className="text-blue-700 underline underline-offset-2 text-sm font-medium mt-2 block">
                    Have an account?
                </Link>
            </form>
        </main>
    )
};

export default SignUpPage;
