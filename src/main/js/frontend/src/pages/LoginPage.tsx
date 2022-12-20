import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/Button";
import TextInput from "../components/TextInput";
import { validateUsernamePassword } from "../features/auth/authSlice";
import image from '../images/zxc-cat.gif';
import { ReactComponent as Loader } from '../images/loader.svg'
import PasswordInput from "../components/PasswordInput";

export default function LoginPage() {
    const authenticated = useAppSelector(state => state.auth.authenticated);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [warningText, setWarningText] = useState('');

    useEffect(() => {
        if (authenticated) navigate('/home');
    }, []);

    function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setWarningText('');
        setLoading(true);

        dispatch(validateUsernamePassword(username, password))
            .then((res) => {
                setLoading(false);
                if (res.success) {
                    navigate('/home');
                } else {
                    console.log(res);
                    setWarningText(res.message || 'Something went wrong, try again later.');
                }
            });
    }

    const disableButton = loading || username.trim().length === 0 || password.trim().length === 0

    return (
        <div className='bg-gray-200 p-3 rounded-md w-full shadow-xl mx-10 md:max-w-xl md:flex md:justify-between md:gap-4'>
            <section className="px-5 md:w-1/2">
                <h1 className='text-3xl font-extrabold mt-2 mb-5'>Login</h1>
                <form onSubmit={onSubmit}>
                    <TextInput id="username" name="username" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
                    <PasswordInput id="password" name="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <p className="text-red-500 text-xs mb-5">{warningText}</p>
                    <Button disabled={disableButton}>{loading ? <Loader className="m-auto max-h-[1em]"/> : 'Login'}</Button>
                </form>
                <Link to="/register" className='text-xs text-gray-500 text-center block hover:text-violet-500'>Or register a new account</Link>
            </section>
            <section className='h-0 md:h-full invisible md:visible bg-gray-500 w-1/2 rounded-md overflow-hidden'>
                <img src={image} alt="A funny cat dancing"/>
            </section>
        </div>
    )
}