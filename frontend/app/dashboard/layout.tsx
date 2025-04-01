import Sidebar from "./components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-lightkblue">
      <Sidebar children={undefined} />
      <main className="flex-1 p-6 mx-4 my-4">
        <div className="bg-white rounded-lg shadow-md p-6 min-h-[calc(100vh-2rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
