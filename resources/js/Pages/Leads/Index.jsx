import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ auth, leads, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [loading, setLoading] = useState(false);

  const updateQuery = (params) => {
    setLoading(true);

    router.get(
      "/leads",
      { ...filters, ...params },
      {
        preserveState: true,
        replace: true,
        onFinish: () => setLoading(false),
      },
    );
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      updateQuery({ search });
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  const handleFilter = (e) => {
    updateQuery({ status: e.target.value });
  };

  const handleSort = () => {
    updateQuery({
      sort: filters.sort === "asc" ? "desc" : "asc",
    });
  };

  const deleteLead = (id) => {
    if (confirm("Are you sure?")) {
      router.delete(`/leads/${id}`, {
        preserveScroll: true,
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
      });
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Leads</h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2"
          />

          <select
            onChange={handleFilter}
            value={filters.status || ""}
            className="border p-2"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>

          <button onClick={handleSort} className="border px-3 py-2 bg-gray-100">
            Sort: {filters.sort === "asc" ? "↑" : "↓"}
          </button>

          <button
            onClick={() => router.get("/leads/create")}
            className="bg-blue-500 text-white px-4 py-2"
          >
            + Create Lead
          </button>
        </div>

        {loading && <p className="mb-2">Loading...</p>}

        <table border="1" cellPadding="10" width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                Created At {filters.sort === "asc" ? "↑" : "↓"}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leads.data.length > 0 ? (
              leads.data.map((lead) => (
                <tr key={lead.id}>
                  <td className="text-center">{lead.name}</td>
                  <td className="text-center">{lead.email}</td>
                  <td className="text-center">{lead.phone}</td>
                  <td className="text-center">
                    <select
                      value={lead.status}
                      onChange={(e) => {
                        router.patch(
                          `/leads/${lead.id}/status`,
                          { status: e.target.value },
                          {
                            preserveScroll: true,
                            preserveState: true,
                          },
                        );
                      }}
                      className="border px-2 py-1"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                  <td className="text-center">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => router.get(`/leads/${lead.id}/edit`)}
                      className="mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" align="center">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4 flex gap-2 flex-wrap">
          {leads.links.map((link, index) => (
            <button
              key={index}
              disabled={!link.url}
              onClick={() =>
                link.url && router.get(link.url, {}, { preserveState: true })
              }
              dangerouslySetInnerHTML={{ __html: link.label }}
              className={`px-3 py-1 border ${
                link.active ? "bg-blue-500 text-white" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
