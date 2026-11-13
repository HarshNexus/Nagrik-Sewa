import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { ArrowLeft, CreditCard, QrCode, CheckCircle, XCircle, Clock, Shield, User, Wrench, CalendarDays } from 'lucide-react';

interface Summary {
  bookingId: string;
  bookingStatus: string;
  paymentStatus: string;
  service: string;
  category: string;
  schedule: { date: string; time: string; hours: number };
  worker?: { name: string; experience?: number; rating?: number };
  pricing: { serviceAmount: number; gst: number; platformFee: number; total: number };
  mode: 'test' | 'live';
}

type Outcome = { type: 'success' | 'pending' | 'failed' | 'cancelled'; message: string; paymentId?: string };

const loadCheckout = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Payment: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadError, setLoadError] = useState('');
  const [paying, setPaying] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [method, setMethod] = useState<'checkout' | 'qr'>('checkout');

  useEffect(() => {
    api.get(`/payments/summary/${bookingId}`)
      .then(({ data }) => setSummary(data.data))
      .catch(() => setLoadError('Booking not found.'));
  }, [bookingId]);

  const report = (orderId: string, status: 'failed' | 'cancelled', reason?: string) =>
    api.post('/payments/report', { orderId, status, reason }).catch(() => undefined);

  const verify = useCallback(async (response: any) => {
    try {
      const { data, status } = await api.post('/payments/verify', response, { validateStatus: (s) => s === 200 || s === 202 });
      if (status === 200 && data.data.status === 'paid') {
        setOutcome({ type: 'success', message: 'Payment successful. Your booking is confirmed.', paymentId: data.data.paymentId });
      } else {
        setOutcome({ type: 'pending', message: 'Payment received but not confirmed yet. We will update your booking automatically.' });
      }
    } catch (err: any) {
      setOutcome({ type: 'pending', message: err.response?.data?.message || 'Could not verify the payment. If money was deducted, it will be confirmed automatically.' });
    } finally {
      setPaying(false);
    }
  }, []);

  const pay = async () => {
    if (!summary) return;
    setPaying(true);
    setOutcome(null);

    if (!(await loadCheckout())) {
      setOutcome({ type: 'failed', message: 'Could not load the payment window. Check your connection and try again.' });
      setPaying(false);
      return;
    }

    let order: any;
    try {
      order = (await api.post('/payments/create-order', { bookingId })).data.data;
    } catch (err: any) {
      setOutcome({ type: 'failed', message: err.response?.data?.message || 'Could not start the payment.' });
      setPaying(false);
      return;
    }

    const checkout = new (window as any).Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Nagrik Sewa',
      description: `${summary.service} (${summary.bookingId})`,
      // Test mode only: open on UPI with Razorpay's documented test VPA, which always succeeds.
      // The payment is still confirmed through Razorpay by the backend; live mode is untouched.
      prefill: order.mode === 'test' && method === 'checkout' ? { ...order.prefill, method: 'upi', vpa: 'success@razorpay' } : order.prefill,
      theme: { color: '#16a34a' },
      // "Pay by QR": open Checkout with the UPI QR flow first; all other methods stay available.
      ...(method === 'qr' && {
        config: {
          display: {
            blocks: { qr: { name: 'Pay by UPI QR', instruments: [{ method: 'upi', flows: ['qr'] }] } },
            sequence: ['block.qr'],
            preferences: { show_default_blocks: true }
          }
        }
      }),
      handler: verify,
      modal: {
        ondismiss: () => {
          report(order.orderId, 'cancelled');
          setOutcome((prev) => prev ?? { type: 'cancelled', message: 'Payment cancelled. You can try again whenever you are ready.' });
          setPaying(false);
        }
      }
    });
    checkout.on('payment.failed', (res: any) => {
      report(order.orderId, 'failed', res.error?.description);
      setOutcome({ type: 'failed', message: res.error?.description || 'Payment failed. Please try again.' });
      setPaying(false);
    });
    checkout.open();
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6 space-y-4">
            <p className="text-gray-600">{loadError}</p>
            <Button onClick={() => navigate('/bookings')}>My bookings</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!summary) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading payment details...</div>;

  const alreadyPaid = summary.paymentStatus === 'paid' || outcome?.type === 'success';
  const { pricing } = summary;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        <Button variant="ghost" onClick={() => navigate('/bookings')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          My bookings
        </Button>
        <h1 className="text-3xl font-bold">Payment</h1>

        {summary.mode === 'test' && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>TEST MODE.</strong> This is a Razorpay test payment, so no real money is charged. Use UPI ID{' '}
            <code>success@razorpay</code>, or an Indian test card such as Visa 4100 2800 0000 1007 or Mastercard
            5555 5100 0008 1006 (any future expiry, any CVV). Other card numbers may be rejected as international.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking {summary.bookingId}</span>
              <Badge variant="secondary">{summary.category}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />
              <span>{summary.worker?.name || 'Worker'}{summary.worker?.experience ? ` · ${summary.worker.experience} yrs experience` : ''}</span>
            </div>
            <div className="flex items-center gap-2"><Wrench className="h-4 w-4 text-gray-400" /><span>{summary.service}</span></div>
            <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-gray-400" />
              <span>{new Date(summary.schedule.date).toLocaleDateString()} at {summary.schedule.time} · {summary.schedule.hours} hr</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Amount</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Service amount</span><span>₹{pricing.serviceAmount}</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span>₹{pricing.gst}</span></div>
            <div className="flex justify-between"><span>Convenience fee (5%, min ₹5)</span><span>₹{pricing.platformFee}</span></div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold"><span>Total payable</span><span>₹{pricing.total}</span></div>
          </CardContent>
        </Card>

        {!alreadyPaid && (
          <Card>
            <CardHeader><CardTitle>Payment method</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {([
                { id: 'checkout', icon: CreditCard, title: 'UPI, cards, net banking, wallets', note: 'Pay through Razorpay Checkout' },
                { id: 'qr', icon: QrCode, title: 'Pay by QR code', note: 'Scan the UPI QR with any UPI app' }
              ] as const).map(({ id, icon: Icon, title, note }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left ${method === id ? 'border-2 border-green-600 bg-green-50' : 'bg-white hover:border-green-400'}`}
                >
                  <Icon className="h-5 w-5 mt-0.5 text-green-700" />
                  <div className="flex-1">
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-gray-600">{note}</p>
                  </div>
                  {method === id && <Badge className="bg-green-600">Selected</Badge>}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {outcome && (
          <div className={`rounded-lg border p-4 flex items-start gap-3 text-sm ${
            outcome.type === 'success' ? 'border-green-300 bg-green-50 text-green-900'
              : outcome.type === 'pending' ? 'border-blue-300 bg-blue-50 text-blue-900'
              : 'border-red-300 bg-red-50 text-red-900'}`}>
            {outcome.type === 'success' ? <CheckCircle className="h-5 w-5 mt-0.5" />
              : outcome.type === 'pending' ? <Clock className="h-5 w-5 mt-0.5" />
              : <XCircle className="h-5 w-5 mt-0.5" />}
            <div className="space-y-2">
              <p>{outcome.message}</p>
              {outcome.paymentId && (
                <Link className="underline font-medium" to={`/payments/${outcome.paymentId}/receipt`}>View receipt</Link>
              )}
            </div>
          </div>
        )}

        {alreadyPaid ? (
          <Button asChild className="w-full"><Link to="/payments">View payment history</Link></Button>
        ) : (
          <Button onClick={pay} disabled={paying || outcome?.type === 'pending'} className="w-full" size="lg">
            {paying ? 'Processing...' : outcome ? `Try again · Pay ₹${pricing.total}` : `${method === 'qr' ? 'Show QR code' : 'Pay'} · ₹${pricing.total}`}
          </Button>
        )}

        <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="h-4 w-4 text-green-600" /> Payments are processed securely by Razorpay. We never see your card or UPI details.
        </p>
      </div>
    </div>
  );
};

export default Payment;
