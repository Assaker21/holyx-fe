import { DataTablePage } from "@/components/data-table";
import useApi from "@/hooks/useApi.hook";

export default function ProvidersPage() {
  const categoriesApi = useApi({
    settings: {
      url: "/categories",
    },
    callOnMount: true,
  });

  return (
    <DataTablePage
      columns={[
        {
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "allowDevicesToChangeProvider",
          header: "Allow devices to change provider",
        },

        {
          accessorKey: "categoryId",
          header: "Category",
          cell: ({ row }) => row.original.category?.name || "None",
        },
        {
          accessorKey: "schedule",
          header: "Schedule",
          cell: ({ row }) =>
            (row.original.schedule.join(", ").length > 100
              ? row.original.schedule.join(", ").slice(0, 100) + "..."
              : row.original.schedule.join(", ")) || "None",
        },
      ]}
      title={"All Providers"}
      create={{
        label: "Create Provider",
        dialog: {
          title: "Provider",
          desciption: "",
        },
        onSubmit: (data) => {},
      }}
      remove={{}}
      edit={{
        onSubmit: (data) => {},
        dialog: {
          title: "Provider",
          desciption: "Edit Provider",
        },
      }}
      fields={[
        {
          name: "name",
          label: "Name",
          type: "string",
        },
        {
          name: "logo",
          label: "Logo",
          type: "string",
        },
        {
          name: "allowDevicesToChangeProvider",
          label: "Allow devices to change provider",
          type: "checkbox",
        },
        {
          name: "categoryId",
          label: "Category",
          type: "select",
          options:
            categoriesApi.data?.map((v) => ({
              value: v.id,
              label: v.name,
            })) || [],
        },
        {
          name: "image",
          label: "Image",
          type: "base64BW",
        },

        {
          name: "schedule",
          label: "Schedule",
          type: "array",
        },
      ]}
      apiBaseUrl={"/providers"}
    />
  );
}
