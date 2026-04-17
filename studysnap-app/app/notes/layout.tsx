import Sidebar from '@/components/Sidebar'
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main">{children}</main></div>
}
