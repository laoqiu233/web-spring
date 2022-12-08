import { useState } from "react";
import { CompoundPointRequest } from "../utils/ApiClient";
import { Button } from "./Button";
import CheckboxList from "./CheckboxList";
import TextInput from "./TextInput";
import loaderImage from '../images/loader.svg';

interface PointFormProps {
    showLoader: boolean
    onSubmit(request: CompoundPointRequest): void,
    setGlobalR(r:number):void
};

export default function PointForm({ showLoader, onSubmit, setGlobalR }: PointFormProps) {
    const [xs, setXs] = useState<number[]>([]);
    const [y, setY] = useState('');
    const [rs, setRs] = useState<number[]>([]);

    const xWarning = (xs.length === 0 ? 'Select at least one option' : '');
    const yWarning = (y.match(/^[+-]?[0-9]+(?:\.[0-9]+)?$/) === null || isNaN(parseFloat(y)) || parseFloat(y) > 3 || parseFloat(y) < -5 ? 'Invalid number' : '');
    const rWarning = (rs.length === 0 ? 'Select at least one option' : '') 
                   + (rs.filter(x => x <= 0).length > 0 ? 'You should only select the positive numbers' : '');

    const disableButton = xWarning !== '' || yWarning !== '' || rWarning !== '';

    return (
        <div className="bg-gray-100 w-[90%] p-3 mx-auto mb-5 rounded-xl shadow-xl md:max-w-sm">
            <h1 className='font-bold text-lg'>X values:</h1>
            <CheckboxList
                name='x'
                options={Array(11).fill(0).map((x, i) => i-5)}
                selectedOptions={xs}
                warning={xWarning}
                setValues={setXs}
                disabled={showLoader}
            />
            <h1 className='font-bold text-lg'>Y value:</h1>
            <div className='px-3'>
                <TextInput 
                    name='y'
                    id='r-input'
                    maxLength={15}
                    placeholder="Enter a value from -5 to 3"
                    value={y}
                    onChange={(e) => setY(e.target.value)}
                    warningText={yWarning}
                    disabled={showLoader}
                />
            </div>
            <h1 className='font-bold text-lg'>R values:</h1>
            <CheckboxList
                name='r'
                options={Array(11).fill(0).map((x, i) => i-5)}
                selectedOptions={rs}
                warning={rWarning}
                setValues={(v) => {
                    setRs(v);
                    if (v.length === 0) setGlobalR(0);
                    else setGlobalR(Math.max(...v));
                }}
                disabled={showLoader}
            />
            <Button disabled={disableButton || showLoader} onClick={() => onSubmit({x:xs, r:rs, y: [parseFloat(y)]})}>
                { showLoader ? <img src={loaderImage} alt='Loading animation' className='m-auto max-h-[1em]'/> : 'Submit' }
            </Button>
        </div>
    )
}