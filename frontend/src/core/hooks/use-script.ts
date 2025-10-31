// src/core/hooks/use-script.ts
import { useEffect } from 'react';

export const useScript = (src: string) => {
    useEffect(() => {
        if (document.querySelector(`script[src="${src}"]`)) return;

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        // Quan trọng: Vì đây là Web Component module, cần type="module"
        script.type = 'module';
        document.body.appendChild(script);

        return () => {
            // Tùy chọn: Dọn dẹp script khi component unmount
            // document.body.removeChild(script);
        };
    }, [src]);
};