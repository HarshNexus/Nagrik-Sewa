import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm"><span className="text-gray-500">{label}</span><span className="text-right break-all">{value}</span></div>
);

const PaymentReceipt: React.FC = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/payments/${id}/receipt`)
      .then(({ data }) => setReceipt(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Receipt not found.'));
  }, [id]);

  if (error) return <div className="min-h-screen flex items-center justify-center text-gray-600">{error}</div>;
  if (!receipt) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading receipt...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-xl space-y-4">
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-700">Nagrik Sewa</h1>
            <p className="text-gray-500 text-sm">Payment Receipt</p>
            {receipt.mode === 'test' && (
              <p className="mt-2 inline-block rounded border border-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-700">
                TEST TRANSACTION · no real money was charged
              </p>
            )}
          </div>
          <Separator />
          <Row label="Receipt no." value={receipt.receiptNumber} />
          <Row label="Date" value={new Date(receipt.paidAt).toLocaleString()} />
          <Row label="Customer" value={receipt.customer.name} />
          <Row label="Booking ID" value={receipt.bookingId} />
          <Row label="Service" value={receipt.service} />
          <Row label="Worker" value={receipt.worker} />
          <Separator />
          <Row label="Order ID" value={receipt.razorpayOrderId} />
          <Row label="Payment ID" value={receipt.razorpayPaymentId} />
          <Row label="Payment method" value={receipt.method?.toUpperCase()} />
          <Separator />
          <Row label="Service amount" value={`₹${receipt.serviceAmount}`} />
          <Row label="GST (18%)" value={`₹${receipt.gst}`} />
          <Row label="Convenience fee" value={`₹${receipt.platformFee}`} />
          <div className="flex justify-between font-semibold text-lg"><span>Total paid</span><span>₹{receipt.total}</span></div>
        </div>
        <Button className="w-full print:hidden" onClick={() => window.print()}>Print / Save as PDF</Button>
      </div>
    </div>
  );
};

export default PaymentReceipt;
