import { DataTablePage } from "@/components/data-table";
import useApi from "@/hooks/useApi.hook";

export default function DevicesPage() {
  const providersApi = useApi({
    settings: { url: "/providers" },
    callOnMount: true,
  });
  return (
    <DataTablePage
      columns={[
        {
          accessorKey: "code",
          header: "Code",
        },
        {
          accessorKey: "lastUpdate",
          header: "Last updated at",
          cell: ({ row }) =>
            row.original.lastUpdate
              ? new Date(row.original.lastUpdate).toLocaleDateString()
              : "Never",
        },
        {
          accessorKey: "providerId",
          header: "Provider",
          cell: ({ row }) => row.original.provider?.name || "None",
        },
      ]}
      title={"All Devices"}
      create={{
        label: "Create Device",
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
          title: "Device",
          desciption: "Edit Device",
        },
      }}
      fields={[
        {
          name: "code",
          label: "Code",
          type: "string",
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
      apiBaseUrl={"/devices"}
    />
  );
}
