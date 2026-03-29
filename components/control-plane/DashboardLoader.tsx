'use client'

// Client Component wrapper — dynamic() with ssr:false is only valid in Client Components.
// The Server Component page.tsx imports this instead of ControlPlaneDashboard directly.
import dynamic from 'next/dynamic'

const ControlPlaneDashboard = dynamic(
  () => import('./ControlPlaneDashboard'),
  { ssr: false, loading: () => null }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DashboardLoader(props: any) {
  return <ControlPlaneDashboard {...props} />
}
