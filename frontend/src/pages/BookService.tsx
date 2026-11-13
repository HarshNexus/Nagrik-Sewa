import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import AddressAutocomplete, { Place } from '@/components/AddressAutocomplete';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  ArrowLeft,
  Shield,
  CheckCircle,
  Briefcase,
  Check
} from 'lucide-react';

interface WorkerCardData {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  reviews: number;
  experience: number;
  completedJobs: number;
  price: number;
  verified: boolean;
  skillName: string;
  area: string;
}

interface Quote {
  basePrice: number;
  hourlyRate: number;
  hours: number;
  emergencyCharges: number;
  gst: number;
  platformFee: number;
  totalAmount: number;
}

const toWorker = (profile: any): WorkerCardData => {
  const account = profile.userId?.firstName ? profile.userId : profile;
  const skill = profile.skills?.[0] || {};
  const area = profile.serviceAreas?.[0];
  return {
    id: profile._id,
    firstName: account.firstName || 'Worker',
    lastName: account.lastName || '',
    avatar: account.avatar,
    rating: profile.rating?.average || 0,
    reviews: profile.rating?.totalReviews || 0,
    experience: profile.experience || 0,
    completedJobs: profile.stats?.completedBookings || 0,
    price: skill.hourlyRate || 0,
    verified: profile.verification?.status === 'verified',
    skillName: skill.name || skill.category || profile.serviceCategories?.[0] || 'Service',
    area: area ? [area.city, area.state].filter(Boolean).join(', ') : ''
  };
};

const initialForm = {
  description: '',
  requirements: '',
  contactPerson: '',
  contactPhone: '',
  date: '',
  time: '',
  hours: 0,
  emergencyService: false,
  addressMode: 'new' as 'saved' | 'new',
  address: { street: '', area: '', city: '', state: '', pincode: '', lat: null as number | null, lon: null as number | null }
};

const DRAFT_KEY = 'bookingDraft';
const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];
const STEPS = ['Schedule & Address', 'Confirm & Pay'];

const localDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const slotMinutes = (label: string) => {
  const [clock, meridiem] = label.split(' ');
  let [h, m] = clock.split(':').map(Number);
  if (meridiem === 'PM' && h < 12) h += 12;
  if (meridiem === 'AM' && h === 12) h = 0;
  return h * 60 + m;
};

