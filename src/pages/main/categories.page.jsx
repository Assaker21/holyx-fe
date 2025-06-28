import { DataTablePage } from "@/components/data-table";

export default function CategoriesPage() {
  return (
    <DataTablePage
      columns={[
        {
          accessorKey: "name",
          header: "Name",
        },
      ]}
      title={"All Categories"}
      create={{
        label: "Create Category",
        dialog: {
          title: "Category",
          desciption: "",
        },
        onSubmit: (data) => {},
      }}
      remove={{}}
      edit={{
        onSubmit: (data) => {},
        dialog: {
          title: "Category",
          desciption: "Edit Category",
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
      ]}
      apiBaseUrl={"/categories"}
    />
  );
}
