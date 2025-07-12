import emailjs from 'emailjs-com';
import { EMAILJS_CONFIG } from '../utils/constants';

export class EmailService {
  constructor() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }

  async sendReminderEmail(
    userEmail: string,
    userName: string,
    schemeTitle: string,
    deadline: string,
    additionalInfo?: string
  ): Promise<boolean> {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        scheme_title: schemeTitle,
        deadline: deadline,
        additional_info: additionalInfo || '',
        from_name: 'SchemeGenie',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        message: 'Welcome to SchemeGenie! We\'re here to help you discover and apply for benefit schemes.',
        from_name: 'SchemeGenie Team',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('Welcome email failed:', error);
      return false;
    }
  }

  async sendSchemeNotification(
    userEmail: string,
    userName: string,
    schemes: any[]
  ): Promise<boolean> {
    try {
      const schemesList = schemes.map(scheme => 
        `• ${scheme.title} - Deadline: ${scheme.deadline || 'No deadline'}`
      ).join('\n');

      const templateParams = {
        to_email: userEmail,
        to_name: userName,
        message: `New schemes matching your profile:\n\n${schemesList}`,
        from_name: 'SchemeGenie',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return response.status === 200;
    } catch (error) {
      console.error('Scheme notification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();