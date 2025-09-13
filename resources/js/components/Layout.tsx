import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
    return <div className="m-0 box-border h-full w-full bg-white p-0">{children}</div>;
}
