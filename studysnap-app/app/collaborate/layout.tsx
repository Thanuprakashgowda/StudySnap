import Sidebar from '@/components/Sidebar'
export default function L({ children }: { children: React.ReactNode }) {
  return <div className="dashboard-layout"><Sidebar /><main className="dashboard-main">{children}</main></div>
}
