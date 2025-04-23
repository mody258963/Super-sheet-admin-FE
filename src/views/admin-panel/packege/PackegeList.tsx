'use client';

import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

// material-ui
import { alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
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
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';

import {
  CSVExport,
  DebouncedInput,
  HeaderSort,
  RowSelection,
  TablePagination
} from 'components/third-party/react-table';

import { APP_DEFAULT_PATH, GRID_COMMON_SPACING } from 'config';
import EmptyReactTable from 'views/forms-tables/tables/react-table/EmptyTable';

// assets
import { Add, Edit, Eye, Trash, CloseCircle } from '@wandersonalwes/iconsax-react';
import React from 'react';
import { Grid, useTheme } from '@mui/system';
import { FormControlLabel, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Switch, TextField } from '@mui/material';
import Dot from 'components/@extended/Dot';

// types
interface Package {
  package_id: number;
  name: string;
  price: number | string;
  duration: number;
  description: string;
  is_active: boolean;
  updated_at: string;
  created_at: string;
}

interface Plan {
  plan_id: number;
  name: string;
  price: number | string;
  duration: number;
  description: string;
  is_active: boolean;
  updated_at: string;
  created_at: string;
}

interface Props {
  columns: ColumnDef<Package>[];
  data: Package[];
}

// ==============================|| REACT TABLE - LIST ||============================== //

interface StatusOption {
  value: string;
  label: string;
}

function ReactTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Status options for filtering
  const statusOptions: StatusOption[] = [
    {
      value: '',
      label: 'All Status'
    },
    {
      value: 'active',
      label: 'Active'
    },
    {
      value: 'inactive',
      label: 'Inactive'
    }
  ];

  const filteredData = useMemo(() => {
    if (statusFilter === '') return data;
    if (statusFilter === 'active') return data.filter((pkg) => pkg.is_active);
    if (statusFilter === 'inactive') return data.filter((pkg) => !pkg.is_active);
    return data;
  }, [statusFilter, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
      globalFilter
    },
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
      // @ts-expect-error Type 'string | undefined' is not assignable to type 'string'.
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === 'string' ? columns.header : '#',
        // @ts-expect-error Type 'string | undefined' is not assignable to type 'string'.
        key: columns.accessorKey
      })
  );

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={(theme) => ({
          gap: 2,
          justifyContent: 'space-between',
          p: 3,
          [theme.breakpoints.down('sm')]: { '& .MuiOutlinedInput-root, & .MuiFormControl-root': { width: '100%' } }
        })}
      >
        <DebouncedInput
          value={globalFilter ?? ''}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={'Search records...'}
        />

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1">Filter by:</Typography>
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: '120px' }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
          <Button variant="contained" startIcon={<Add />} size="large">
            Add Customer
          </Button>
          <CSVExport
            {...{
              data:
                table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0
                  ? data
                  : table.getSelectedRowModel().flatRows.map((row) => row.original),
              headers,
              filename: 'customer-list.csv'
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
                  {row.getIsExpanded() && (
                    <TableRow
                      sx={(theme) => ({
                        bgcolor: alpha(theme.palette.primary.lighter, 0.1),
                        '&:hover': { bgcolor: `${alpha(theme.palette.primary.lighter, 0.1)} !important` },
                        overflow: 'hidden'
                      })}
                    >
                      <TableCell colSpan={row.getVisibleCells().length} sx={{ p: 2.5, overflow: 'hidden' }}>
                        {/* Package details view would go here */}
                      </TableCell>
                    </TableRow>
                  )}
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
// ==============================|| PACKAGE LIST ||============================== //

export default function PackageList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [error, setError] = useState<string>('');
  
    const [open, setOpen] = useState<boolean>(false);
    const [membershipDeleteId, setMembershipDeleteId] = useState<any>('');
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  
    // Fetch plans from API
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/subscription/plans');
          console.log('Response:', response);
          
          if (!response.ok) {
            throw new Error('Failed to fetch plans');
          }
          
          const data = await response.json();
          console.log('Data:', data);
          
          // Extract plans from the nested structure
          if (data && data.plans && Array.isArray(data.plans)) {
            setPlans(data.plans);
          } else if (Array.isArray(data)) {
            setPlans(data);
          } else {
            setPlans([]);
          }
        } catch (err: any) {
          console.error('Error fetching plans:', err);
          setError(err.message || 'Failed to load plans');
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlans();
    }, []);
  
    const handleClose = () => {
      setOpen(!open);
    };
  
    const handleViewDialogClose = () => {
      setViewDialogOpen(false);
    };
  
    const handleView = (plan: Plan) => {
      setSelectedPlan(plan);
      setViewDialogOpen(true);
    };
  
    const handleEdit = (planId: number) => {
      window.location.href = `/admin-panel/membership/pricing/edit/${planId}`;
    };
  
    // Update the AlertMembershipDelete component to handle delete confirmation
    const handleDeleteConfirm = async () => {
      if (!membershipDeleteId) return;
      
      try {
        const response = await fetch(`/api/subscription/plans/${membershipDeleteId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete plan');
        }
  
        // Refresh the plans list after deletion
        const updatedPlans = plans.filter(plan => plan.plan_id !== membershipDeleteId);
        setPlans(updatedPlans);
        setOpen(false);
      } catch (err: any) {
        console.error('Error deleting plan:', err);
        // You could set an error state here to display to the user
      }
    };
  
    const columns = useMemo<ColumnDef<Plan>[]>(
      () => [
        {
          id: 'select',
          header: ({ table }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                style={{ 
                  opacity: table.getIsSomeRowsSelected() ? 0.5 : 1 
                }}
              />
            </Box>
          ),
          cell: ({ row }) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                style={{ 
                  opacity: row.getIsSomeSelected() ? 0.5 : 1 
                }}
              />
            </Box>
          )
        },
        {
          header: 'Name',
          accessorKey: 'name',
          cell: ({ row, getValue }) => (
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <Typography variant="body1">{getValue() as string}</Typography>
            </Stack>
          )
        },
        {
          header: 'Price',
          accessorKey: 'price',
          cell: ({ getValue }) => {
            const value = getValue();
            // Handle both string and number price formats
            const numPrice = typeof value === 'string' ? parseFloat(value as string) : (value as number);
            return (
              <Typography variant="body1">
                ${!isNaN(numPrice) ? numPrice.toFixed(2) : '0.00'}
              </Typography>
            );
          }
        },
        {
          header: 'Duration',
          accessorKey: 'duration_days',
          cell: ({ getValue }) => (
            <Typography variant="body1">{getValue() as number} days</Typography>
          )
        },
        {
          header: 'Created Date',
          accessorKey: 'created_at',
          cell: ({ getValue }) => {
            const date = new Date(getValue() as string);
            return (
              <Stack>
                <Typography variant="body2">{date.toLocaleDateString()}</Typography>
                <Typography variant="caption" sx={{ color: 'secondary.500' }}>
                  {date.toLocaleTimeString()}
                </Typography>
              </Stack>
            );
          }
        },
        {
          header: 'Status',
          accessorKey: 'is_active',
          cell: ({ getValue }) => {
            const isActive = getValue() as boolean;
            return (
              <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                <Dot color={isActive ? 'success' : 'secondary'} size={6} />
                <Typography sx={{ color: isActive ? 'success.main' : 'secondary.main' }} variant="caption">
                  {isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Stack>
            );
          }
        },
        {
          header: 'Features',
          accessorKey: 'features',
          cell: ({ getValue }) => {
            const features = getValue() as Record<string, boolean>;
            const activeFeatures = Object.keys(features).filter(key => features[key]);
            return (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {activeFeatures.map((feature, index) => (
                  <Chip 
                    key={index} 
                    variant="light" 
                    color="primary" 
                    label={feature} 
                    size="small" 
                  />
                ))}
                {activeFeatures.length === 0 && (
                  <Typography variant="caption" color="text.secondary">No features</Typography>
                )}
              </Stack>
            );
          }
        },
        {
          header: 'Actions',
          meta: {
            className: 'cell-center'
          },
          disableSortBy: true,
          cell: ({ row }) => {
            return (
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
                <Tooltip title="View">
                  <IconButton 
                    color="secondary" 
                    shape="rounded"
                    onClick={() => handleView(row.original)}
                  >
                    <Eye />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton 
                    color="primary" 
                    shape="rounded"
                    onClick={() => handleEdit(Number(row.original.plan_id))}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setMembershipDeleteId(Number(row.original.plan_id));
                      handleClose();
                    }}
                    shape="rounded"
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          }
        }
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );
  
    if (loading) return <EmptyReactTable />;
  
    // Ensure plans is always an array
    const safeData = Array.isArray(plans) ? plans : [];
  
    const breadcrumbLinks = [
      { title: 'home', to: APP_DEFAULT_PATH },
      { title: 'membership', to: '/admin-panel/membership/dashboard' },
      { title: 'plans' }
    ];
  
    return (
      <>
        <Breadcrumbs custom heading="Membership Plans" links={breadcrumbLinks} />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <ReactTable {...{ data: safeData, columns }} />
        {/* Custom AlertDialog for delete confirmation */}
        {open && (
          <MainCard
            title="Delete Confirmation"
            open={open}
            onClose={handleClose}
            modal
            sx={{
              position: 'absolute',
              width: { xs: '90%', sm: 'auto' },
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: 400,
              '& .MuiCardContent-root': {
                p: 0
              }
            }}
            secondary={<IconButton onClick={handleClose}><CloseCircle /></IconButton>}
          >
            <Stack spacing={3} sx={{ p: 3 }}>
              <Typography variant="h5">Are you sure you want to delete this plan?</Typography>
              <Typography variant="body2">This action cannot be undone.</Typography>
              
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        )}
        {selectedPlan && (
          <PlanViewDialog 
            open={viewDialogOpen} 
            handleClose={handleViewDialogClose} 
            plan={selectedPlan} 
          />
        )}
      </>
    );
  }
  