import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { warningToast } from "../features/toasts/toastsSlice";
import avatarImage from '../images/avatar.jpg';
import { getUserInfo, User } from "../utils/ApiClient";

interface UserInfoProps {
    username: string
}

function UserBadge({ username } : UserInfoProps) {
    const {authenticated, userInfo: {accessToken}} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User>({username: '', attempts: []});

    useEffect(() => {
        if (authenticated) {
            setIsLoading(true);
            getUserInfo(username, accessToken)
            .then((result) => {
                setIsLoading(false);
                setUser(result.payload);
                if (!result.success) {
                    dispatch(warningToast(`Failed to get user info: ${result.message}`));
                }
            });
        }
    }, [authenticated]);

    if (isLoading) {
        // Return skeleton
        return (
            <div 
                className={`absolute -translate-x-full top-1/2 -translate-y-1/2 group-last:-translate-y-full
                            bg-gray-100 rounded-lg shadow-lg p-3
                            text-left
                            flex flex-row flex-nowrap items-center justify-between gap-3
                            min-w-max
                `}
            >
                <div className='rounded-full w-12 h-12 bg-slate-400 animate-pulse'/>
                <div className="flex-shrink-0 grid grid-cols-3 animate-pulse w-20 gap-2">
                    <div className='h-4 bg-slate-400 rounded col-span-2'></div>
                    <div className='h-4 bg-slate-400 rounded col-span-3'></div>
                </div>
            </div>
        );
    } else {
        return (
            <div 
                className={`absolute -translate-x-full top-1/2 -translate-y-1/2
                            bg-gray-100 rounded-lg shadow-lg p-3
                            text-left
                            flex flex-row flex-nowrap items-center justify-between gap-3
                            min-w-max
                `}
            >
                <img className='rounded-full w-12 h-12' src={avatarImage} alt="User's avatar"/>
                <div className="flex-shrink-0">
                    <h3 className='font-bold'>{user.username}</h3>
                    <p>Attempts: {user.attempts.length}</p>
                </div>
            </div>
        );
    }
}

export default function UserInfo({ username } : UserInfoProps) {
    const [showBadge, setShowBadge] = useState(false);

    return <div className='relative'>
        <span 
            className='font-bold text-violet-500 hover:cursor-pointer'
            onMouseOver={() => setShowBadge(true)}
            onMouseLeave={() => setShowBadge(false)}
        >
        {username}
        </span>
        {showBadge && <UserBadge username={username}/>}
    </div>
}