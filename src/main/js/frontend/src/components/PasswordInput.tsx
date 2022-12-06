import { InputHTMLAttributes, useState } from "react";
import TextInput from "./TextInput";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    warningText?: string
}

export default function PasswordInput(props : TextInputProps) {
    const [visible, setVisible] = useState(false);

    const iconClassName = (visible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill");

    return (
        <TextInput type={(visible ? 'text' : 'password')} {...props}>
            <i onClick={() => setVisible(!visible)} className={`${iconClassName} absolute -translate-y-1/2 top-1/2 right-3 hover:cursor-pointer hover:text-violet-500 transition-colors`}></i>
        </TextInput>
    )
}