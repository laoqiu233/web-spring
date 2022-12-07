interface CheckboxListProps {
    name: string,
    options: number[],
    selectedOptions: number[],
    warning: string,
    disabled: boolean
    setValues(values: number[]): void
};

export default function CheckboxList({name, selectedOptions, options, warning, disabled, setValues}: CheckboxListProps) {

    function toggleOption(x: number) {
        if (selectedOptions.includes(x)) {
            setValues(selectedOptions.filter((i) => i !== x));
        } else {
            setValues([...selectedOptions, x]);
        }
    }

    return (
        <div className="mb-3">
            <div className="px-3 py-2 columns-3">
                {options.map((x) => (
                    <div key={x} className='flex flex-row items-center justify-start'>
                        <input 
                            type='checkbox'
                            name={name}
                            id={`${name}-checkbox-${x}`}
                            value={x}
                            checked={selectedOptions.includes(x)}
                            onChange={() => toggleOption(x)}
                            disabled={disabled}
                            className='mr-2 w-4 h-4'
                        />
                        <label>
                            {x}
                        </label>
                    </div>
                ))}
            </div>
            <p className="text-red-500 px-3 text-xs">{warning}</p>
        </div>
    )
}