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
        // Connect button
        const connectBtn = document.getElementById('connectBtn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                this.connectToSchemeGenie();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettings();
            });
        }

        // Stop filling button
        const stopFillingBtn = document.getElementById('stopFillingBtn');
        if (stopFillingBtn) {
            stopFillingBtn.addEventListener('click', () => {
                this.stopFilling();
            });
        }

        // Fill another button
        const fillAnotherBtn = document.getElementById('fillAnotherBtn');
        if (fillAnotherBtn) {
            fillAnotherBtn.addEventListener('click', () => {
                this.setState('connected');
            });
        }

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.setState('connected');
            });
        }

        // Help and feedback links
        const helpLink = document.getElementById('helpLink');
        if (helpLink) {
            helpLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openHelp();
            });
        }

        const feedbackLink = document.getElementById('feedbackLink');
        if (feedbackLink) {
            feedbackLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openFeedback();
            });
        }
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
                    <button class="btn btn-primary btn-small fill-form-btn" data-form-id="${form.id}">
                        <span class="btn-icon">✨</span>
                        Fill
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to fill buttons
        const fillButtons = formsList.querySelectorAll('.fill-form-btn');
        fillButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const formId = e.target.closest('.fill-form-btn').dataset.formId;
                this.fillForm(formId);
            });
        });
    }

    updatePageDetection() {
        const detectionIcon = document.getElementById('detectionIcon');
        const detectionStatus = document.getElementById('detectionStatus');
        const detectionUrl = document.getElementById('detectionUrl');

        if (!this.currentTab) return;

        const url = this.currentTab.url;
        const title = this.currentTab.title?.toLowerCase() || '';
        const isFormDetected = this.isFormPage(url, title);

        if (detectionIcon) {
            detectionIcon.textContent = isFormDetected ? '✅' : '🔍';
        }

        if (detectionStatus) {
            detectionStatus.textContent = isFormDetected 
                ? 'Form page detected' 
                : 'No forms detected';
        }

        if (detectionUrl) {
            detectionUrl.textContent = url;
        }
    }

    isFormPage(url, title) {
        if (!url || !title) return false;
        
        const formPatterns = [
            'nmms-form.netlify.app',
            'pmrf-form.netlify.app',
            '127.0.0.1:5500/extension/NMMS.html',
            '127.0.0.1:5500/extension/PMRF.html',
            'nmms', 
            'pmrf', 
            'scholarship', 
            'fellowship', 
            'form', 
            'application'
        ];
        
        return formPatterns.some(pattern => 
            url.toLowerCase().includes(pattern) || 
            title.toLowerCase().includes(pattern)
        );
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
                this.showError('Failed to start form filling. Make sure you are on a form page.');
            }

        } catch (error) {
            console.error('Popup: Error filling form:', error);
            this.showError('Error: Make sure you are on the correct form page and refresh the page');
        }
    }

    startFillingAnimation() {
        // Simulate filling progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    this.setState('success');
                }, 500);
            }
            this.updateFillingProgress(progress);
        }, 800);
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

    connectToSchemeGenie() {
        // For demo purposes, just set the connected state
        this.setState('connected');
    }

    openSettings() {
        alert('Settings feature coming soon!');
    }

    openHelp() {
        alert('Help documentation coming soon!');
    }

    openFeedback() {
        alert('Feedback form coming soon!');
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