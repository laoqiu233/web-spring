import { useEffect } from "react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { setTokenSourceMapRange } from "typescript"
import { useAppDispatch } from "../app/hooks"
import { Toast, toastRemoved } from "../features/toasts/toastsSlice"

interface ToastsListProps {
    toasts: Toast[],
    onToastClose(toastId: number): void
};

interface ToastWidgetProps {
    toast: Toast,
    onToastClose(toastId: number): void
};

const titleForToastType = {
    'info': 'Information',
    'warning': 'Warning',
    'success': 'Success'
}

const backgroundColorForToastType = {
    'info': 'bg-blue-500',
    'warning': 'bg-red-500',
    'success': 'bg-green-500'
}

const borderColorForToastType = {
    'info': 'border-blue-600',
    'warning': 'border-red-600',
    'success': 'border-green-600'
}

const iconsForToastType = {
    'info': 'bi bi-chat-left-text',
    'success': 'bi bi-check-circle',
    'warning': 'bi bi-exclamation-circle'
}


function ToastWidget({toast, onToastClose} : ToastWidgetProps) {
    const dispatch = useAppDispatch();

    // Start a timer when the toast is mounted
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(toastRemoved(toast.id));
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, [dispatch, toast]);
    
    return (
        <div className={`${backgroundColorForToastType[toast.type]} ${borderColorForToastType[toast.type]} border-2 relative p-3 mt-3 text-white shadow-lg rounded-xl md:w-full`}>
            <h1 className="text-lg font-bold"><i className={iconsForToastType[toast.type]}></i>  {titleForToastType[toast.type]}</h1>
            <p>{toast.message}</p>
            <i 
                className="bi bi-x-circle absolute top-2 right-2 hover:cursor-pointer hover:text-gray-300"
                onClick={() => onToastClose(toast.id)}
            ></i>
        </div>
    )
}

export default function ToastsList({toasts, onToastClose}: ToastsListProps) {
    return (
        <TransitionGroup className='fixed bottom-5 left-2 right-2 md:right-auto md:max-w-xs md:w-full'>
        {
            toasts.map((v) => (
                <CSSTransition key={v.id} classNames='toast-fade' timeout={200}>
                    <ToastWidget toast={v} onToastClose={onToastClose} />
                </CSSTransition>
            ))
        }
        </TransitionGroup>
    )
}