import React from "react";
import { useForm, router } from "@inertiajs/react";

export default function Form({ lead = null }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    status: lead?.status || "New",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (lead) {
      put(`/leads/${lead.id}`, {
        onSuccess: () => router.get("/leads"),
      });
    } else {
      post("/leads", {
        onSuccess: () => router.get("/leads"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.name && <div className="text-red-500">{errors.name}</div>}
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.email && <div className="text-red-500">{errors.email}</div>}
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData("phone", e.target.value)}
          className="border p-2 w-full"
        />
        {errors.phone && <div className="text-red-500">{errors.phone}</div>}
      </div>

      <div>
        <label>Status</label>
        <select
          value={data.status}
          onChange={(e) => setData("status", e.target.value)}
          className="border p-2 w-full"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="bg-blue-500 text-white px-4 py-2"
      >
        {processing ? "Saving..." : lead ? "Update" : "Create"}
      </button>
    </form>
  );
}