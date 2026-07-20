import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const WorkerProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    description: '', experience: '', skill: '', category: '', hourlyRate: '', city: '', state: '', language: 'Hindi'
  });

  useEffect(() => {
    api.get('/workers/me/profile').then(({ data }) => {
      const profile = data.data?.workerProfile;
      if (!profile) return;
      const skill = profile.skills?.[0] || {};
      const area = profile.serviceAreas?.[0] || {};
      setForm({
        description: profile.description || '', experience: String(profile.experience ?? ''),
        skill: skill.name || '', category: skill.category || profile.serviceCategories?.[0] || '',
        hourlyRate: String(skill.hourlyRate ?? ''), city: area.city || '', state: area.state || '',
        language: profile.languages?.[0] || 'Hindi'
      });
    }).catch(() => toast({ title: 'Unable to load profile', description: 'Please complete your details below.', variant: 'destructive' }));
  }, []);

  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.put('/workers/me/profile', {
        description: form.description,
        experience: Number(form.experience),
        skills: [{ name: form.skill, category: form.category, level: 'intermediate', yearsOfExperience: Number(form.experience), hourlyRate: Number(form.hourlyRate) || 0 }],
        serviceCategories: [form.category],
        serviceAreas: [{ city: form.city, state: form.state, radius: 10 }],
        languages: [form.language],
        searchTags: [form.skill, form.category, form.city]
      });
      toast({ title: 'Work profile saved', description: 'Customers can now find and view your profile.' });
      navigate('/dashboard');
    } catch (error: any) {
      toast({ title: 'Could not save profile', description: error.response?.data?.message || 'Please check the required fields.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return <div className="container mx-auto max-w-2xl px-4 py-8">
    <Card>
      <CardHeader><CardTitle>Complete your work profile</CardTitle><CardDescription>Add the details customers need to choose and book you.</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="description">About your work</Label><Textarea id="description" value={form.description} onChange={e => update('description', e.target.value)} required placeholder="Describe the services you provide" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="skill">Primary skill</Label><Input id="skill" value={form.skill} onChange={e => update('skill', e.target.value)} required placeholder="e.g. Plumber" /></div>
            <div className="space-y-2"><Label htmlFor="category">Service category</Label><Input id="category" value={form.category} onChange={e => update('category', e.target.value)} required placeholder="e.g. Plumbing" /></div>
            <div className="space-y-2"><Label htmlFor="experience">Experience (years)</Label><Input id="experience" type="number" min="0" value={form.experience} onChange={e => update('experience', e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="rate">Hourly rate (₹)</Label><Input id="rate" type="number" min="0" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="city">City / district</Label><Input id="city" value={form.city} onChange={e => update('city', e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={form.state} onChange={e => update('state', e.target.value)} required /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="language">Language</Label><Input id="language" value={form.language} onChange={e => update('language', e.target.value)} required /></div>
          <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving profile...' : 'Save work profile'}</Button>
        </form>
      </CardContent>
    </Card>
  </div>;
};

export default WorkerProfileSetup;
