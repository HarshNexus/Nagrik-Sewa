import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export const statusStyle: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-700'
};

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/payments/my', { params: { page } })
      .then(({ data }) => {
        setPayments(data.data.payments);
        setTotalPages(data.data.pagination.totalPages || 1);
      })
      .catch(() => setError('Could not load your payments.'))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold">Payment History</h1>
        {error && <p className="text-red-600">{error}</p>}
        {loading && <p className="text-gray-600">Loading...</p>}
        {!loading && !error && payments.length === 0 && <p className="text-gray-600">No payments yet.</p>}

        {payments.map((p) => (
          <Card key={p._id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>{p.bookingId?.serviceDetails?.serviceName || 'Service'} · {p.bookingId?.bookingId}</span>
                <span>₹{p.amount}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
              <div className="space-y-1">
                <div>{new Date(p.paidAt || p.createdAt).toLocaleString()}{p.method ? ` · ${p.method.toUpperCase()}` : ''}</div>
                <div className="text-xs">Payment ID: {p.razorpayPaymentId || '—'}</div>
                {p.failureReason && <div className="text-xs text-red-600">{p.failureReason}</div>}
              </div>
              <div className="flex items-center gap-2">
                {p.mode === 'test' && <Badge variant="outline" className="border-amber-400 text-amber-700">TEST</Badge>}
                <Badge className={statusStyle[p.status]}>{p.status}</Badge>
                {p.status === 'paid' ? (
                  <Button size="sm" variant="outline" asChild><Link to={`/payments/${p._id}/receipt`}>Receipt</Link></Button>
                ) : (
                  <Button size="sm" asChild><Link to={`/payment/${p.bookingId?._id}`}>Pay now</Link></Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="text-sm self-center">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
