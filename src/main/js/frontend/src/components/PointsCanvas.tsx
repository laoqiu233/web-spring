import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { infoToast } from "../features/toasts/toastsSlice";
import { getCanvasBitmap, PointAttempt } from "../utils/ApiClient";

const canvasSize = 300;
const themeColor = [0xAA, 0xBB, 0xCC, 0xFF];
const hitColor = 'rgb(139, 92, 246)';
const missColor = 'rgb(239, 68, 68)';

interface PointsCanvasProps {
    points: PointAttempt[],
    r: number,
    disabled: boolean,
    onClick(x:number, y:number):void
}

function generateImageDataFromBitmap(ctx: CanvasRenderingContext2D, bitmap: any[], bitmapSize: number) {
    const w = canvasSize;
    const imageData = ctx.createImageData(w, w);

    for (let y = 0; y < w; y++) {
        for (let x = 0; x < w; x++) {
            const x_ = Math.floor(x * bitmapSize / w);
            const y_ = Math.floor(y * bitmapSize / w);

            if (bitmap[y_ * bitmapSize + x_]) {
                themeColor.forEach((v, c) => imageData.data[(y*w+x)*4+c] = v);
            }
        }
    }

    return imageData;
}

function renderGraph(ctx: CanvasRenderingContext2D, points:PointAttempt[], r: number) {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';

    ctx.beginPath();
    ctx.moveTo(0, canvasSize/2);
    ctx.lineTo(canvasSize, canvasSize/2);
    ctx.lineTo(canvasSize-10, canvasSize/2-10);
    ctx.moveTo(canvasSize, canvasSize/2);
    ctx.lineTo(canvasSize-10,canvasSize/2+10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasSize/2, canvasSize);
    ctx.lineTo(canvasSize/2, 0);
    ctx.lineTo(canvasSize/2-10, 10);
    ctx.moveTo(canvasSize/2, 0);
    ctx.lineTo(canvasSize/2+10, 10);
    ctx.stroke();

    const labels = ['-R', '-R/2', '', 'R/2', 'R'];

    // Draw axes labels
    for (let i=1; i<6; i++) {
        ctx.beginPath();
        ctx.moveTo(i*canvasSize/6, canvasSize/2-5);
        ctx.lineTo(i*canvasSize/6, canvasSize/2+5);
        ctx.moveTo(canvasSize/2-5, i*canvasSize/6);
        ctx.lineTo(canvasSize/2+5, i*canvasSize/6);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(labels[i-1], i*canvasSize/6, canvasSize/2-7);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i-1], canvasSize/2+7, canvasSize - i*canvasSize/6);
    }

    if (r <= 0) return;

    // Draw all points
    points.forEach((v) => {
        const x = v.x / r * canvasSize / 3 + canvasSize / 2;
        const y = -v.y / r * canvasSize / 3 + canvasSize / 2;

        ctx.fillStyle = (v.success ? hitColor : missColor);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

export default function PointsCanvas({points, r, disabled, onClick} : PointsCanvasProps) {
    const { authenticated, userInfo: { accessToken } } = useAppSelector(state => state.auth);
    const [areasImage, setAreasImage] = useState('');
    const dispatch = useAppDispatch();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (authenticated) {
            getCanvasBitmap(accessToken)
            .then((res) => {
                if (res.success && canvasRef.current != null) {
                    const ctx = canvasRef.current.getContext('2d');
                    // Decode base64 binary data into byte-string
                    const bitmapBytes = atob(res.payload);
                    let bitmap = [];

                    // Counts bitmap side length
                    let s = 0;

                    for (let i = 0; i < bitmapBytes.length; i++) {
                        for (let j = 0; j < 8; j++) {
                            bitmap.push((bitmapBytes.charCodeAt(i) >> (7 - j)) % 2);
                            if (bitmap.length >= (s+1) * (s+1)) s++;
                        }
                    }

                    bitmap = bitmap.slice(0, s*s);
                    // Workaround to avoid painting image multiple times on canvas.
                    // Due to glitch the backgorund dissappears on mouse move.
                    if (ctx !== null && canvasRef.current !== null) {
                        const areasImage = generateImageDataFromBitmap(ctx, bitmap, s);
                        ctx.putImageData(areasImage, 0, 0);
                        setAreasImage(canvasRef.current.toDataURL());
                    }
                }
            });
        }
    }, [authenticated, canvasRef]);

    useEffect(() => {
        if (canvasRef.current !== null) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx !== null) renderGraph(ctx, points, r);
        }
    }, [points, r, canvasRef]);

    return (
        <canvas
            ref={canvasRef} 
            style={{background: `url("${areasImage}")`}}
            className={(disabled ? 'blur-sm' : '')}
            width={canvasSize}
            height={canvasSize}
            onClick={(e) => {
                if (!disabled) {
                    if (r <= 0) {
                        dispatch(infoToast('Please select a valid vlaue for R'));
                    } else {
                        const offsetX = e.nativeEvent.offsetX;
                        const offsetY = e.nativeEvent.offsetY;

                        let x = (2 * offsetX / canvasSize - 1) *  1.5 * r;
                        let y = (2 * offsetY / canvasSize - 1) * -1.5 * r;
                        x = Math.round(x * 100) / 100;
                        y = Math.round(y * 100) / 100;

                        onClick(x, y);
                    }
                }
            }}
        />
    )
}