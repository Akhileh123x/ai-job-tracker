import { getApplications, deleteApplication } from "../../actions/application.actions";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { formatCurrency } from "../../lib/utils";

// Force Next.js to fetch fresh MongoDB entries on every single refresh/load
export const dynamic = "force-dynamic";

export default async function ApplicationsPage({ searchParams }) {
  const queryParams = await searchParams;
  const search = queryParams?.search || "";
  const status = queryParams?.status || "";
  
  const mockUserId = "mock-valid-id"; 
  const apps = await getApplications(mockUserId, search, status);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Tracked Applications ({apps.length})</h1>
        <form method="GET" className="flex gap-2">
          <input 
            name="search" 
            defaultValue={search} 
            placeholder="Filter company/role..." 
            className="bg-white border border-slate-300 text-sm px-3 py-1.5 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Clean Light-Themed Data Table Dashboard View */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold border-b border-slate-200">
            <tr>
              <th className="p-4">Company</th>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {apps.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No applications tracked yet.
                </td>
              </tr>
            ) : (
              apps.map((app) => {
                const deleteActionWithId = deleteApplication.bind(null, app._id);

                return (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{app.companyName}</td>
                    <td className="p-4 text-slate-700">{app.jobTitle}</td>
                    <td className="p-4 text-xs text-slate-500">{app.jobType}</td>
                    <td className="p-4 text-slate-700">{formatCurrency(app.salary)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link href={`/applications/${app._id}/edit`}>
                        <Button variant="outline" className="text-xs px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700">Edit</Button>
                      </Link>
                      <form action={deleteActionWithId}>
                        <Button type="submit" variant="danger" className="text-xs px-2.5 py-1">Delete</Button>
                      </form>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}