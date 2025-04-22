'use client';

import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { LabelKeyObject } from 'react-csv/lib/core';
import {
  ColumnDef,
  HeaderGroup,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';

// project-imports
import Avatar from 'components/@extended/Avatar';
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  RowSelection,
  SelectColumnSorting,
  TablePagination
} from 'components/third-party/react-table';

import { APP_DEFAULT_PATH } from 'config';
import EmptyReactTable from 'views/forms-tables/tables/react-table/EmptyTable';
import AlertMembershipDelete from 'sections/admin-panel/membership/list/AlertMembershipDelete';

// assets
import { Add, Edit, Eye, Trash } from '@wandersonalwes/iconsax-react';

const avatarImage = '/assets/images/users';

// types
interface Admin {
  _id: string;
  name: string;
  email: string;
  avatar?: number;
  contact?: string;
  createdAt?: string;
  role?: string;
}

interface Props {
  columns: ColumnDef<Admin>[];
  data: Admin[];
}

function ReactTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  const safeData = Array.isArray(data) ? data : [];

  const table = useReactTable({
    data: safeData,
    columns,
    state: { columnFilters, sorting, rowSelection, globalFilter },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true
  });

  const headers: LabelKeyObject[] = [];
  columns.map(
    (columns) =>
      columns.id &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        key: columns.id
      })
  );

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 2, p: 3, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${safeData.length} records...`}
          sx={{ width: { xs: 1, sm: 'auto' } }}
        />

        <Stack
          direction="row"
          sx={{ width: { xs: 1, sm: 'auto' }, gap: 2, alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
        >
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} href="/admin-panel/online-course/teacher/add" size="large">
            Add
          </Button>
          <CSVExport
            {...{
              data: table.getRowModel()?.flatRows?.map((row) => row?.original) || [],
              headers,
              filename: 'membership-list.csv'
            }}
          />
        </Stack>
      </Stack>
      <Stack>
        <RowSelection selected={Object.keys(rowSelection).length} />
        <TableContainer>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    if (header.column.columnDef.meta !== undefined && header.column.getCanSort()) {
                      Object.assign(header.column.columnDef.meta, {
                        className: header.column.columnDef.meta.className + ' cursor-pointer prevent-select'
                      });
                    }

                    return (
                      <TableCell
                        key={header.id}
                        {...header.column.columnDef.meta}
                        onClick={header.column.getToggleSortingHandler()}
                        {...(header.column.getCanSort() &&
                          header.column.columnDef.meta === undefined && {
                            className: 'cursor-pointer prevent-select'
                          })}
                      >
                        {header.isPlaceholder ? null : (
                          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                            {header.column.getCanSort() && <HeaderSort column={header.column} />}
                          </Stack>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <TablePagination
              {...{
                setPageSize: table.setPageSize,
                setPageIndex: table.setPageIndex,
                getState: table.getState,
                getPageCount: table.getPageCount
              }}
            />
          </Box>
        </>
      </Stack>
    </MainCard>
  );
}

export default function MembershipList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [membershipDeleteId, setMembershipDeleteId] = useState<any>('');

  const handleClose = () => setOpen(!open);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      const mapped = (data.data || []).map((admin: any) => ({
        _id: admin.admin_id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.created_at
      }));

      setAdmins(mapped);
    } catch (error) {
      console.error('Failed to fetch admins', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const columns = useMemo<ColumnDef<Admin>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row, getValue }) => (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
            <Avatar alt="Avatar" size="md" src={`${avatarImage}/avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`} />
            <Typography variant="body1">{getValue() as string}</Typography>
          </Stack>
        )
      },
      {
        header: 'Email',
        accessorKey: 'email'
      },
      {
        header: 'Role',
        accessorKey: 'role'
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        disableSortBy: true,
        cell: ({ row }) => {
          const collapseIcon =
            row.getCanExpand() && row.getIsExpanded() ? (
              <Box component="span" sx={{ color: 'error.main' }}>
                <Add style={{ transform: 'rotate(45deg)' }} />
              </Box>
            ) : (
              <Eye />
            );
          return (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title="View">
                <IconButton color="secondary" onClick={row.getToggleExpandedHandler()}>
                  {collapseIcon}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  sx={(theme) => ({ ':hover': { ...theme.applyStyles('dark', { color: 'text.primary' }) } })}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    console.log('Edit clicked for:', row.original);
                  }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  sx={(theme) => ({ ':hover': { ...theme.applyStyles('dark', { color: 'text.primary' }) } })}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleClose();
                    setMembershipDeleteId(row.original._id);
                  }}
                >
                  <Trash />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  if (loading) return <EmptyReactTable />;

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'list' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Users list" links={breadcrumbLinks} />
      <ReactTable data={admins} columns={columns} />
      <AlertMembershipDelete id={Number(membershipDeleteId)} open={open} handleClose={handleClose} />
    </>
  );
}
