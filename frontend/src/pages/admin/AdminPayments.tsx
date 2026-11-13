import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { statusStyle } from '@/pages/PaymentHistory';

const STATUSES = ['all', 'paid', 'pending', 'failed', 'cancelled'];

const AdminPayments: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/payments/admin/overview', { params: { page, status: status === 'all' ? undefined : status } })
      .then(({ data }) => setData(data.data))
      .catch(() => setError('Could not load payments.'));
  }, [page, status]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-600">Loading payments...</p>;

  const { summary, transactions, pagination } = data;
  const tiles = [
    ['Total collected', `₹${summary.totalCollected}`],
    ['Platform commission', `₹${summary.platformCommission}`],
    ['Successful payments', summary.successfulPayments],
    ['Failed / cancelled', summary.failedPayments],
    ['Pending', summary.pendingPayments]
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tiles.map(([label, value]) => (
          <Card key={label as string}>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            Transactions
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <Button key={s} size="sm" variant={status === s ? 'default' : 'outline'} onClick={() => { setStatus(s); setPage(1); }}>
                  {s}
                </Button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-gray-500">No transactions</TableCell></TableRow>
              )}
              {transactions.map((t: any) => (
                <TableRow key={t._id}>
                  <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{t.bookingId?.bookingId}</TableCell>
                  <TableCell>{t.customerId ? `${t.customerId.firstName} ${t.customerId.lastName || ''}` : '—'}</TableCell>
                  <TableCell>{t.method?.toUpperCase() || '—'}</TableCell>
                  <TableCell className="text-xs">{t.razorpayPaymentId || '—'}</TableCell>
                  <TableCell className="text-right">₹{t.amount}</TableCell>
                  <TableCell className="space-x-1">
                    <Badge className={statusStyle[t.status]}>{t.status}</Badge>
                    {t.mode === 'test' && <Badge variant="outline" className="border-amber-400 text-amber-700">TEST</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm self-center">Page {page} of {pagination.totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
