import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Button } from "../components/Button";
import TextInput from "../components/TextInput";
import { registerAndAuthenticateUser } from "../features/auth/authSlice";
import image from '../images/insanity.jpg';
import loaderAnimation from '../images/loader.svg';

function validateCredentials(credentialName: string, credentialValue: string) {
    if (credentialValue.match(/^[a-zA-Z0-9_]{3,10}$/)) {
        return undefined;
    }

    return `${credentialName} should only consist of 3 to 10 english letters, numbers or underscores.`;
}

export default function RegisterPage() {
    const authenticated = useAppSelector(state => state.auth.authenticated);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [loading, setLoading]   = useState(false);
    const [warningText, setWarningText] = useState('');

    if (authenticated) navigate('/home');

    function onSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setWarningText('');
        setLoading(true);

        dispatch(registerAndAuthenticateUser(username, password))
            .then((res) => {
                setLoading(false);
                if (res.success) {
                    navigate('/home');
                } else {
                    setWarningText(res.message || 'Something went wrong, try again later.');
                }
            });
    }

    const usernameWarning = validateCredentials('Username', username);
    const passwordWarning = validateCredentials('Password', password);
    const passwordRepeatWarning = (password === passwordRepeat ? undefined : 'You entered a different password.');
    const disableButton = loading || usernameWarning !== undefined || passwordWarning !== undefined || passwordRepeatWarning !== undefined;

    return (
        <div className='bg-gray-200 p-3 rounded-md w-full shadow-xl mx-10 md:max-w-xl md:flex md:justify-between md:gap-4'>
            <section className="px-5 md:w-1/2">
                <h1 className='text-3xl font-extrabold mt-2 mb-5'>Register</h1>
                <form onSubmit={onSubmit}>
                    <TextInput 
                        id="username"
                        name="username"
                        placeholder='Username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        warningText={usernameWarning}
                    />
                    <TextInput
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        warningText={passwordWarning}
                    />
                    <TextInput
                        type="password"
                        id="password-repeat"
                        name="password-repeat"
                        placeholder='Repeat your password'
                        value={passwordRepeat}
                        onChange={e => setPasswordRepeat(e.target.value)}
                        warningText={passwordRepeatWarning}
                    />
                    <p className="text-red-500 text-xs mb-5">{warningText}</p>
                    <Button disabled={disableButton}>{loading ? <img src={loaderAnimation} alt='Loading' className="m-auto max-h-[1em]"/> : 'Register'}</Button>
                </form>
                <Link to="/login" className='text-xs text-gray-500 text-center block hover:text-violet-500'>Or login with an existing account</Link>
            </section>
            <section className='h-0 md:h-auto invisible md:visible bg-gray-500 w-1/2 rounded-md overflow-hidden'>
                <img src={image} alt="A funny cat" className="block object-fill"/>
            </section>
        </div>
    )
}