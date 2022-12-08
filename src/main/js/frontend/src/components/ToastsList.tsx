import { CSSTransition, TransitionGroup } from "react-transition-group"
import { Toast } from "../features/toasts/toastsSlice"

interface ToastsListProps {
    toasts: Toast[],
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


export default function ToastsList({toasts, onToastClose}: ToastsListProps) {
    return (
        <TransitionGroup className='fixed bottom-5 left-2 right-2 md:right-auto md:max-w-xs md:w-full'>
        {
            toasts.map((v) => (
                <CSSTransition key={v.id} classNames='toast-fade' timeout={200}>
                    <div className={`${backgroundColorForToastType[v.type]} ${borderColorForToastType[v.type]} border-2 relative p-3 mt-3 text-white shadow-lg rounded-xl md:w-full`}>
                        <h1 className="text-lg font-bold"><i className={iconsForToastType[v.type]}></i>  {titleForToastType[v.type]}</h1>
                        <p>{v.message}</p>
                        <i 
                            className="bi bi-x-circle absolute top-2 right-2 hover:cursor-pointer hover:text-gray-300"
                            onClick={() => onToastClose(v.id)}
                        ></i>
                    </div>
                </CSSTransition>
            ))
        }
        </TransitionGroup>
    )
}