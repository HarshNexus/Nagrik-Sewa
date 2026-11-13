import 'dotenv/config';
import mongoose from 'mongoose';
import { database } from '../config/database';
import { WorkerProfile } from '../models/WorkerProfile';

const PASSWORD = 'Worker@123';

// [firstName, lastName, profession, category, dailyWage, experienceYears, pincode]
// category matches the primarySkill options on the Register page so category search works.
const workers: Array<[string, string, string, string, number, number, string]> = [
  ['Bablu', 'Kumar', 'Labour', 'Construction Worker', 600, 5, '160055'],
  ['Shintu', 'Ram', 'Carpenter', 'Carpenter', 800, 9, '160062'],
  ['Mannu', 'Singh', 'Electrician', 'Electrician', 700, 6, '160059'],
  ['Raju', 'Kumar', 'Plumber', 'Plumber', 750, 8, '160071'],
  ['Sonu', 'Sharma', 'Painter', 'Painter', 650, 4, '160055'],
  ['Pappu', 'Yadav', 'Labour', 'Construction Worker', 550, 3, '160062'],
  ['Bunty', 'Kumar', 'Mason (Raj Mistri)', 'Construction Worker', 900, 12, '160059'],
  ['Guddu', 'Singh', 'AC Technician', 'AC Technician', 850, 7, '160071'],
  ['Monu', 'Kumar', 'Carpenter', 'Carpenter', 750, 5, '160055'],
  ['Deepak', 'Kumar', 'Electrician', 'Electrician', 800, 10, '160062'],
  ['Kallu', 'Ram', 'Gardener', 'Gardener', 500, 6, '160059'],
  ['Vicky', 'Sharma', 'House Cleaner', 'House Cleaner', 450, 2, '160071'],
];

const run = async () => {
  await database.connect();

  for (const [i, [firstName, lastName, profession, category, wage, experience, pincode]] of workers.entries()) {
    const email = `${firstName}.${lastName}.mohali@nagriksewa.demo`.toLowerCase();
    if (await WorkerProfile.exists({ email })) {
      console.log(`skip (exists): ${email}`);
      continue;
    }

    // Slightly varied ratings so the list doesn't look uniform.
    const average = Number((4 + ((i * 7) % 10) / 10).toFixed(1));
    const totalReviews = 8 + ((i * 13) % 40);
    const completedBookings = totalReviews + 5 + ((i * 5) % 15);

    await new WorkerProfile({
      firstName,
      lastName,
      email,
      phone: `90000000${String(i + 1).padStart(2, '0')}`,
      password: PASSWORD,
      description: `${profession} based in Mohali with ${experience} years of experience. Reliable, punctual and fair rates.`,
      experience,
      skills: [{
        name: profession,
        category,
        level: experience >= 8 ? 'expert' : experience >= 4 ? 'intermediate' : 'beginner',
        yearsOfExperience: experience,
        hourlyRate: Math.round(wage / 8),
        fixedRate: wage,
      }],
      serviceCategories: [category],
      serviceAreas: [{ city: 'Mohali', state: 'Punjab', pincode, radius: 15 }],
      searchTags: [profession, category, 'Mohali'],
      languages: ['Hindi', 'Punjabi'],
      isEmailVerified: true,
      isActive: true,
      isApproved: true,
      verification: {
        status: 'verified',
        verifiedAt: new Date(),
        backgroundCheck: { status: 'cleared', completedAt: new Date() },
        referencesChecked: true,
        manualReviewCompleted: true,
      },
      rating: { average, totalReviews },
      stats: { totalBookings: completedBookings, completedBookings, jobCompletionRate: 95 },
      earnings: { completedJobs: completedBookings },
    }).save();
    console.log(`added: ${firstName} ${lastName} (${profession}, ₹${wage}/day)`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
