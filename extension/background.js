// SchemeGenie Extension Background Script
class SchemeGenieBackground {
    constructor() {
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.setupTabUpdateListener();
        
        // Handle extension lifecycle
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.handleFirstInstall();
            }
        });
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('Background: Received message:', message);
            
            switch (message.action) {
                case 'getUserData':
                    this.getUserData().then(sendResponse);
                    return true;
                
                case 'checkConnection':
                    this.checkSchemeGenieConnection().then(sendResponse);
                    return true;
                
                case 'getApprovedForms':
                    this.getApprovedForms().then(sendResponse);
                    return true;
                
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        });
    }

    setupTabUpdateListener() {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });
    }

    async handleFirstInstall() {
        // Set default demo data
        await chrome.storage.local.set({
            schemeGenieUser: {
                fullName: 'John Demo Student',
                email: 'demo@schemegenie.com',
                phone: '+91-9876543210',
                dateOfBirth: '2002-05-15',
                gender: 'male',
                fatherName: 'Robert Demo',
                motherName: 'Mary Demo',
                address: '123 Demo Street, Bangalore',
                state: 'Karnataka',
                district: 'Bangalore Urban',
                pincode: '560001',
                income: '25000',
                category: 'General',
                class: '12th',
                school: 'Demo High School',
                percentage: '92.5',
                bankAccount: '1234567890',
                ifscCode: 'SBIN0001234',
                // PMRF specific fields
                institute: 'Demo Institute of Technology',
                degree: 'B.Tech',
                cgpa: '9.2',
                proposalTitle: 'AI-based Research Proposal',
                summary: 'Research proposal summary will be provided separately.'
            }
        });
    }

    async handleTabUpdate(tabId, tab) {
        // Update badge to show extension is active
        await chrome.action.setBadgeText({
            tabId,
            text: '✓'
        });
        
        await chrome.action.setBadgeBackgroundColor({
            color: '#f97316'
        });
    }

    async getUserData() {
        try {
            const result = await chrome.storage.local.get(['schemeGenieUser']);
            return { success: true, data: result.schemeGenieUser || null };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async checkSchemeGenieConnection() {
        try {
            const userData = await this.getUserData();
            if (!userData.success || !userData.data) {
                return { success: false, error: 'Not logged in' };
            }
            
            return { success: true, data: { connected: true } };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getApprovedForms() {
        try {
            const demoForms = [
                {
                    id: 'nmms-2024',
                    name: 'National Means-cum-Merit Scholarship',
                    status: 'approved',
                    completeness: 100,
                    formData: {
                        fullName: 'John Demo Student',
                        email: 'demo@schemegenie.com',
                        phone: '+91-9876543210',
                        dateOfBirth: '2002-05-15',
                        gender: 'male',
                        fatherName: 'Robert Demo',
                        motherName: 'Mary Demo',
                        address: '123 Demo Street, Bangalore',
                        state: 'Karnataka',
                        district: 'Bangalore Urban',
                        pincode: '560001',
                        income: '25000',
                        category: 'General',
                        class: '12th',
                        school: 'Demo High School',
                        percentage: '92.5',
                        bankAccount: '1234567890',
                        ifscCode: 'SBIN0001234'
                    }
                },
                {
                    id: 'pmrf-2024',
                    name: 'Prime Minister Research Fellowship',
                    status: 'approved',
                    completeness: 95,
                    formData: {
                        fullName: 'John Demo Student',
                        email: 'demo@schemegenie.com',
                        phone: '+91-9876543210',
                        institute: 'Demo Institute of Technology',
                        degree: 'B.Tech',
                        cgpa: '9.2',
                        proposalTitle: 'AI-based Research Proposal',
                        summary: 'Research proposal summary will be provided separately.'
                    }
                }
            ];
            
            return { success: true, data: demoForms };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize background script
new SchemeGenieBackground();