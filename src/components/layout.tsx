import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
    return ( 
        <main className="flex h-screen justify-center">
            <div className="w-full h-full md:max-w-2xl border-x border-slate-200 overflow-y-scroll">
                {props.children}
            </div>
        </main>
     );
}
 