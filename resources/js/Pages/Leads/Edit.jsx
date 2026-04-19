import React from "react";
import Form from "./Form";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth, lead }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="p-6 max-w-xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">Edit Lead</h1>

          <button
            onClick={() => router.get("/leads")}
            className="border px-3 py-1"
          >
            Back
          </button>
        </div>

        <Form lead={lead} />
      </div>
    </AuthenticatedLayout>
  );
}