const formatMinutes = (total: number) => {
  const mins = total % 1440;
  const h = Math.floor(mins / 60);
  const label = `${h % 12 || 12}:${String(mins % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  return total >= 1440 ? `${label} (next day)` : label;
};

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length > 10 && digits.startsWith('91') ? digits.slice(2) : digits;
};

const loadDraft = () => {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
    if (!draft) return { form: initialForm, step: 1 };
    // A saved date that has since passed would fail validation.
    return {
      form: { ...initialForm, ...draft.form, date: draft.form.date >= localDate(new Date()) ? draft.form.date : '' },
      step: 1 // always open on Schedule & Address; entered details are kept
    };
  } catch {
    return { form: initialForm, step: 1 };
  }
};

const WorkerCard: React.FC<{ worker: WorkerCardData }> = ({ worker }) => (
  <div className="rounded-lg border border-green-600 bg-green-50 p-4">
    <div className="flex gap-4">
      <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
        <AvatarImage src={worker.avatar} />
        <AvatarFallback className="text-lg">{worker.firstName[0]}{worker.lastName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-lg">{worker.firstName} {worker.lastName}</h3>
          {worker.verified && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">{worker.skillName}{worker.area && ` · ${worker.area}`}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{worker.rating || 'New'} ({worker.reviews} reviews)</span>
          <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-gray-400" />{worker.experience} yrs</span>
          <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-gray-400" />{worker.completedJobs} jobs completed</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-green-700">₹{worker.price}</p>
        <p className="text-xs text-gray-500">per hour</p>
      </div>
    </div>
    <Button variant="outline" size="sm" className="mt-3" asChild>
      <Link to={`/workers/${worker.id}`}>View Profile</Link>
    </Button>
  </div>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

const BookService: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');
  const serviceId = serviceParam && /^[0-9a-f]{24}$/i.test(serviceParam) ? serviceParam : undefined;
  const workerId = searchParams.get('worker');

  const [worker, setWorker] = useState<WorkerCardData | null>(null);
  const [workerLoading, setWorkerLoading] = useState(true);
  const [workerError, setWorkerError] = useState('');

  const [draft] = useState(loadDraft);
  const [form, setForm] = useState(draft.form);
  const [step, setStep] = useState(draft.step as number);
  const [showErrors, setShowErrors] = useState(false);
  const [booked, setBooked] = useState<{ start: number; end: number }[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const setField = (field: string, value: any) => setForm((prev: typeof initialForm) => ({ ...prev, [field]: value }));
  const setAddress = (patch: Partial<typeof initialForm.address>) =>
    setForm((prev: typeof initialForm) => ({ ...prev, address: { ...prev.address, ...patch } }));

  // Keep entered details across steps, page refreshes and the trip to the payment page.
  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form }));
  }, [form]);

  // The login response has no address, so fetch the full profile once.
  useEffect(() => {
    refreshUser();
  }, []);

  // Only a real address (with a street) counts as saved; registration stores a placeholder city only.
  const saved = user?.address?.street ? user.address : null;
  const savedAsForm = saved && {
    street: saved.street || '',
    area: '',
    city: saved.city || '',
    state: saved.state || '',
    pincode: saved.pincode || '',
    lat: saved.coordinates?.latitude ?? null,
    lon: saved.coordinates?.longitude ?? null
  };

  // Pre-fill contact details, and default to the saved address when there is one and nothing was entered yet.
  useEffect(() => {
    if (!user) return;
    setForm((prev: typeof initialForm) => ({
      ...prev,
      contactPerson: prev.contactPerson || `${user.firstName} ${user.lastName || ''}`.trim(),
      contactPhone: prev.contactPhone || normalizePhone(user.phone || ''),
      ...(savedAsForm && !prev.address.street ? { addressMode: 'saved' as const, address: savedAsForm } : {})
    }));
  }, [user]);

  // Load only the worker selected by the customer; do not use a sample profile.
  useEffect(() => {
    if (!workerId) {
      setWorkerError('Please select a worker before booking.');
      setWorkerLoading(false);
      return;
    }
    api.get(`/workers/${workerId}`).then(({ data }) => {
      const profile = data.data?.worker;
      if (!profile) throw new Error('Worker profile not found');
      setWorker(toWorker(profile));
    }).catch(() => setWorkerError('The selected worker profile is no longer available.'))
      .finally(() => setWorkerLoading(false));
  }, [workerId]);

  // Slots already taken by this worker's confirmed bookings on the chosen date.
  useEffect(() => {
    if (!worker || !form.date) {
      setBooked([]);
      return;
    }
    const from = new Date(`${form.date}T00:00:00`);
    const to = new Date(from.getTime() + 24 * 60 * 60 * 1000);
    api.get(`/bookings/worker/${worker.id}/booked-slots`, { params: { from: from.toISOString(), to: to.toISOString() } })
      .then(({ data }) => setBooked(data.data.map((b: any) => {
        const start = new Date(b.start);
        const startMin = start.getHours() * 60 + start.getMinutes();
        return { start: startMin, end: startMin + b.durationMinutes };
      })))
      .catch(() => setBooked([]));
  }, [worker?.id, form.date]);

  // Server-calculated price preview; the booking itself is priced by the same backend code.
  useEffect(() => {
    if (!worker || form.hours < 1) {
      setQuote(null);
      return;
    }
    setQuoteError('');
    api.post('/bookings/quote', { workerId: worker.id, hours: form.hours, emergency: form.emergencyService })
      .then(({ data }) => setQuote(data.data))
      .catch((e) => {
        setQuote(null);
        setQuoteError(e.response?.data?.message || 'Could not reach the server. Make sure the backend is running the latest code.');
      });
  }, [worker?.id, form.hours, form.emergencyService]);

  const now = new Date();
  const isToday = form.date === localDate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const slotUnavailable = (label: string) => {
    const start = slotMinutes(label);
    const end = start + Math.max(form.hours, 1) * 60;
    return (isToday && start <= nowMinutes) || booked.some((b) => start < b.end && end > b.start);
  };
  const endTime = form.time && form.hours >= 1 ? formatMinutes(slotMinutes(form.time) + form.hours * 60) : '';

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const phone = normalizePhone(form.contactPhone);
  const errors: Record<string, string> = {};
  if (form.description.trim().length < 10) errors.description = 'Please describe the work in at least 10 characters.';
  if (form.contactPerson.trim().length < 2) errors.contactPerson = 'Enter the contact person name.';
  if (!/^[6-9]\d{9}$/.test(phone)) errors.contactPhone = 'Enter a valid 10-digit mobile number.';
  if (!form.date) errors.date = 'Select a date.';
  if (!form.time) errors.time = 'Select a time slot.';
  else if (slotUnavailable(form.time)) errors.time = 'This slot is not available for the selected duration. Pick another.';
  if (form.hours < 1) errors.hours = 'Select how many hours of work you need.';
  if (form.address.street.trim().length < 5) errors.street = 'Enter your house/flat number and street (at least 5 characters).';
  if (!form.address.city.trim()) errors.city = 'Enter your city.';
  if (!form.address.state.trim()) errors.state = 'Enter your state.';
  if (!/^[1-9][0-9]{5}$/.test(form.address.pincode)) errors.pincode = 'Enter a valid 6-digit pincode.';

  const goNext = () => {
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const err = (field: string) => (showErrors ? errors[field] : undefined);
  const inputClass = (field: string) => (err(field) ? 'border-red-500' : '');

  const useSavedAddress = () => savedAsForm && setForm((prev: typeof initialForm) => ({ ...prev, addressMode: 'saved', address: savedAsForm }));
  const useNewAddress = () => setForm((prev: typeof initialForm) => ({ ...prev, addressMode: 'new', address: initialForm.address }));
  const applyPlace = (place: Place) =>
    setAddress({ street: place.street || form.address.street, area: place.area, city: place.city, state: place.state, pincode: place.pincode, lat: place.lat, lon: place.lon });

  // Creates the booking on the server, then hands over to the payment page.
  const handleBooking = async () => {
    setSubmitting(true);
    setBookingError('');
    try {
      const startMinutes = slotMinutes(form.time);
      const requestedTime = `${String(Math.floor(startMinutes / 60)).padStart(2, '0')}:${String(startMinutes % 60).padStart(2, '0')}`;
      const { address } = form;

      const { data } = await api.post('/bookings', {
        workerId: worker!.id,
        serviceId,
        hours: form.hours,
        bookingType: form.emergencyService ? 'emergency' : 'scheduled',
        schedule: {
          requestedDate: new Date(`${form.date}T${requestedTime}`).toISOString(),
          requestedTime,
          estimatedDuration: form.hours * 60
        },
        location: {
          address: {
            street: [address.street, address.area].filter(Boolean).join(', '),
            city: address.city,
            state: address.state,
            pincode: address.pincode
          },
          coordinates: address.lat !== null && address.lon !== null ? { latitude: address.lat, longitude: address.lon } : undefined
        },
        serviceDetails: {
          description: form.description,
          customRequirements: form.requirements.trim() || undefined
        },
        emergency: form.emergencyService
          ? { urgencyLevel: 'high', description: form.description, contactNumber: phone }
          : undefined
      });
      sessionStorage.removeItem(DRAFT_KEY);
      navigate(`/payment/${data.data.booking.id}`);
    } catch (e: any) {
      const apiError = e.response?.data;
      setBookingError(apiError?.errors?.[0]?.message || apiError?.message || 'Could not create the booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (workerLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading selected worker...</div>;
  }

  if (workerError || !worker) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader><CardTitle>Worker unavailable</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">{workerError}</p>
            <Button onClick={() => navigate('/workers')}>Find workers</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { address } = form;
  const usingSaved = !!saved && form.addressMode === 'saved';

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => (step > 1 ? setStep(1) : navigate(-1))} className="mb-2 -ml-3">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Book Service</h1>
          <p className="text-gray-600 mt-1">Pick a time and place, then pay to confirm</p>
        </div>

        <ol className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            return (
              <li key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= n ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {step > n ? <Check className="h-4 w-4" /> : n}
                </div>
                <span className={`ml-2 text-sm ${step >= n ? 'text-green-700 font-medium' : 'text-gray-600'}`}>{label}</span>
                {n < STEPS.length && <div className="w-6 sm:w-12 h-px bg-gray-300 mx-2 sm:mx-4" />}
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <WorkerCard worker={worker} />

            {step === 1 && (
              <>
                <Card>
                  <CardHeader><CardTitle>Schedule service</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Date *</label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {next7Days.map((d) => {
                          const value = localDate(d);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setField('date', value)}
                              className={`shrink-0 rounded-lg border px-3 py-2 text-center text-sm ${form.date === value ? 'border-green-600 bg-green-600 text-white' : 'bg-white hover:border-green-400'}`}
                            >
                              <div className="text-xs opacity-80">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                              <div className="font-semibold">{d.getDate()} {d.toLocaleDateString(undefined, { month: 'short' })}</div>
                            </button>
                          );
                        })}
                      </div>
                      <Input className={`mt-2 sm:max-w-xs ${inputClass('date')}`} type="date" value={form.date} min={localDate(now)} onChange={(e) => setField('date', e.target.value)} />
                      <FieldError message={err('date')} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">How many hours of work? *</label>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                          <Button key={h} type="button" size="sm" variant={form.hours === h ? 'default' : 'outline'} className={form.hours === h ? 'bg-green-600 hover:bg-green-700' : ''} onClick={() => setField('hours', h)}>
                            {h} hr
                          </Button>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">A worker can be booked for up to 8 hours a day.</p>
                      <FieldError message={err('hours')} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Start time *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const disabled = !form.date || slotUnavailable(slot);
                          return (
                            <Button
                              key={slot}
                              type="button"
                              size="sm"
                              disabled={disabled}
                              variant={form.time === slot ? 'default' : 'outline'}
                              className={`${form.time === slot ? 'bg-green-600 hover:bg-green-700' : ''} ${disabled ? 'line-through' : ''}`}
                              onClick={() => setField('time', slot)}
                            >
                              {slot}
                            </Button>
                          );
                        })}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {form.date ? 'Struck-through slots are in the past or already booked.' : 'Select a date to see available slots.'}
                      </p>
                      {endTime && <p className="mt-2 text-sm text-green-700 font-medium">Service ends at {endTime}</p>}
                      <FieldError message={err('time')} />
                    </div>

                    <label className="flex items-start gap-2 rounded-md border p-3 text-sm cursor-pointer">
                      <input type="checkbox" className="mt-1" checked={form.emergencyService} onChange={(e) => setField('emergencyService', e.target.checked)} />
                      <span>
                        <span className="font-medium">Emergency service</span>
                        <span className="block text-gray-600">
                          Adds a 50% surcharge on the service amount{quote && quote.emergencyCharges > 0 ? ` (+₹${quote.emergencyCharges} for this booking)` : ''}.
                        </span>
                      </span>
                    </label>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Service address</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {saved && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" onClick={useSavedAddress} className={`rounded-lg border p-3 text-left text-sm ${usingSaved ? 'border-green-600 bg-green-50 ring-2 ring-green-600' : 'bg-white hover:border-green-400'}`}>
                          <p className="font-medium">My saved address</p>
                          <p className="text-gray-600">{[saved.street, saved.city, saved.state, saved.pincode].filter(Boolean).join(', ')}</p>
                        </button>
                        <button type="button" onClick={useNewAddress} className={`rounded-lg border p-3 text-left text-sm ${!usingSaved ? 'border-green-600 bg-green-50 ring-2 ring-green-600' : 'bg-white hover:border-green-400'}`}>
                          <p className="font-medium">Use a different address</p>
                          <p className="text-gray-600">For example, when booking for someone else</p>
                        </button>
                      </div>
                    )}

                    {!usingSaved && (
                      <>
                        <AddressAutocomplete onSelect={applyPlace} />
                        <div>
                          <label className="block text-sm font-medium mb-2">House / flat no. and street *</label>
                          <Input className={inputClass('street')} placeholder="Flat/House number, Building name, Street" value={address.street} onChange={(e) => setAddress({ street: e.target.value })} />
                          <FieldError message={err('street')} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Area / locality</label>
                          <Input placeholder="Area, Sector, Locality" value={address.area} onChange={(e) => setAddress({ area: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">City *</label>
                            <Input className={inputClass('city')} value={address.city} onChange={(e) => setAddress({ city: e.target.value })} />
                            <FieldError message={err('city')} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">State *</label>
                            <Input className={inputClass('state')} value={address.state} onChange={(e) => setAddress({ state: e.target.value })} />
                            <FieldError message={err('state')} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Pincode *</label>
                            <Input className={inputClass('pincode')} inputMode="numeric" maxLength={6} value={address.pincode} onChange={(e) => setAddress({ pincode: e.target.value.replace(/\D/g, '') })} />
                            <FieldError message={err('pincode')} />
                          </div>
                        </div>
                      </>
                    )}

                    {address.lat !== null && address.lon !== null && (
                      <div className="space-y-1">
                        <iframe
                          title="Selected location"
                          className="w-full h-48 rounded-md border"
                          loading="lazy"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${address.lon - 0.005},${address.lat - 0.003},${address.lon + 0.005},${address.lat + 0.003}&layer=mapnik&marker=${address.lat},${address.lon}`}
                        />
                        <a className="text-xs text-green-700 underline" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?mlat=${address.lat}&mlon=${address.lon}#map=17/${address.lat}/${address.lon}`}>
                          Open larger map
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Work details & contact</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">What do you need done? *</label>
                      <Textarea
                        className={inputClass('description')}
                        placeholder={`e.g. ${worker.skillName}: what needs to be done, where in the house, and any problem you have noticed`}
                        value={form.description}
                        onChange={(e) => setField('description', e.target.value)}
                        rows={4}
                        maxLength={1000}
                      />
                      <FieldError message={err('description')} />
                    </div>
                    <details className="rounded-md border bg-gray-50 p-3">
                      <summary className="cursor-pointer text-sm font-medium">Special requirements (optional)</summary>
                      <Textarea
                        className="mt-3 bg-white"
                        placeholder="Tools or materials needed, access instructions, parking, pets at home..."
                        value={form.requirements}
                        onChange={(e) => setField('requirements', e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                    </details>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact person at the address *</label>
                        <Input className={inputClass('contactPerson')} value={form.contactPerson} onChange={(e) => setField('contactPerson', e.target.value)} placeholder="Name" />
                        <FieldError message={err('contactPerson')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Mobile number *</label>
                        <Input className={inputClass('contactPhone')} inputMode="tel" value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} placeholder="98765 43210" />
                        <FieldError message={err('contactPhone')} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Filled from your account. Change it if the worker should contact someone else.</p>
                  </CardContent>
                </Card>

                <Button onClick={goNext} className="w-full" size="lg">Continue to Confirm</Button>
              </>
            )}

            {step === 2 && (
              <>
                <Card>
                  <CardHeader><CardTitle>Review your booking</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500">When</p><p className="font-medium">{new Date(`${form.date}T00:00`).toLocaleDateString()} · {form.time} to {endTime} ({form.hours} hr)</p></div>
                    <div><p className="text-gray-500">Where</p><p className="font-medium">{[address.street, address.area, address.city, address.state, address.pincode].filter(Boolean).join(', ')}</p></div>
                    <div><p className="text-gray-500">Contact</p><p className="font-medium">{form.contactPerson} · {phone}</p></div>
                    <div><p className="text-gray-500">Work description</p><p className="font-medium break-words">{form.description}</p></div>
                  </CardContent>
                </Card>
                {bookingError && <p className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{bookingError}</p>}
                <p className="text-sm text-gray-600">
                  Next you will pay with Razorpay. Your booking is confirmed only after the payment is verified.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Edit details</Button>
                  <Button onClick={handleBooking} disabled={submitting || !quote} className="flex-1" size="lg">
                    {submitting ? 'Creating booking...' : 'Confirm Booking & Proceed to Payment'}
                  </Button>
                </div>
              </>
            )}
          </div>

          <aside>
            <Card className="lg:sticky lg:top-24">
              <CardHeader><CardTitle>Booking summary</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">{worker.skillName}</p>
                  <p className="text-gray-600">{worker.firstName} {worker.lastName}</p>
                </div>
                {(form.date || form.time) && (
                  <>
                    <Separator />
                    {form.date && <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" />{new Date(`${form.date}T00:00`).toLocaleDateString()}</div>}
                    {form.time && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" />{form.time}{endTime && ` – ${endTime}`}</div>}
                  </>
                )}
                {address.city && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gray-400 mt-0.5" />{[address.area, address.city].filter(Boolean).join(', ')}</div>}

                <Separator />
                {quote ? (
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Service ({quote.hours} hr × ₹{quote.hourlyRate})</span><span>₹{quote.basePrice}</span></div>
                    {quote.emergencyCharges > 0 && <div className="flex justify-between"><span>Emergency surcharge (50%)</span><span>₹{quote.emergencyCharges}</span></div>}
                    <div className="flex justify-between"><span>GST (18%)</span><span>₹{quote.gst}</span></div>
                    <div className="flex justify-between"><span>Convenience fee (5%, min ₹5)</span><span>₹{quote.platformFee}</span></div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold"><span>Total</span><span>₹{quote.totalAmount}</span></div>
                  </div>
                ) : (
                  <p className={quoteError ? 'text-red-600' : 'text-gray-500'}>
                    {quoteError ? `Could not calculate the price: ${quoteError}` : 'Select the number of hours to see the price.'}
                  </p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookService;
