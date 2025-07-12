// SchemeGenie Popup Script
class SchemeGeniePopup {
    constructor() {
        this.currentState = 'loading';
        this.availableForms = [];
        this.currentTab = null;
        this.fillingProgress = 0;
        this.totalFields = 0;
        this.filledFields = 0;
        
        this.init();
    }

    async init() {
        console.log('Popup: Initializing...');
        
        // Get current tab
        this.currentTab = await this.getCurrentTab();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check connection and load data
        await this.checkConnectionAndLoadData();
        
        // Update page detection
        this.updatePageDetection();
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Settings button
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:5173/settings' });
        });

        // Stop filling button
        document.getElementById('stopFillingBtn')?.addEventListener('click', () => {
            this.stopFilling();
        });

        // Fill another button
        document.getElementById('fillAnotherBtn')?.addEventListener('click', () => {
            this.setState('connected');
        });

        // Retry button
        document.getElementById('retryBtn')?.addEventListener('click', () => {
            this.setState('connected');
        });

        // Help and feedback links
        document.getElementById('helpLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'http://localhost:5173/help' });
        });

        document.getElementById('feedbackLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'http://localhost:5173/feedback' });
        });
    }

    async getCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab;
    }

    async checkConnectionAndLoadData() {
        try {
            console.log('Popup: Checking connection...');
            
            // Check if user is connected to SchemeGenie
            const connectionResult = await chrome.runtime.sendMessage({
                action: 'checkConnection'
            });

            if (!connectionResult.success || !connectionResult.data.connected) {
                this.setState('notConnected');
                return;
            }

            // Get user data
            const userResult = await chrome.runtime.sendMessage({
                action: 'getUserData'
            });

            if (userResult.success && userResult.data) {
                this.updateUserInfo(userResult.data);
            }

            // Get available forms
            const formsResult = await chrome.runtime.sendMessage({
                action: 'getApprovedForms'
            });

            if (formsResult.success) {
                this.availableForms = formsResult.data || [];
                this.updateFormsList();
                this.setState('connected');
            } else {
                this.setState('notConnected');
            }

        } catch (error) {
            console.error('Popup: Error checking connection:', error);
            this.setState('notConnected');
        }
    }

    updateUserInfo(userData) {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) userName.textContent = userData.fullName || 'Demo User';
        if (userEmail) userEmail.textContent = userData.email || 'demo@schemegenie.com';
        if (userAvatar) {
            const initials = (userData.fullName || 'Demo User')
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            userAvatar.textContent = initials;
        }
    }

    updateFormsList() {
        const formsList = document.getElementById('formsList');
        const formsCount = document.getElementById('formsCount');
        
        if (!formsList) return;

        if (formsCount) {
            formsCount.textContent = this.availableForms.length;
        }

        if (this.availableForms.length === 0) {
            formsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">No forms available. Complete your SchemeGenie profile to get started.</div>
                </div>
            `;
            return;
        }

        formsList.innerHTML = this.availableForms.map(form => `
            <div class="form-item">
                <div class="form-info">
                    <div class="form-name">${form.name}</div>
                    <div class="form-details">${form.completeness}% complete • ${form.status}</div>
                </div>
                <div class="form-actions">
                    <button class="btn btn-primary btn-small" onclick="popup.fillForm('${form.id}')">
                        <span class="btn-icon">✨</span>
                        Fill
                    </button>
                </div>
            </div>
        `).join('');
    }

    updatePageDetection() {
        const detectionIcon = document.getElementById('detectionIcon');
        const detectionStatus = document.getElementById('detectionStatus');
        const detectionUrl = document.getElementById('detectionUrl');

        if (!this.currentTab) return;

        const url = this.currentTab.url;
        const isGovernmentSite = this.isGovernmentSite(url);

        if (detectionIcon) {
            detectionIcon.textContent = isGovernmentSite ? '✅' : '🔍';
        }

        if (detectionStatus) {
            detectionStatus.textContent = isGovernmentSite 
                ? 'Government form detected' 
                : 'No forms detected';
        }

        if (detectionUrl) {
            detectionUrl.textContent = url;
        }
    }

    isGovernmentSite(url) {
        if (!url) return false;
        
        const govPatterns = [
            'localhost',
            '127.0.0.1',
            '.gov',
            '.gov.in',
            'scholarships.gov.in',
            'pmrf.gov.in'
        ];
        
        return govPatterns.some(pattern => url.includes(pattern));
    }

    async fillForm(formId) {
        try {
            console.log('Popup: Starting form fill for:', formId);
            
            const form = this.availableForms.find(f => f.id === formId);
            if (!form) {
                this.showError('Form not found');
                return;
            }

            // Update UI to show filling state
            this.setState('filling');
            this.updateFillingInfo(form.name, 0, 0);

            // Send message to content script to fill form
            const response = await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'fillForm',
                formId: formId,
                formData: form.formData
            });

            if (response && response.success) {
                console.log('Popup: Form filling started successfully');
                this.startFillingAnimation();
            } else {
                this.showError('Failed to start form filling');
            }

        } catch (error) {
            console.error('Popup: Error filling form:', error);
            this.showError('Error: ' + error.message);
        }
    }

    startFillingAnimation() {
        // Simulate filling progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.setState('success');
                }, 500);
            }
            this.updateFillingProgress(progress);
        }, 300);
    }

    updateFillingInfo(formName, filled, total) {
        const currentFormName = document.getElementById('currentFormName');
        const fillingProgressText = document.getElementById('fillingProgressText');
        
        if (currentFormName) currentFormName.textContent = formName;
        if (fillingProgressText) fillingProgressText.textContent = `${filled}/${total} fields`;
    }

    updateFillingProgress(percentage) {
        const fillingProgress = document.getElementById('fillingProgress');
        const fillingPercentage = document.getElementById('fillingPercentage');
        const fillingStatus = document.getElementById('fillingStatus');
        
        if (fillingProgress) {
            fillingProgress.style.background = `conic-gradient(#f97316 ${percentage * 3.6}deg, #e5e7eb ${percentage * 3.6}deg)`;
        }
        
        if (fillingPercentage) {
            fillingPercentage.textContent = Math.round(percentage) + '%';
        }
        
        if (fillingStatus) {
            if (percentage < 30) {
                fillingStatus.textContent = 'Starting...';
            } else if (percentage < 70) {
                fillingStatus.textContent = 'Filling fields...';
            } else if (percentage < 100) {
                fillingStatus.textContent = 'Almost done...';
            } else {
                fillingStatus.textContent = 'Complete!';
            }
        }
    }

    async stopFilling() {
        try {
            await chrome.tabs.sendMessage(this.currentTab.id, {
                action: 'stopFilling'
            });
            this.setState('connected');
        } catch (error) {
            console.error('Popup: Error stopping form filling:', error);
        }
    }

    async refreshData() {
        this.setState('loading');
        await this.checkConnectionAndLoadData();
    }

    showError(message) {
        this.setState('error');
        const errorDescription = document.getElementById('errorDescription');
        if (errorDescription) {
            errorDescription.textContent = message;
        }
    }

    setState(newState) {
        console.log('Popup: Changing state from', this.currentState, 'to', newState);
        
        // Hide all states
        const states = ['loading', 'notConnected', 'connected', 'filling', 'success', 'error'];
        states.forEach(state => {
            const element = document.getElementById(state + 'State');
            if (element) {
                element.style.display = 'none';
            }
        });

        // Show current state
        const currentStateElement = document.getElementById(newState + 'State');
        if (currentStateElement) {
            currentStateElement.style.display = 'block';
            currentStateElement.classList.add('fade-in');
        }

        // Update status indicator
        this.updateStatusIndicator(newState);
        
        this.currentState = newState;
    }

    updateStatusIndicator(state) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (!statusDot || !statusText) return;

        switch (state) {
            case 'loading':
                statusDot.className = 'status-dot warning';
                statusText.textContent = 'Loading...';
                break;
            case 'notConnected':
                statusDot.className = 'status-dot error';
                statusText.textContent = 'Not Connected';
                break;
            case 'connected':
                statusDot.className = 'status-dot';
                statusText.textContent = 'Connected';
                break;
            case 'filling':
                statusDot.className = 'status-dot warning';
                statusText.textContent = 'Filling Form';
                break;
            case 'success':
                statusDot.className = 'status-dot';
                statusText.textContent = 'Success';
                break;
            case 'error':
                statusDot.className = 'status-dot error';
                statusText.textContent = 'Error';
                break;
        }
    }
}

// Initialize popup when DOM is loaded
let popup;
document.addEventListener('DOMContentLoaded', () => {
    popup = new SchemeGeniePopup();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fillingComplete') {
        popup.setState('success');
    } else if (message.action === 'fillingError') {
        popup.showError(message.data || 'Unknown error occurred');
    }
});