import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import useApi from "@/hooks/useApi.hook";
import {
  base64StringToImageUrl,
  imageToBase64String,
} from "@/lib/imageToBase64String";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import SpinnerCircle3 from "./spinner-09";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

function Row({ row }) {
  return (
    <TableRow className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80">
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTablePage({
  columns: inputColumns,
  fields,
  title,
  edit,
  create,
  remove,
  disableCheckbox,
  apiBaseUrl,
}) {
  const dataApi = useApi({
    settings: {
      url: apiBaseUrl,
    },
    callOnMount: true,
  });
  if (!dataApi.data)
    return (
      <div className="flex flex-row h-[calc(100vh-100px)] justify-center items-center">
        <SpinnerCircle3 />
      </div>
    );

  return (
    <ActualDataTable
      columns={inputColumns}
      fields={fields}
      title={title}
      edit={edit}
      create={create}
      remove={remove}
      disableCheckbox={disableCheckbox}
      apiBaseUrl={apiBaseUrl}
      dataApi={dataApi}
    />
  );
}

function ActualDataTable({
  columns: inputColumns,
  fields,
  title,
  edit,
  create,
  remove,
  disableCheckbox,
  apiBaseUrl,
  dataApi,
}) {
  const columns = [
    ...(disableCheckbox
      ? []
      : [
          {
            id: "select",
            header: ({ table }) => (
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label="Select all"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                  aria-label="Select row"
                />
              </div>
            ),
            enableSorting: false,
            enableHiding: false,
          },
        ]),
    ...inputColumns.map((col) => ({
      ...col,
    })),
    ...(edit || remove
      ? [
          {
            id: "actions",
            cell: ({ row }) => {
              const [open, setOpen] = React.useState(false);

              return (
                <div className="flex flex-row items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                      >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {edit ? (
                        <DropdownMenuItem onSelect={() => setOpen(true)}>
                          Edit
                        </DropdownMenuItem>
                      ) : null}
                      {remove ? (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => remove?.onClick?.(row)}
                        >
                          Delete
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {edit ? (
                    <TableCellViewer
                      title="Document"
                      {...edit.dialog}
                      item={row.original}
                      open={open}
                      onOpenChange={setOpen}
                      fields={fields}
                      onSubmit={edit.onSubmit}
                      mode="edit"
                      onSubmitSuccessful={() => {
                        dataApi.call();
                      }}
                      apiBaseUrl={apiBaseUrl}
                    />
                  ) : null}
                </div>
              );
            },
          },
        ]
      : []),
  ];
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [createOpen, setCreateOpen] = React.useState(false);

  const table = useReactTable({
    data: dataApi.data || [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      {create ? (
        <TableCellViewer
          title="Create"
          {...create.dialog}
          item={{}}
          open={createOpen}
          onOpenChange={setCreateOpen}
          fields={fields}
          onSubmit={create.onSubmit}
          onSubmitSuccessful={() => {
            dataApi.call();
          }}
          apiBaseUrl={apiBaseUrl}
          mode="create"
        />
      ) : null}
      <div className="flex items-center justify-between px-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {create ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCreateOpen(true);
              }}
              className={"flex flex-row"}
            >
              <IconPlus />
              <span className="hidden lg:inline">{create?.label}</span>
            </Button>
          </div>
        ) : null}
      </div>
      <div className="px-4">
        <div className="overflow-hidden rounded-lg border ">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => <Row key={row.id} row={row} />)
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </Tabs>
  );
}

function TableCellViewer({
  item = {},
  title,
  description,
  open,
  onOpenChange,
  fields = [],
  onSubmit,
  onSubmitSuccessful,
  mode,
  apiBaseUrl,
}) {
  const [loading, setLoading] = React.useState(false);
  const api = useApi({
    settings: {
      url: `${apiBaseUrl}${mode == "create" ? "" : "/:id"}`,
      method: mode == "create" ? "POST" : "PUT",
    },
  });
  const [form, setForm] = React.useState(() => {
    const form = item;

    fields.forEach((field) => {
      form[field.name] = item[field.name] || field.defaultValue;
    });

    return form;
  });

  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (open) {
      setForm(() => {
        const form = item;

        fields.forEach((field) => {
          form[field.name] = item[field.name] || field.defaultValue;
        });

        return form;
      });
    }
  }, [open]);

  function changeForm(key, value) {
    setForm((form) => ({ ...form, [key]: value }));
  }

  function renderField(field) {
    const value = form[field.name];

    switch (field.type) {
      case "string":
        return (
          <div className="flex flex-col gap-3" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={form[field.name]}
              onChange={(e) => {
                changeForm(field.name, e.target.value);
              }}
              required
            />
          </div>
        );

      case "select": {
        return (
          <div className="flex flex-col gap-3" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select
              id={field.name}
              value={form[field.name]}
              onValueChange={(value) => {
                changeForm(field.name, value);
              }}
              required
            >
              <SelectTrigger id={field.name} className="w-full">
                <SelectValue
                  defaultValue={`Select ${field.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }

      case "checkbox":
        return (
          <div className="flex items-center gap-3" key={field.name}>
            <input
              type="checkbox"
              id={field.name}
              checked={Boolean(value)}
              onChange={(e) => {
                changeForm(field.name, e.target.checked);
              }}
              className="accent-blue-500"
            />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );

      case "array":
        return (
          <div className="flex flex-col gap-3" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              rows={10}
              id={field.name}
              value={Array.isArray(value) ? value.join(", ") : ""}
              onChange={(e) => {
                changeForm(
                  field.name,
                  e.target.value.split(",").map((v) => v.trim())
                );
              }}
              required
              placeholder="Comma-separated"
            />
          </div>
        );

      case "base64BW":
        return (
          <div className="flex flex-col gap-3" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>

            <Label
              htmlFor={field.name}
              className={
                "relative group inline-block w-full rounded-sm overflow-hidden border"
              }
            >
              <img
                className="w-full min-h-15"
                src={base64StringToImageUrl(form[field.name])}
              />
              <div
                className={cn(
                  "cursor-pointer absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                  !form[field.name] && "opacity-100"
                )}
              >
                Edit
              </div>
            </Label>
            {/*<Input
              id={field.name}
              value={form[field.name]}
              onChange={(e) => {
                changeForm(field.name, e.target.value);
              }}
              required
            />*/}

            <input
              id={field.name}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const str = await imageToBase64String(file);
                  changeForm(field.name, str);
                }
              }}
            />
          </div>
        );
        break;

      default:
        return null;
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent
        ContainerComponent="form"
        containerComponentProps={{
          onSubmit: async (e) => {
            setLoading(true);
            e.preventDefault();
            onSubmit?.(form);

            const sentData = {};
            fields.map((field) => {
              sentData[field.name] = form[field.name];
            });
            const response = await api.call({
              params: {
                id: item.id,
              },
              body: sentData,
            });

            if (response.ok) {
              await onSubmitSuccessful?.();
            }

            onOpenChange?.(false);

            setLoading(false);
          },
        }}
      >
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea
          className={cn(
            "flex max-h-[calc(100vh-176px)] touch-auto flex-1 flex-col gap-4 overflow-y-visible px-4 text-sm pb-4",
            isMobile && "max-h-[calc(100vh-400px)]"
          )}
        >
          <div className="flex flex-col gap-4">{fields.map(renderField)}</div>
        </ScrollArea>
        <DrawerFooter>
          <Button type="submit" loading={loading}>
            {mode == "create" ? "Create" : "Save"}
          </Button>
          <DrawerClose asChild>
            <Button disabled={loading} type="button" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
