
import {useForm} from "react-hook-form";
import {useState} from "react";
import {redirect} from "react-router-dom";
import {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
interface ISignIn {
    username: string,
    password: string
}
const SignInForm = () => {
    const {register, getValues, handleSubmit} = useForm<ISignIn>()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const {store} = useContext(Context)
    const onSubmit = async () => {
        setIsLoading(true)
        const values = getValues()
        try {
            await store.login(values.username, values.password)
            redirect('/dashboard/team') // TODO: redirect to main page

        } catch (err) {
            // TODO: maybe improve error handling
            setServerError('Не удалось войти в аккаунт, проверьте правильность введенных вами данных')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <form className="w-[30rem] space-y-8"
              onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                    Имя пользователя
                </label>
                <input
                    className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    placeholder="username"
                    {...register("username")}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Пароль
                </label>
                <input
                    className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    type="password"
                    placeholder="Введите ваш пароль"
                    {...register("password")}
                />
            </div>
            <section className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="text-sm text-gray-500">Не зарегистрированы?<a
                        className="cursor-pointer pl-1 text-black text-primary hover:underline" href="/signup">Создайте аккаунт</a>
                    </div>
                </div>
                {isLoading ? <div className="pr-7 pl-3 px-4"><div
                        className="inline-block  h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
  <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
  >Loading...</span>
                    </div></div>:
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                    type="submit">Войти
                </button>}
            </section>
        </form>
    );
};

export default SignInForm;