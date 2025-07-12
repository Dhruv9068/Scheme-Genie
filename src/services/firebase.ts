import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { FIREBASE_CONFIG, REAL_INDIAN_SCHEMES_DATA } from '../utils/constants';
import { User as AppUser, Scheme, UserProfile, SchemeCategory } from '../utils/types';

// Validate Firebase config
const isValidFirebaseConfig = () => {
  return FIREBASE_CONFIG.apiKey && 
         FIREBASE_CONFIG.authDomain && 
         FIREBASE_CONFIG.projectId && 
         FIREBASE_CONFIG.storageBucket && 
         FIREBASE_CONFIG.messagingSenderId && 
         FIREBASE_CONFIG.appId &&
         FIREBASE_CONFIG.apiKey !== 'your_firebase_api_key' &&
         !FIREBASE_CONFIG.apiKey.includes('undefined');
};

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only if supported and config is valid
let analytics = null;
if (isValidFirebaseConfig()) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export class FirebaseService {
  // Initialize auth state listener
  initAuthListener(callback: (user: AppUser | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Firebase auth state changed:', firebaseUser?.email);
      
      // Check if Firebase is properly configured
      if (!isValidFirebaseConfig()) {
        console.warn('Firebase not properly configured, using demo mode');
        callback(await this.setupDemoAccount());
        return;
      }
      
      if (firebaseUser) {
        try {
          // Handle demo account
          if (firebaseUser.email === 'demo@schemegenie.com') {
            const demoUser = await this.setupDemoAccount();
            callback(demoUser);
            return;
          }
          
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as AppUser;
            console.log('Firebase: User data loaded:', userData);
            callback(userData);
          } else {
            console.log('Firebase: User document not found');
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        console.log('Firebase: User signed out');
        callback(null);
      }
    });
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<AppUser>): Promise<AppUser> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.warn('Firebase not configured, using demo account');
        return await this.setupDemoAccount();
      }
      
      // Check if this is the demo account setup
      if (email === 'demo@schemegenie.com') {
        return await this.setupDemoAccount();
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const appUser: AppUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: userData.name || '',
        country: userData.country || 'US',
        language: userData.language || 'en',
        profile: userData.profile || {
          age: 0,
          income: 0,
          education: '',
          employment: '',
          familySize: 1,
          disabilities: false,
          gender: '',
          location: '',
        },
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), appUser);
      return appUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Setup demo account for judges
  async setupDemoAccount(): Promise<AppUser> {
    console.log('Setting up demo account...');
    
    const demoUser: AppUser = {
      id: 'demo-user-123',
      email: 'demo@schemegenie.com',
      name: 'John Demo Student',
      country: 'IN',
      language: 'en',
      profile: {
        age: 22,
        income: 25000,
        education: 'bachelors',
        employment: 'student',
        familySize: 4,
        disabilities: false,
        gender: 'male',
        location: 'Bangalore, Karnataka',
        interests: ['education', 'business', 'employment'],
      },
    };

    // Save demo user to Firestore
    await setDoc(doc(db, 'users', demoUser.id), demoUser);
    
    console.log('Demo user saved to Firestore:', demoUser);
    
    // Create sample applications for demo
    await this.createDemoApplications(demoUser.id);
    
    console.log('Demo applications created');
    
    return demoUser;
  }

  async createDemoApplications(userId: string): Promise<void> {
    const demoApplications = [
      {
        id: 'demo-app-1',
        userId,
        schemeId: 'nmms-2024',
        schemeTitle: 'National Means-cum-Merit Scholarship (NMMS)',
        status: 'approved',
        amount: '₹12,000 per year',
        applicationData: {
          fullName: 'John Demo Student',
          email: 'demo@schemegenie.com',
          phone: '+91-9876543210',
          dateOfBirth: '2002-05-15',
          fatherName: 'Robert Demo',
          motherName: 'Mary Demo',
          address: '123 Demo Street, Bangalore',
          pincode: '560001',
          state: 'Karnataka',
          district: 'Bangalore Urban',
          income: '25000',
          category: 'General',
          bankAccount: '1234567890',
          ifscCode: 'SBIN0001234',
          class: '12th',
          school: 'Demo High School',
          percentage: '92.5'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        approvedAt: new Date('2024-01-20')
      },
      {
        id: 'demo-app-2',
        userId,
        schemeId: 'pmrf-2024',
        schemeTitle: 'Prime Minister\'s Research Fellowship (PMRF)',
        status: 'pending',
        amount: '₹70,000-80,000/month',
        applicationData: {
          fullName: 'John Demo Student',
          email: 'demo@schemegenie.com',
          phone: '+91-9876543210',
          education: 'Bachelor of Engineering',
          university: 'Demo Institute of Technology',
          cgpa: '9.2',
          researchArea: 'Artificial Intelligence',
          supervisor: 'Dr. Demo Professor',
          publications: '2 conference papers',
          experience: '1 year research internship'
        },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: 'demo-app-3',
        userId,
        schemeId: 'csir-ugc-jrf-2024',
        schemeTitle: 'CSIR-UGC JRF-NET Fellowship',
        status: 'draft',
        amount: '₹31,000-35,000/month',
        applicationData: {
          fullName: 'John Demo Student',
          email: 'demo@schemegenie.com',
          phone: '+91-9876543210',
          netScore: '95.5',
          subject: 'Computer Science',
          rank: '45',
          validityPeriod: '3 years'
        },
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ];

    // Save all demo applications
    for (const app of demoApplications) {
      await setDoc(doc(db, 'applications', app.id), app);
      
      // If approved, also add to approved_applications collection
      if (app.status === 'approved') {
        await setDoc(doc(db, 'approved_applications', `${userId}_${app.id}`), {
          userId,
          applicationId: app.id,
          approvedAt: app.approvedAt || new Date(),
          status: 'approved'
        });
      }
    }
  }

  async signIn(email: string, password: string): Promise<AppUser> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.warn('Firebase not configured, using demo account');
        return await this.setupDemoAccount();
      }
      
      // Handle demo account login
      if (email === 'demo@schemegenie.com' && password === 'demo123') {
        console.log('Demo account login detected');
        const demoUser = await this.setupDemoAccount();
        console.log('Demo account setup complete:', demoUser);
        return demoUser;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as AppUser;
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - sign out complete');
        return;
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    try {
      console.log('Firebase: Updating profile for user:', userId, 'with data:', profile);
      
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - profile update skipped');
        return;
      }
      
      // Handle demo user
      if (userId === 'demo-user-123') {
        console.log('Demo user profile update - skipping Firebase update');
        return;
      }
      
      const userRef = doc(db, 'users', userId);
      
      // Get current user data first
      const currentUserDoc = await getDoc(userRef);
      const currentUser = currentUserDoc.data();
      
      if (!currentUser) {
        throw new Error('User document not found');
      }
      
      // Merge with existing profile
      const updatedProfile = {
        ...currentUser?.profile,
        ...profile,
        updatedAt: new Date()
      };
      
      // Update the entire user document with new profile
      const updatedUserData = { 
        ...currentUser,
        profile: updatedProfile
      };
      
      await setDoc(userRef, updatedUserData, { merge: true });
      
      console.log('Firebase: Profile updated successfully for user:', userId, 'New profile:', updatedProfile);
      
      // Verify the update by reading it back
      const verifyDoc = await getDoc(userRef);
      const verifiedData = verifyDoc.data();
      console.log('Firebase: Verified updated user data:', verifiedData);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Schemes methods
  async getSchemes(country?: string, category?: string): Promise<Scheme[]> {
    // Convert the data to proper Scheme type with correct category typing
    let schemes: Scheme[] = REAL_INDIAN_SCHEMES_DATA.map(scheme => ({
      ...scheme,
      category: scheme.category as SchemeCategory
    }));
    
    if (country) schemes = schemes.filter(scheme => scheme.country === country);
    if (category) schemes = schemes.filter(scheme => scheme.category === category);
    
    return schemes;
  }

  async getEligibleSchemes(userId: string): Promise<Scheme[]> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return REAL_INDIAN_SCHEMES_DATA.slice(0, 5).map(scheme => ({
        ...scheme,
        category: scheme.category as SchemeCategory
      }));
    }
    
    const { profile: userProfile, country } = userDoc.data();
    if (!userProfile) {
      return REAL_INDIAN_SCHEMES_DATA.slice(0, 5).map(scheme => ({
        ...scheme,
        category: scheme.category as SchemeCategory
      }));
    }
    
    const eligibleSchemes = REAL_INDIAN_SCHEMES_DATA.filter(scheme => {
      if (userProfile.age <= 25 && scheme.category === 'education') return true;
      if (userProfile.age <= 35 && scheme.title.includes('Research')) return true;
      if (userProfile.income < 50000 && scheme.title.includes('Merit')) return true;
      if (userProfile.employment === 'student' && scheme.category === 'education') return true;
      if (country === 'IN') return true;
      return false;
    }).slice(0, 8);

    return eligibleSchemes.map((scheme, index) => ({
      ...scheme,
      id: `eligible-${scheme.id}-${index}`,
      category: scheme.category as SchemeCategory,
      matchReason: this.getMatchReason(scheme, userProfile),
      priority: this.calculatePriority(scheme, userProfile)
    }));
  }

  private getMatchReason(scheme: any, userProfile: any): string {
    const reasons = [];
    
    if (userProfile.age <= 25 && scheme.category === 'education') {
      reasons.push('Age eligible for education schemes');
    }
    
    if (userProfile.income < 50000 && scheme.title.includes('Merit')) {
      reasons.push('Income within eligibility range');
    }
    
    if (userProfile.employment === 'student' && scheme.category === 'education') {
      reasons.push('Student status matches scheme requirements');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Matches your general profile';
  }

  private calculatePriority(scheme: any, userProfile: any): 'high' | 'medium' | 'low' {
    let score = 0;
    
    // Age match
    if (userProfile.age <= 25 && scheme.category === 'education') score += 3;
    if (userProfile.age >= 18 && userProfile.age <= 35 && scheme.title.includes('Research')) score += 2;
    
    // Income match
    if (userProfile.income < 50000 && scheme.title.includes('Merit')) score += 2;
    
    // Education match
    if (userProfile.education.includes('Bachelor') && scheme.title.includes('Research')) score += 2;
    if (userProfile.education.includes('Master') && scheme.title.includes('Fellowship')) score += 3;
    
    // Employment match
    if (userProfile.employment === 'student' && scheme.category === 'education') score += 2;
    
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  async getSchemeById(schemeId: string): Promise<any> {
    const scheme = REAL_INDIAN_SCHEMES_DATA.find(s => s.id === schemeId || schemeId.includes(s.id));
    if (!scheme) return null;
    
    return {
      ...scheme,
      category: scheme.category as SchemeCategory,
      detailedDescription: `${scheme.description}\n\nThis government scheme provides financial assistance to eligible candidates.`,
      applicationSteps: [
        'Check eligibility criteria',
        'Gather required documents',
        'Fill application form',
        'Submit before deadline'
      ],
      tips: [
        'Apply early',
        'Double-check information',
        'Keep document copies'
      ]
    };
  }

  async saveUserApplication(userId: string, application: any): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - application save skipped');
        return;
      }
      
      const applicationId = `app_${Date.now()}`;
      await setDoc(doc(db, 'applications', applicationId), {
        ...application,
        userId,
        id: applicationId,
        status: application.status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Save application error:', error);
      throw error;
    }
  }

  async getUserApplications(userId: string): Promise<any[]> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - returning demo applications');
        return this.getDemoApplications();
      }
      
      const applicationsQuery = query(
        collection(db, 'applications'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(applicationsQuery);
      return querySnapshot.docs.map(docSnapshot => ({ 
        id: docSnapshot.id, 
        ...docSnapshot.data() 
      }));
    } catch (error) {
      console.error('Get user applications error:', error);
      return [];
    }
  }

  // Demo applications for when Firebase is not configured
  getDemoApplications(): any[] {
    return [
      {
        id: 'demo-app-1',
        schemeId: 'nmms-2024',
        schemeTitle: 'National Means-cum-Merit Scholarship (NMMS)',
        status: 'approved',
        amount: '₹12,000 per year',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        approvedAt: new Date('2024-01-20')
      },
      {
        id: 'demo-app-2',
        schemeId: 'pmrf-2024',
        schemeTitle: 'Prime Minister\'s Research Fellowship (PMRF)',
        status: 'pending',
        amount: '₹70,000-80,000/month',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      },
      {
        id: 'demo-app-3',
        schemeId: 'csir-ugc-jrf-2024',
        schemeTitle: 'CSIR-UGC JRF-NET Fellowship',
        status: 'draft',
        amount: '₹31,000-35,000/month',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      }
    ];
  }

  async approveApplication(applicationId: string, userId: string): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - application approval skipped');
        return;
      }
      
      await setDoc(doc(db, 'applications', applicationId), {
        status: 'approved',
        approvedAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
      
      // Also save to approved applications collection for extension access
      await setDoc(doc(db, 'approved_applications', `${userId}_${applicationId}`), {
        userId,
        applicationId,
        approvedAt: new Date(),
        status: 'approved'
      });
    } catch (error) {
      console.error('Approve application error:', error);
      throw error;
    }
  }

  async getApprovedApplications(userId: string): Promise<any[]> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - returning demo approved applications');
        return this.getDemoApplications().filter(app => app.status === 'approved');
      }
      
      const approvedQuery = query(
        collection(db, 'approved_applications'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(approvedQuery);
      
      // Get full application details
      const approvedApps = [];
      for (const docSnapshot of querySnapshot.docs) {
        const approvedData = docSnapshot.data();
        const appDoc = await getDoc(doc(db, 'applications', approvedData.applicationId));
        if (appDoc.exists()) {
          approvedApps.push({
            id: appDoc.id,
            ...appDoc.data(),
            approvedAt: approvedData.approvedAt
          });
        }
      }
      
      return approvedApps;
    } catch (error) {
      console.error('Get approved applications error:', error);
      return [];
    }
  }

  async updateApplicationStatus(applicationId: string, status: string, data?: any): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - status update skipped');
        return;
      }
      
      await setDoc(doc(db, 'applications', applicationId), {
        status,
        updatedAt: new Date(),
        ...data
      }, { merge: true });
    } catch (error) {
      console.error('Update application status error:', error);
      throw error;
    }
  }

  async addScheme(scheme: Scheme): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - scheme addition skipped');
        return;
      }
      
      await setDoc(doc(db, 'schemes', scheme.id), scheme);
    } catch (error) {
      console.error('Add scheme error:', error);
      throw error;
    }
  }

  // Reminders methods (if needed in future)
  async addReminder(reminder: any): Promise<void> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - reminder addition skipped');
        return;
      }
      
      await setDoc(doc(db, 'reminders', reminder.id), reminder);
    } catch (error) {
      console.error('Add reminder error:', error);
      throw error;
    }
  }

  async getUserReminders(userId: string): Promise<any[]> {
    try {
      // Check Firebase config
      if (!isValidFirebaseConfig()) {
        console.log('Demo mode - returning empty reminders');
        return [];
      }
      
      const remindersQuery = query(
        collection(db, 'reminders'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(remindersQuery);
      return querySnapshot.docs.map(docSnapshot => ({ 
        id: docSnapshot.id, 
        ...docSnapshot.data() 
      }));
    } catch (error) {
      console.error('Get reminders error:', error);
      return [];
    }
  }
}

export const firebaseService = new FirebaseService();