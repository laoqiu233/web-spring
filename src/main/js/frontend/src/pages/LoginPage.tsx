import TextInput from "../components/TextInput";
import gif from '../images/zxc-cat.gif';

export default function LoginPage() {
    return (
        <div className='bg-gray-200 p-3 rounded-md w-full shadow-xl mx-10 md:max-w-xl md:flex md:justify-between md:gap-4'>
            <section className="px-5 md:w-1/2">
                <h1 className='text-3xl font-extrabold mt-2 mb-5'>Login</h1>
                <form action="">
                    <div>
                        <TextInput id="username" name="username" placeholder='Username'/>
                    </div>
                    <div>
                        <TextInput type="password" id="password" name="password" placeholder='Password'/>
                    </div>
                    <button className='transition w-full bg-violet-500 text-white rounded-xl px-3 py-2 mb-3 hover:bg-violet-600' type="submit">Login</button>
                </form>
                <a href="/register" className='text-xs text-gray-500 text-center block hover:text-violet-500'>Or register a new account</a>
            </section>
            <section className='h-0 md:h-auto invisible md:visible bg-gray-500 w-1/2 rounded-md overflow-hidden'>
                <img src={gif} alt="A funny cat dancing"/>
            </section>
        </div>
    )
}