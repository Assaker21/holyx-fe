import { DataTablePage } from "@/components/data-table";
import useApi from "@/hooks/useApi.hook";

export default function UsersPage() {
  const providersApi = useApi({
    settings: { url: "/providers" },
    callOnMount: true,
  });
  return (
    <DataTablePage
      columns={[
        {
          accessorKey: "firstName",
          header: "First name",
        },
        {
          accessorKey: "lastName",
          header: "Last name",
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        { accessorKey: "role", header: "Role" },
        {
          accessorKey: "providerId",
          header: "Provider",
          cell: ({ row }) => row.original.provider?.name || "None",
        },
      ]}
      title={"All Users"}
      create={{
        label: "Create User",
        dialog: {
          title: "User",
          desciption: "",
        },
        onSubmit: (data) => {},
      }}
      remove={{}}
      edit={{
        onSubmit: (data) => {},
        dialog: {
          title: "User",
          desciption: "Edit User",
        },
      }}
      fields={[
        {
          name: "firstName",
          label: "First Name",
          type: "string",
        },
        {
          name: "lastName",
          label: "Last Name",
          type: "string",
        },
        {
          name: "email",
          label: "Email",
          type: "string",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            {
              value: "ADMIN",
              label: "Admin",
            },
            { value: "PROVIDER", label: "Provider" },
          ],
        },

        {
          name: "providerId",
          label: "Provider",
          type: "select",
          options:
            providersApi.data?.map((v) => ({
              value: v.id,
              label: v.name,
            })) || [],
        },
      ]}
      apiBaseUrl={"/users"}
    />
  );
}
