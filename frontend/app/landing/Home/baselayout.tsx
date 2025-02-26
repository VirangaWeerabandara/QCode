import { ReactNode } from "react";
import Sidebar from "./sidebar";

interface Props {
  children: ReactNode | ReactNode[];
}

export default function BaseLayout({ children }: Props) {
  return (
    <div className="flex h-screen gap-8 text-charcoal bg-lightkblue">
      <Sidebar />
      {children}
    </div>
  );
}
