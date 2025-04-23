'use client';

import { useMemo, useState, Fragment, MouseEvent, useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
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
import Breadcrumbs from 'components/@extended/Breadcrumbs';
import Dot from 'components/@extended/Dot';
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

// types
// Define Coach type
interface Coach {
  coach_id: number;
  name: string;
  email: string;
}

// Define Plan type
interface Plan {
  plan_id: number;
  name: string;
  price: number | string;
  duration_days: number;
}

// Define Subscription type
interface Subscription {
  subscription_id: number;
  coach_id: number;
  plan_id: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed';
  payment_date?: string;
  payment_method?: string;
  payment_reference?: string;
  payment_notes?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  coach?: Coach;
  plan?: Plan;
  created_at: string;
  updated_at: string;
}

// assets
import { Add, Edit, Eye, Trash, CloseCircle, Calendar, Wallet, Profile } from '@wandersonalwes/iconsax-react';

// Subscription View Dialog Component
interface SubscriptionViewDialogProps {
  open: boolean;
  handleClose: () => void;
  subscription: Subscription;
}

function SubscriptionViewDialog({ open, handleClose, subscription }: SubscriptionViewDialogProps) {
  if (!subscription) return null;
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate days remaining or days overdue
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining(subscription.end_date);
  
  return (
    <MainCard
      title="Subscription Details"
      open={open}
      onClose={handleClose}
      modal
      sx={{
        position: 'absolute',
        width: { xs: '90%', sm: 'auto' },
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 700,
        '& .MuiCardContent-root': {
          p: 0
        }
      }}
      secondary={<IconButton onClick={handleClose}><CloseCircle /></IconButton>}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* Subscription ID */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Subscription ID</Typography>
          <Typography variant="body1">#{subscription.subscription_id}</Typography>
        </Stack>
        <Divider />
        
        {/* Coach Information */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Coach</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Profile size={16} />
            <Typography variant="body1">
              {subscription.coach ? subscription.coach.name : `Coach #${subscription.coach_id}`}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        
        {/* Plan Information */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Plan</Typography>
          <Typography variant="body1">
            {subscription.plan ? subscription.plan.name : `Plan #${subscription.plan_id}`}
          </Typography>
        </Stack>
        <Divider />
        
        {/* Price */}
        {subscription.plan && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">Price</Typography>
              <Typography variant="body1">
                ${typeof subscription.plan.price === 'string' 
                  ? parseFloat(subscription.plan.price).toFixed(2) 
                  : subscription.plan.price.toFixed(2)}
              </Typography>
            </Stack>
            <Divider />
          </>
        )}
        
        {/* Subscription Period */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Period</Typography>
          <Stack>
            <Typography variant="body2" align="right">
              <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {formatDate(subscription.start_date)} - {formatDate(subscription.end_date)}
            </Typography>
            <Typography 
              variant="caption" 
              color={daysRemaining > 0 ? 'success.main' : 'error.main'}
              align="right"
            >
              {daysRemaining > 0 
                ? `${daysRemaining} days remaining` 
                : `${Math.abs(daysRemaining)} days overdue`}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        
        {/* Subscription Status */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Status</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Dot 
              color={
                subscription.status === 'active' ? 'success' : 
                subscription.status === 'expired' ? 'warning' : 'error'
              } 
              size={6} 
            />
            <Typography 
              color={
                subscription.status === 'active' ? 'success.main' : 
                subscription.status === 'expired' ? 'warning.main' : 'error.main'
              }
            >
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        
        {/* Payment Status */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Payment Status</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Wallet size={16} />
            <Chip 
              label={subscription.payment_status.charAt(0).toUpperCase() + subscription.payment_status.slice(1)} 
              color={
                subscription.payment_status === 'paid' ? 'success' : 
                subscription.payment_status === 'pending' ? 'warning' : 'error'
              }
              size="small"
            />
          </Stack>
        </Stack>
        <Divider />
        
        {/* Payment Method (if available) */}
        {subscription.payment_method && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">Payment Method</Typography>
              <Typography variant="body1">{subscription.payment_method}</Typography>
            </Stack>
            <Divider />
          </>
        )}
        
        {/* Payment Date (if available) */}
        {subscription.payment_date && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h5">Payment Date</Typography>
              <Typography variant="body1">{formatDate(subscription.payment_date)}</Typography>
            </Stack>
            <Divider />
          </>
        )}
        
        {/* Created & Updated */}
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Created</Typography>
          <Typography variant="body1">{formatDate(subscription.created_at)}</Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}

// const avatarImage = '/assets/images/users';

interface Props {
  columns: ColumnDef<Subscription>[];
  data: Subscription[];
}

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'subscription_id', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');

  // Filter data based on status and payment status
  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    // Apply status filter
    if (statusFilter !== '') {
      filtered = filtered.filter((subscription) => subscription.status === statusFilter);
    }
    
    // Apply payment status filter
    if (paymentStatusFilter !== '') {
      filtered = filtered.filter((subscription) => subscription.payment_status === paymentStatusFilter);
    }
    
    return filtered;
  }, [statusFilter, paymentStatusFilter, data]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
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
        sx={(theme: any) => ({
          gap: 2,
          justifyContent: 'space-between',
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`
        })}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <DebouncedInput
            value={globalFilter ?? ''}
            onFilterChange={(value) => setGlobalFilter(String(value))}
            placeholder={`Search ${filteredData.length} records...`}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">Status:</Typography>
            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ minWidth: '120px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">Payment:</Typography>
            <Select
              size="small"
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              sx={{ minWidth: '120px' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          sx={{ width: { xs: 1, sm: 'auto' }, gap: 2, alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
        >
          <SelectColumnSorting {...{ getState: table.getState, getAllColumns: table.getAllColumns, setSorting }} />
          <Button variant="contained" startIcon={<Add />} href="/admin-panel/membership/subscription/add" size="large">
            Add Subscription
          </Button>
          <CSVExport
            {...{
              data: table.getSelectedRowModel().flatRows.map((row) => row.original).length === 0 ? filteredData : table.getSelectedRowModel().flatRows.map((row) => row.original),
              headers,
              filename: 'subscriptions.csv'
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

// ==============================|| MEMBERSHIP LIST ||============================== //

export default function MembershipList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string>('');

  const [open, setOpen] = useState<boolean>(false);
  const [subscriptionDeleteId, setSubscriptionDeleteId] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate days remaining or days overdue
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fetch subscriptions from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscription/subscription');
        console.log('Response:', response);
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        
        const data = await response.json();
        console.log('Subscriptions data:', data);
        
        // Extract subscriptions from the response
        if (data && data.subscriptions && Array.isArray(data.subscriptions)) {
          setSubscriptions(data.subscriptions);
        } else if (Array.isArray(data)) {
          setSubscriptions(data);
        } else {
          setSubscriptions([]);
        }
      } catch (err: any) {
        console.error('Error fetching subscriptions:', err);
        setError(err.message || 'Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
  };

  const handleView = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setViewDialogOpen(true);
  };

  const handleEdit = (subscriptionId: number) => {
    window.location.href = `/admin-panel/membership/subscription/edit/${subscriptionId}`;
  };

  const handleRenew = async (subscriptionId: number) => {
    try {
      const response = await fetch(`/api/subscription/subscription/${subscriptionId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payment_method: 'Manual Renewal',
          payment_reference: `Renewal-${Date.now()}`,
          payment_notes: 'Manually renewed by admin'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to renew subscription');
      }

      // Refresh the subscriptions list after renewal
      const renewedSubscription = await response.json();
      
      // Update the subscription in the list
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.subscription_id === subscriptionId ? renewedSubscription : sub
        )
      );
      
    } catch (err: any) {
      console.error('Error renewing subscription:', err);
      alert(`Error: ${err.message || 'Failed to renew subscription'}`);
    }
  };

  const handleCancel = async (subscriptionId: number) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        const response = await fetch(`/api/subscription/subscription/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cancellation_reason: 'Cancelled by admin'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to cancel subscription');
        }

        // Refresh the subscriptions list after cancellation
        const cancelledSubscription = await response.json();
        
        // Update the subscription in the list
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.subscription_id === subscriptionId ? cancelledSubscription : sub
          )
        );
        
      } catch (err: any) {
        console.error('Error cancelling subscription:', err);
        alert(`Error: ${err.message || 'Failed to cancel subscription'}`);
      }
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!subscriptionDeleteId) return;
    
    try {
      const response = await fetch(`/api/subscription/subscription/${subscriptionDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete subscription');
      }

      // Refresh the subscriptions list after deletion
      setSubscriptions(prev => prev.filter(sub => sub.subscription_id !== subscriptionDeleteId));
      setOpen(false);
    } catch (err: any) {
      console.error('Error deleting subscription:', err);
      alert(`Error: ${err.message || 'Failed to delete subscription'}`);
    }
  };

  const columns = useMemo<ColumnDef<Subscription>[]>(
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
        header: 'ID',
        accessorKey: 'subscription_id',
        cell: ({ getValue }) => (
          <Typography variant="body2">#{getValue() as number}</Typography>
        )
      },
      {
        header: 'Coach',
        accessorKey: 'coach_id',
        cell: ({ row }) => {
          const coach = row.original.coach;
          return (
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <Typography variant="body1">
                {coach ? coach.name : `Coach #${row.original.coach_id}`}
              </Typography>
            </Stack>
          );
        }
      },
      {
        header: 'Plan',
        accessorKey: 'plan_id',
        cell: ({ row }) => {
          const plan = row.original.plan;
          return (
            <Typography variant="body1">
              {plan ? plan.name : `Plan #${row.original.plan_id}`}
            </Typography>
          );
        }
      },
      {
        header: 'Period',
        accessorKey: 'end_date',
        cell: ({ row }) => {
          const startDate = formatDate(row.original.start_date);
          const endDate = formatDate(row.original.end_date);
          const daysRemaining = calculateDaysRemaining(row.original.end_date);
          
          return (
            <Stack>
              <Typography variant="body2">{startDate} - {endDate}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: daysRemaining > 0 ? 'success.main' : 'error.main' 
                }}
              >
                {daysRemaining > 0 
                  ? `${daysRemaining} days remaining` 
                  : `${Math.abs(daysRemaining)} days overdue`}
              </Typography>
            </Stack>
          );
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          let color: 'success' | 'warning' | 'error' | 'secondary' = 'secondary';
          
          switch(status) {
            case 'active':
              color = 'success';
              break;
            case 'expired':
              color = 'warning';
              break;
            case 'cancelled':
              color = 'error';
              break;
          }
          
          return (
            <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
              <Dot color={color} size={6} />
              <Typography sx={{ color: `${color}.main` }} variant="caption">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>
            </Stack>
          );
        }
      },
      {
        header: 'Payment',
        accessorKey: 'payment_status',
        cell: ({ getValue }) => {
          const paymentStatus = getValue() as string;
          let color: 'success' | 'warning' | 'error' = 'error';
          
          switch(paymentStatus) {
            case 'paid':
              color = 'success';
              break;
            case 'pending':
              color = 'warning';
              break;
          }
          
          return (
            <Chip 
              label={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)} 
              color={color}
              size="small"
              variant="light"
            />
          );
        }
      },
      {
        header: 'Actions',
        meta: {
          className: 'cell-center'
        },
        cell: ({ row }) => {
          const subscription = row.original;
          return (
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Tooltip title="View">
                <IconButton 
                  color="secondary" 
                  shape="rounded"
                  onClick={() => handleView(subscription)}
                >
                  <Eye />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton 
                  color="primary" 
                  shape="rounded"
                  onClick={() => handleEdit(subscription.subscription_id)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              {subscription.status === 'active' && (
                <Tooltip title="Cancel Subscription">
                  <IconButton
                    color="warning"
                    onClick={() => handleCancel(subscription.subscription_id)}
                    shape="rounded"
                  >
                    <CloseCircle />
                  </IconButton>
                </Tooltip>
              )}
              {subscription.status === 'expired' && (
                <Tooltip title="Renew Subscription">
                  <IconButton
                    color="success"
                    onClick={() => handleRenew(subscription.subscription_id)}
                    shape="rounded"
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setSubscriptionDeleteId(subscription.subscription_id);
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

  // Ensure subscriptions is always an array
  const safeData = Array.isArray(subscriptions) ? subscriptions : [];

  const breadcrumbLinks = [
    { title: 'home', to: APP_DEFAULT_PATH },
    { title: 'membership', to: '/admin-panel/membership/dashboard' },
    { title: 'subscriptions' }
  ];

  return (
    <>
      <Breadcrumbs custom heading="Subscription Management" links={breadcrumbLinks} />
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
            <Typography variant="h5">Are you sure you want to delete this subscription?</Typography>
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
      {selectedSubscription && (
        <SubscriptionViewDialog 
          open={viewDialogOpen} 
          handleClose={handleViewDialogClose} 
          subscription={selectedSubscription} 
        />
      )}
    </>
  );
}
