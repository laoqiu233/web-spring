interface PaginatorProps {
    currentPage: number,
    totalPageCount: number,
    selectPage(page: number): void
};

interface ButtonProps {
    disabled: boolean,
    children?: React.ReactNode,
    onClick(): void
}

const pagesToDisplay = 3;

function Button({disabled, children, onClick} : ButtonProps) {
    return (
        <div className={`
            w-10 h-10 bg-slate-300 p-2 mx-1 rounded-lg hover:bg-slate-400 hover:cursor-pointer text-center 
            ${disabled && 'text-white bg-slate-600 hover:bg-slate-600 hover:cursor-auto'}
        `}
            onClick={() => disabled || onClick()}
        >
            {children}
        </div>
    )
}

export default function Paginator({currentPage, totalPageCount, selectPage} : PaginatorProps) {
    let rangeLeft:number, rangeRight:number;

    // Try to determine the range that contains exactly the needed amount of pages
    // and has selected page in the center. If that is not possible, selects a
    // range that either starts at 0 or ends at the last page.
    if (totalPageCount < pagesToDisplay) {
        rangeLeft = 0;
        rangeRight = totalPageCount;
    } else if (currentPage < pagesToDisplay / 2 && currentPage < totalPageCount - pagesToDisplay / 2) {
        rangeLeft = 0;
        rangeRight = pagesToDisplay;
    } else if (currentPage > totalPageCount - pagesToDisplay / 2 && currentPage > pagesToDisplay / 2) {
        rangeLeft = totalPageCount - pagesToDisplay;
        rangeRight = totalPageCount;
    } else {
        rangeLeft = Math.max(0, currentPage - Math.floor(pagesToDisplay/2));
        rangeRight = Math.min(totalPageCount, currentPage + Math.floor(pagesToDisplay/2) + 1);
    }

    const pageNums = Array(rangeRight - rangeLeft).fill(0).map((v, i) => rangeLeft+i);

    return (
        <div className='flex justify-center my-5'>
            <Button disabled={currentPage === 0} onClick={() => selectPage(0)}>
                <i className="bi bi-chevron-double-left"></i>
            </Button>
            <Button disabled={currentPage === 0} onClick={() => selectPage(currentPage - 1)}>
                <i className="bi bi-chevron-left"></i>
            </Button>

            {
                pageNums.map((v) => (
                    <Button key={v} disabled={v === currentPage} onClick={() => selectPage(v)}>
                        <p>{v+1}</p>
                    </Button>
                ))
            }

            <Button disabled={currentPage === totalPageCount - 1} onClick={() => selectPage(currentPage + 1)}>
                <i className="bi bi-chevron-right"></i>
            </Button>
            <Button disabled={currentPage === totalPageCount - 1} onClick={() => selectPage(totalPageCount - 1)}>
                <i className="bi bi-chevron-double-right"></i>
            </Button>
        </div>
    )
}