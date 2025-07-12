export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  language: string;
  profile: UserProfile;
}

export interface UserProfile {
  age: number;
  income: number;
  education: string;
  employment: string;
  familySize: number;
  disabilities: boolean;
  gender: string;
  location: string;
  interests?: string[];
}

export interface Scheme {
  id: string;
  title: string;
  description: string;
  category: SchemeCategory;
  country: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  deadline?: string;
  website: string;
  isActive: boolean;
}

export type SchemeCategory = 
  | 'education'
  | 'farmers'
  | 'business'
  | 'women'
  | 'housing'
  | 'health'
  | 'employment'
  | 'disability'
  | 'elderly'
  | 'youth';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
}

export interface Reminder {
  id: string;
  userId: string;
  schemeId: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}