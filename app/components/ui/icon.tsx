import { cloneElement, type ReactElement } from "react";
import type { LucideProps } from "lucide-react";

interface IconWrapperProps {
    children: ReactElement<LucideProps>;
    s?: boolean;
    m?: boolean;
    l?: boolean;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export const IconWrapper = ({

    children,
    s,
    m,
    l,
    size = 22,
    strokeWidth = 1.5,
    className = ''
}: IconWrapperProps) => {
    s ? size = 14 :
        m ? size = 18 :
            l ? size = 18 :
                size = size
    return cloneElement(children, { size, strokeWidth, className });
};
