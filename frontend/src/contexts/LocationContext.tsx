import React, { createContext, useContext, useState } from 'react';

export interface District {
  id: string;
  name: string;
  state: string;
}

export interface State {
  id: string;
  name: string;
  districts: District[];
}

interface LocationContextType {
  selectedState: string | null;
  selectedDistrict: string | null;
  setSelectedState: (stateId: string | null) => void;
  setSelectedDistrict: (districtId: string | null) => void;
  states: State[];
  getDistrictsByState: (stateId: string) => District[];
  getStateName: (stateId: string) => string;
  getDistrictName: (districtId: string) => string;
}

// Complete list of Indian states and districts
const indianStatesAndDistricts: State[] = [
  {
    id: 'AP',
    name: 'Andhra Pradesh',
    districts: [
      { id: 'AP_ANT', name: 'Anantapur', state: 'AP' },
      { id: 'AP_CHI', name: 'Chittoor', state: 'AP' },
      { id: 'AP_EGA', name: 'East Godavari', state: 'AP' },
      { id: 'AP_GUN', name: 'Guntur', state: 'AP' },
      { id: 'AP_KAD', name: 'Kadapa', state: 'AP' },
      { id: 'AP_KRI', name: 'Krishna', state: 'AP' },
      { id: 'AP_KUR', name: 'Kurnool', state: 'AP' },
      { id: 'AP_NEL', name: 'Nellore', state: 'AP' },
      { id: 'AP_PRA', name: 'Prakasam', state: 'AP' },
      { id: 'AP_SRI', name: 'Srikakulam', state: 'AP' },
      { id: 'AP_VIS', name: 'Visakhapatnam', state: 'AP' },
      { id: 'AP_VIZ', name: 'Vizianagaram', state: 'AP' },
      { id: 'AP_WGA', name: 'West Godavari', state: 'AP' },
    ]
  },
  {
    id: 'AR',
    name: 'Arunachal Pradesh',
    districts: [
      { id: 'AR_ANJ', name: 'Anjaw', state: 'AR' },
      { id: 'AR_CHA', name: 'Changlang', state: 'AR' },
      { id: 'AR_EKA', name: 'East Kameng', state: 'AR' },
      { id: 'AR_ESI', name: 'East Siang', state: 'AR' },
      { id: 'AR_KAM', name: 'Kamle', state: 'AR' },
      { id: 'AR_KRA', name: 'Kra Daadi', state: 'AR' },
      { id: 'AR_KUR', name: 'Kurung Kumey', state: 'AR' },
      { id: 'AR_LOH', name: 'Lohit', state: 'AR' },
      { id: 'AR_LON', name: 'Longding', state: 'AR' },
      { id: 'AR_LOW', name: 'Lower Dibang Valley', state: 'AR' },
      { id: 'AR_LSU', name: 'Lower Subansiri', state: 'AR' },
      { id: 'AR_NOA', name: 'Namsai', state: 'AR' },
      { id: 'AR_PAP', name: 'Papum Pare', state: 'AR' },
      { id: 'AR_SHI', name: 'Shi Yomi', state: 'AR' },
      { id: 'AR_TAW', name: 'Tawang', state: 'AR' },
      { id: 'AR_TIR', name: 'Tirap', state: 'AR' },
      { id: 'AR_UPD', name: 'Upper Dibang Valley', state: 'AR' },
      { id: 'AR_UPS', name: 'Upper Subansiri', state: 'AR' },
      { id: 'AR_USI', name: 'Upper Siang', state: 'AR' },
      { id: 'AR_WKA', name: 'West Kameng', state: 'AR' },
      { id: 'AR_WSI', name: 'West Siang', state: 'AR' },
    ]
  },
  {
    id: 'AS',
    name: 'Assam',
    districts: [
      { id: 'AS_BAK', name: 'Baksa', state: 'AS' },
      { id: 'AS_BAR', name: 'Barpeta', state: 'AS' },
      { id: 'AS_BIG', name: 'Biswanath', state: 'AS' },
      { id: 'AS_BON', name: 'Bongaigaon', state: 'AS' },
      { id: 'AS_CAC', name: 'Cachar', state: 'AS' },
      { id: 'AS_CHA', name: 'Charaideo', state: 'AS' },
      { id: 'AS_CHI', name: 'Chirang', state: 'AS' },
      { id: 'AS_DAR', name: 'Darrang', state: 'AS' },
      { id: 'AS_DHE', name: 'Dhemaji', state: 'AS' },
      { id: 'AS_DHU', name: 'Dhubri', state: 'AS' },
      { id: 'AS_DIB', name: 'Dibrugarh', state: 'AS' },
      { id: 'AS_DIM', name: 'Dima Hasao', state: 'AS' },
      { id: 'AS_GOA', name: 'Goalpara', state: 'AS' },
      { id: 'AS_GOL', name: 'Golaghat', state: 'AS' },
      { id: 'AS_GUW', name: 'Guwahati', state: 'AS' },
      { id: 'AS_HAI', name: 'Hailakandi', state: 'AS' },
      { id: 'AS_HOJ', name: 'Hojai', state: 'AS' },
      { id: 'AS_JOR', name: 'Jorhat', state: 'AS' },
      { id: 'AS_KAM', name: 'Kamrup', state: 'AS' },
      { id: 'AS_KAR', name: 'Karbi Anglong', state: 'AS' },
      { id: 'AS_KAT', name: 'Karimganj', state: 'AS' },
      { id: 'AS_KOK', name: 'Kokrajhar', state: 'AS' },
      { id: 'AS_LAK', name: 'Lakhimpur', state: 'AS' },
      { id: 'AS_MAJ', name: 'Majuli', state: 'AS' },
      { id: 'AS_MOR', name: 'Morigaon', state: 'AS' },
      { id: 'AS_NAG', name: 'Nagaon', state: 'AS' },
      { id: 'AS_NAL', name: 'Nalbari', state: 'AS' },
      { id: 'AS_SIB', name: 'Sivasagar', state: 'AS' },
      { id: 'AS_SON', name: 'Sonitpur', state: 'AS' },
      { id: 'AS_SOU', name: 'South Salmara-Mankachar', state: 'AS' },
      { id: 'AS_TIN', name: 'Tinsukia', state: 'AS' },
      { id: 'AS_UDA', name: 'Udalguri', state: 'AS' },
      { id: 'AS_WKA', name: 'West Karbi Anglong', state: 'AS' },
    ]
  },
  {
    id: 'BR',
    name: 'Bihar',
    districts: [
      { id: 'BR_ARA', name: 'Araria', state: 'BR' },
      { id: 'BR_ARW', name: 'Arwal', state: 'BR' },
      { id: 'BR_AUR', name: 'Aurangabad', state: 'BR' },
      { id: 'BR_BAN', name: 'Banka', state: 'BR' },
      { id: 'BR_BEG', name: 'Begusarai', state: 'BR' },
      { id: 'BR_BHA', name: 'Bhagalpur', state: 'BR' },
      { id: 'BR_BHO', name: 'Bhojpur', state: 'BR' },
      { id: 'BR_BUX', name: 'Buxar', state: 'BR' },
      { id: 'BR_DAR', name: 'Darbhanga', state: 'BR' },
      { id: 'BR_EAS', name: 'East Champaran', state: 'BR' },
      { id: 'BR_GAY', name: 'Gaya', state: 'BR' },
      { id: 'BR_GOP', name: 'Gopalganj', state: 'BR' },
      { id: 'BR_JAM', name: 'Jamui', state: 'BR' },
      { id: 'BR_JEH', name: 'Jehanabad', state: 'BR' },
      { id: 'BR_KAI', name: 'Kaimur', state: 'BR' },
      { id: 'BR_KAT', name: 'Katihar', state: 'BR' },
      { id: 'BR_KHA', name: 'Khagaria', state: 'BR' },
      { id: 'BR_KIS', name: 'Kishanganj', state: 'BR' },
      { id: 'BR_LAK', name: 'Lakhisarai', state: 'BR' },
      { id: 'BR_MAD', name: 'Madhepura', state: 'BR' },
      { id: 'BR_MAH', name: 'Madhubani', state: 'BR' },
      { id: 'BR_MUN', name: 'Munger', state: 'BR' },
      { id: 'BR_MUZ', name: 'Muzaffarpur', state: 'BR' },
      { id: 'BR_NAL', name: 'Nalanda', state: 'BR' },
      { id: 'BR_NAW', name: 'Nawada', state: 'BR' },
      { id: 'BR_PAT', name: 'Patna', state: 'BR' },
      { id: 'BR_PUR', name: 'Purnia', state: 'BR' },
      { id: 'BR_ROH', name: 'Rohtas', state: 'BR' },
      { id: 'BR_SAH', name: 'Saharsa', state: 'BR' },
      { id: 'BR_SAM', name: 'Samastipur', state: 'BR' },
      { id: 'BR_SAR', name: 'Saran', state: 'BR' },
      { id: 'BR_SHE', name: 'Sheohar', state: 'BR' },
      { id: 'BR_SHI', name: 'Sheikhpura', state: 'BR' },
      { id: 'BR_SIT', name: 'Sitamarhi', state: 'BR' },
      { id: 'BR_SIW', name: 'Siwan', state: 'BR' },
      { id: 'BR_SUP', name: 'Supaul', state: 'BR' },
      { id: 'BR_VAI', name: 'Vaishali', state: 'BR' },
      { id: 'BR_WES', name: 'West Champaran', state: 'BR' },
    ]
  },
  {
    id: 'CG',
    name: 'Chhattisgarh',
    districts: [
      { id: 'CG_BAL', name: 'Balod', state: 'CG' },
      { id: 'CG_BAR', name: 'Baloda Bazar', state: 'CG' },
      { id: 'CG_BAS', name: 'Balrampur', state: 'CG' },
      { id: 'CG_BAS2', name: 'Bastar', state: 'CG' },
      { id: 'CG_BEM', name: 'Bemetara', state: 'CG' },
      { id: 'CG_BIJ', name: 'Bijapur', state: 'CG' },
      { id: 'CG_BIL', name: 'Bilaspur', state: 'CG' },
      { id: 'CG_DAN', name: 'Dantewada', state: 'CG' },
      { id: 'CG_DHA', name: 'Dhamtari', state: 'CG' },
      { id: 'CG_DUR', name: 'Durg', state: 'CG' },
      { id: 'CG_GAR', name: 'Gariaband', state: 'CG' },
      { id: 'CG_JAG', name: 'Jagdalpur', state: 'CG' },
      { id: 'CG_JAN', name: 'Janjgir-Champa', state: 'CG' },
      { id: 'CG_JAS', name: 'Jashpur', state: 'CG' },
      { id: 'CG_KAB', name: 'Kabirdham', state: 'CG' },
      { id: 'CG_KAN', name: 'Kanker', state: 'CG' },
      { id: 'CG_KON', name: 'Kondagaon', state: 'CG' },
      { id: 'CG_KOR', name: 'Korba', state: 'CG' },
      { id: 'CG_KOR2', name: 'Koriya', state: 'CG' },
      { id: 'CG_MAH', name: 'Mahasamund', state: 'CG' },
      { id: 'CG_MUN', name: 'Mungeli', state: 'CG' },
      { id: 'CG_NAR', name: 'Narayanpur', state: 'CG' },
      { id: 'CG_RAI', name: 'Raigarh', state: 'CG' },
      { id: 'CG_RAI2', name: 'Raipur', state: 'CG' },
      { id: 'CG_RAJ', name: 'Rajnandgaon', state: 'CG' },
      { id: 'CG_SUK', name: 'Sukma', state: 'CG' },
      { id: 'CG_SUR', name: 'Surajpur', state: 'CG' },
      { id: 'CG_SUR2', name: 'Surguja', state: 'CG' },
    ]
  },
  {
    id: 'DL',
    name: 'Delhi',
    districts: [
      { id: 'DL_CEN', name: 'Central Delhi', state: 'DL' },
      { id: 'DL_EAS', name: 'East Delhi', state: 'DL' },
      { id: 'DL_NEW', name: 'New Delhi', state: 'DL' },
      { id: 'DL_NOR', name: 'North Delhi', state: 'DL' },
      { id: 'DL_NEA', name: 'North East Delhi', state: 'DL' },
      { id: 'DL_NWE', name: 'North West Delhi', state: 'DL' },
      { id: 'DL_SHA', name: 'Shahdara', state: 'DL' },
      { id: 'DL_SOU', name: 'South Delhi', state: 'DL' },
      { id: 'DL_SEA', name: 'South East Delhi', state: 'DL' },
      { id: 'DL_SWE', name: 'South West Delhi', state: 'DL' },
      { id: 'DL_WES', name: 'West Delhi', state: 'DL' },
    ]
  },
  {
    id: 'GA',
    name: 'Goa',
    districts: [
      { id: 'GA_NOR', name: 'North Goa', state: 'GA' },
      { id: 'GA_SOU', name: 'South Goa', state: 'GA' },
    ]
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    districts: [
      { id: 'GJ_AHM', name: 'Ahmedabad', state: 'GJ' },
      { id: 'GJ_AMR', name: 'Amreli', state: 'GJ' },
      { id: 'GJ_ANA', name: 'Anand', state: 'GJ' },
      { id: 'GJ_ARA', name: 'Aravalli', state: 'GJ' },
      { id: 'GJ_BAN', name: 'Banaskantha', state: 'GJ' },
      { id: 'GJ_BAR', name: 'Bharuch', state: 'GJ' },
      { id: 'GJ_BHA', name: 'Bhavnagar', state: 'GJ' },
      { id: 'GJ_BOT', name: 'Botad', state: 'GJ' },
      { id: 'GJ_CHH', name: 'Chhota Udaipur', state: 'GJ' },
      { id: 'GJ_DAH', name: 'Dahod', state: 'GJ' },
      { id: 'GJ_DAN', name: 'Dang', state: 'GJ' },
      { id: 'GJ_DEV', name: 'Devbhoomi Dwarka', state: 'GJ' },
      { id: 'GJ_GAN', name: 'Gandhinagar', state: 'GJ' },
      { id: 'GJ_GIR', name: 'Gir Somnath', state: 'GJ' },
      { id: 'GJ_JAM', name: 'Jamnagar', state: 'GJ' },
      { id: 'GJ_JUN', name: 'Junagadh', state: 'GJ' },
      { id: 'GJ_KAC', name: 'Kachchh', state: 'GJ' },
      { id: 'GJ_KHE', name: 'Kheda', state: 'GJ' },
      { id: 'GJ_MAH', name: 'Mahisagar', state: 'GJ' },
      { id: 'GJ_MEH', name: 'Mehsana', state: 'GJ' },
      { id: 'GJ_MOR', name: 'Morbi', state: 'GJ' },
      { id: 'GJ_NAR', name: 'Narmada', state: 'GJ' },
      { id: 'GJ_NAV', name: 'Navsari', state: 'GJ' },
      { id: 'GJ_PAN', name: 'Panchmahal', state: 'GJ' },
      { id: 'GJ_PAT', name: 'Patan', state: 'GJ' },
      { id: 'GJ_POR', name: 'Porbandar', state: 'GJ' },
      { id: 'GJ_RAJ', name: 'Rajkot', state: 'GJ' },
      { id: 'GJ_SAB', name: 'Sabarkantha', state: 'GJ' },
      { id: 'GJ_SUR', name: 'Surat', state: 'GJ' },
      { id: 'GJ_SUR2', name: 'Surendranagar', state: 'GJ' },
      { id: 'GJ_TAP', name: 'Tapi', state: 'GJ' },
      { id: 'GJ_VAD', name: 'Vadodara', state: 'GJ' },
      { id: 'GJ_VAL', name: 'Valsad', state: 'GJ' },
    ]
  },
  {
    id: 'HR',
    name: 'Haryana',
    districts: [
      { id: 'HR_AMB', name: 'Ambala', state: 'HR' },
      { id: 'HR_BHI', name: 'Bhiwani', state: 'HR' },
      { id: 'HR_CHA', name: 'Charkhi Dadri', state: 'HR' },
      { id: 'HR_FAR', name: 'Faridabad', state: 'HR' },
      { id: 'HR_FAT', name: 'Fatehabad', state: 'HR' },
      { id: 'HR_GUR', name: 'Gurugram', state: 'HR' },
      { id: 'HR_HIS', name: 'Hisar', state: 'HR' },
      { id: 'HR_JHA', name: 'Jhajjar', state: 'HR' },
      { id: 'HR_JIN', name: 'Jind', state: 'HR' },
      { id: 'HR_KAI', name: 'Kaithal', state: 'HR' },
      { id: 'HR_KAR', name: 'Karnal', state: 'HR' },
      { id: 'HR_KUR', name: 'Kurukshetra', state: 'HR' },
      { id: 'HR_MAH', name: 'Mahendragarh', state: 'HR' },
      { id: 'HR_NEW', name: 'Nuh', state: 'HR' },
      { id: 'HR_PAL', name: 'Palwal', state: 'HR' },
      { id: 'HR_PAN', name: 'Panchkula', state: 'HR' },
      { id: 'HR_PAN2', name: 'Panipat', state: 'HR' },
      { id: 'HR_REW', name: 'Rewari', state: 'HR' },
      { id: 'HR_ROH', name: 'Rohtak', state: 'HR' },
      { id: 'HR_SIR', name: 'Sirsa', state: 'HR' },
      { id: 'HR_SON', name: 'Sonipat', state: 'HR' },
      { id: 'HR_YAM', name: 'Yamunanagar', state: 'HR' },
    ]
  },
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    districts: [
      { id: 'HP_BIL', name: 'Bilaspur', state: 'HP' },
      { id: 'HP_CHA', name: 'Chamba', state: 'HP' },
      { id: 'HP_HAM', name: 'Hamirpur', state: 'HP' },
      { id: 'HP_KAN', name: 'Kangra', state: 'HP' },
      { id: 'HP_KIN', name: 'Kinnaur', state: 'HP' },
      { id: 'HP_KUL', name: 'Kullu', state: 'HP' },
      { id: 'HP_LAH', name: 'Lahaul and Spiti', state: 'HP' },
      { id: 'HP_MAN', name: 'Mandi', state: 'HP' },
      { id: 'HP_SHI', name: 'Shimla', state: 'HP' },
      { id: 'HP_SIR', name: 'Sirmaur', state: 'HP' },
      { id: 'HP_SOL', name: 'Solan', state: 'HP' },
      { id: 'HP_UNA', name: 'Una', state: 'HP' },
    ]
  },
  {
    id: 'JH',
    name: 'Jharkhand',
    districts: [
      { id: 'JH_BOK', name: 'Bokaro', state: 'JH' },
      { id: 'JH_CHA', name: 'Chatra', state: 'JH' },
      { id: 'JH_DEO', name: 'Deoghar', state: 'JH' },
      { id: 'JH_DHA', name: 'Dhanbad', state: 'JH' },
      { id: 'JH_DUM', name: 'Dumka', state: 'JH' },
      { id: 'JH_EAS', name: 'East Singhbhum', state: 'JH' },
      { id: 'JH_GAR', name: 'Garhwa', state: 'JH' },
      { id: 'JH_GIR', name: 'Giridih', state: 'JH' },
      { id: 'JH_GOD', name: 'Godda', state: 'JH' },
      { id: 'JH_GUM', name: 'Gumla', state: 'JH' },
      { id: 'JH_HAZ', name: 'Hazaribagh', state: 'JH' },
      { id: 'JH_JAM', name: 'Jamtara', state: 'JH' },
      { id: 'JH_KHA', name: 'Khunti', state: 'JH' },
      { id: 'JH_KOD', name: 'Koderma', state: 'JH' },
      { id: 'JH_LAT', name: 'Latehar', state: 'JH' },
      { id: 'JH_LOH', name: 'Lohardaga', state: 'JH' },
      { id: 'JH_PAK', name: 'Pakur', state: 'JH' },
      { id: 'JH_PAL', name: 'Palamu', state: 'JH' },
      { id: 'JH_RAM', name: 'Ramgarh', state: 'JH' },
      { id: 'JH_RAN', name: 'Ranchi', state: 'JH' },
      { id: 'JH_SAH', name: 'Sahebganj', state: 'JH' },
      { id: 'JH_SER', name: 'Seraikela Kharsawan', state: 'JH' },
      { id: 'JH_SIM', name: 'Simdega', state: 'JH' },
      { id: 'JH_WES', name: 'West Singhbhum', state: 'JH' },
    ]
  },
  {
    id: 'KA',
    name: 'Karnataka',
    districts: [
      { id: 'KA_BAG', name: 'Bagalkot', state: 'KA' },
      { id: 'KA_BAN', name: 'Bangalore Rural', state: 'KA' },
      { id: 'KA_BAN2', name: 'Bangalore Urban', state: 'KA' },
      { id: 'KA_BEL', name: 'Belgaum', state: 'KA' },
      { id: 'KA_BEL2', name: 'Bellary', state: 'KA' },
      { id: 'KA_BID', name: 'Bidar', state: 'KA' },
      { id: 'KA_BIJ', name: 'Bijapura', state: 'KA' },
      { id: 'KA_CHA', name: 'Chamarajanagar', state: 'KA' },
      { id: 'KA_CHI', name: 'Chikballapur', state: 'KA' },
      { id: 'KA_CHI2', name: 'Chikkamagaluru', state: 'KA' },
      { id: 'KA_CHI3', name: 'Chitradurga', state: 'KA' },
      { id: 'KA_DAK', name: 'Dakshina Kannada', state: 'KA' },
      { id: 'KA_DAV', name: 'Davanagere', state: 'KA' },
      { id: 'KA_DHA', name: 'Dharwad', state: 'KA' },
      { id: 'KA_GAD', name: 'Gadag', state: 'KA' },
      { id: 'KA_GUL', name: 'Gulbarga', state: 'KA' },
      { id: 'KA_HAS', name: 'Hassan', state: 'KA' },
      { id: 'KA_HAV', name: 'Haveri', state: 'KA' },
      { id: 'KA_KOD', name: 'Kodagu', state: 'KA' },
      { id: 'KA_KOL', name: 'Kolar', state: 'KA' },
      { id: 'KA_KOP', name: 'Koppal', state: 'KA' },
      { id: 'KA_MAN', name: 'Mandya', state: 'KA' },
      { id: 'KA_MYS', name: 'Mysore', state: 'KA' },
      { id: 'KA_RAI', name: 'Raichur', state: 'KA' },
      { id: 'KA_RAM', name: 'Ramanagara', state: 'KA' },
      { id: 'KA_SHI', name: 'Shimoga', state: 'KA' },
      { id: 'KA_TUM', name: 'Tumkur', state: 'KA' },
      { id: 'KA_UDU', name: 'Udupi', state: 'KA' },
      { id: 'KA_UTT', name: 'Uttara Kannada', state: 'KA' },
      { id: 'KA_YAD', name: 'Yadgir', state: 'KA' },
    ]
  },
  // Adding more states... This is getting quite large, let me create a more manageable version
];

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedState, setSelectedState] = useState<string | null>(() => {
    return localStorage.getItem('selectedState') || null;
  });
  
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(() => {
    return localStorage.getItem('selectedDistrict') || null;
  });

  const handleSetSelectedState = (stateId: string | null) => {
    if (stateId) {
      localStorage.setItem('selectedState', stateId);
    } else {
      localStorage.removeItem('selectedState');
    }
    setSelectedState(stateId);
    
    // Clear district when state changes
    setSelectedDistrict(null);
    localStorage.removeItem('selectedDistrict');
  };

  const handleSetSelectedDistrict = (districtId: string | null) => {
    if (districtId) {
      localStorage.setItem('selectedDistrict', districtId);
    } else {
      localStorage.removeItem('selectedDistrict');
    }
    setSelectedDistrict(districtId);
  };

  const getDistrictsByState = (stateId: string): District[] => {
    const state = indianStatesAndDistricts.find(s => s.id === stateId);
    return state ? state.districts : [];
  };

  const getStateName = (stateId: string): string => {
    const state = indianStatesAndDistricts.find(s => s.id === stateId);
    return state ? state.name : '';
  };

  const getDistrictName = (districtId: string): string => {
    for (const state of indianStatesAndDistricts) {
      const district = state.districts.find(d => d.id === districtId);
      if (district) return district.name;
    }
    return '';
  };

  const value: LocationContextType = {
    selectedState,
    selectedDistrict,
    setSelectedState: handleSetSelectedState,
    setSelectedDistrict: handleSetSelectedDistrict,
    states: indianStatesAndDistricts,
    getDistrictsByState,
    getStateName,
    getDistrictName,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
