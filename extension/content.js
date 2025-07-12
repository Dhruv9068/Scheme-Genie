// SchemeGenie Content Script - Enhanced Auto Form Filler
class SchemeGenieFormFiller {
    constructor() {
        this.isActive = false;
        this.currentFormData = null;
        this.filledFields = 0;
        this.totalFields = 0;
        this.fillingStopped = false;
        
        console.log('SchemeGenie Content Script: Initializing...');
        this.init();
    }

    init() {
        this.setupMessageListener();
        this.detectForms();
        this.addSchemeGenieIndicator();
        console.log('SchemeGenie Content Script: Ready on', window.location.href);
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('Content Script: Received message:', message);
            
            switch (message.action) {
                case 'fillForm':
                    console.log('Content Script: Starting form fill with data:', message.formData);
                    this.startFormFilling(message.formId, message.formData);
                    sendResponse({ success: true });
                    break;
                case 'stopFilling':
                    this.stopFormFilling();
                    sendResponse({ success: true });
                    break;
                case 'detectForms':
                    const forms = this.detectForms();
                    sendResponse({ forms });
                    break;
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
            return true;
        });
    }

    detectForms() {
        const forms = document.querySelectorAll('form');
        const detectedForms = [];
        const currentUrl = window.location.href.toLowerCase();
        const pageTitle = document.title.toLowerCase();
        const pageContent = document.body.textContent.toLowerCase();

        console.log('Content Script: Detecting forms on:', currentUrl);

        forms.forEach((form, index) => {
            const formInfo = this.analyzeForm(form, index, currentUrl, pageTitle, pageContent);
            if (formInfo.isGovernmentForm) {
                detectedForms.push(formInfo);
            }
        });

        console.log('Content Script: Detected forms:', detectedForms);
        return detectedForms;
    }

    analyzeForm(form, index, currentUrl, pageTitle, pageContent) {
        const inputs = form.querySelectorAll('input, select, textarea');
        const formInfo = {
            index,
            isGovernmentForm: false,
            type: 'unknown',
            fields: [],
            confidence: 0
        };

        // Enhanced detection for your specific Netlify forms and local forms
        if (currentUrl.includes('nmms-form.netlify.app') || 
            currentUrl.includes('127.0.0.1:5500/extension/nmms.html') ||
            pageTitle.includes('nmms') || 
            pageContent.includes('nmms') ||
            pageContent.includes('national means') || 
            pageContent.includes('merit scholarship')) {
            formInfo.type = 'nmms';
            formInfo.confidence = 100;
            formInfo.isGovernmentForm = true;
            console.log('Content Script: Detected NMMS form');
        } else if (currentUrl.includes('pmrf-form.netlify.app') || 
                   currentUrl.includes('127.0.0.1:5500/extension/pmrf.html') ||
                   pageTitle.includes('pmrf') || 
                   pageContent.includes('pmrf') || 
                   pageContent.includes('prime minister') || 
                   pageContent.includes('research fellowship')) {
            formInfo.type = 'pmrf';
            formInfo.confidence = 100;
            formInfo.isGovernmentForm = true;
            console.log('Content Script: Detected PMRF form');
        } else if (inputs.length > 5) {
            // Generic form detection
            formInfo.confidence = 50;
            formInfo.isGovernmentForm = true;
            console.log('Content Script: Detected generic form');
        }

        inputs.forEach(input => {
            formInfo.fields.push({
                element: input,
                type: input.type,
                name: input.name || input.id,
                id: input.id,
                required: input.required
            });
        });

        return formInfo;
    }

    async startFormFilling(formId, formData) {
        try {
            console.log('Content Script: Starting form filling process...');
            this.isActive = true;
            this.fillingStopped = false;
            this.currentFormData = formData;
            
            // Show loading message
            this.showMessage('🧞‍♂️ SchemeGenie is filling the form...', '#f97316');
            
            // Find all fillable fields
            const allFields = document.querySelectorAll('input:not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
            console.log('Content Script: Found', allFields.length, 'fields to process');
            
            this.totalFields = allFields.length;
            this.filledFields = 0;

            // Fill fields with delay for visual effect
            for (let i = 0; i < allFields.length; i++) {
                if (this.fillingStopped) break;
                
                const field = allFields[i];
                const value = this.getValueForField(field, formData);
                
                if (value) {
                    await this.fillField(field, value);
                    this.filledFields++;
                    console.log(`Content Script: Filled field ${field.name || field.id} with value:`, value);
                    
                    // Add visual feedback
                    this.highlightField(field);
                    
                    // Small delay for better UX
                    await this.delay(800);
                }
            }

            this.showSuccessMessage();
            this.notifyPopup('fillingComplete');
            
        } catch (error) {
            console.error('Form filling failed:', error);
            this.showErrorMessage(error.message);
            this.notifyPopup('fillingError', error.message);
        } finally {
            this.isActive = false;
        }
    }

    getValueForField(field, userData) {
        const name = (field.name || '').toLowerCase();
        const id = (field.id || '').toLowerCase();
        const placeholder = (field.placeholder || '').toLowerCase();
        const label = this.getFieldLabel(field)?.toLowerCase() || '';
        const searchText = `${name} ${id} ${placeholder} ${label}`;
        
        console.log('Content Script: Mapping field:', searchText, 'Type:', field.type);
        
        // Enhanced field mappings for better matching
        const fieldMappings = {
            // Personal Information - exact matches first
            'fullname': userData.fullName,
            'full_name': userData.fullName,
            'name': userData.fullName,
            'student_name': userData.fullName,
            'applicant_name': userData.fullName,
            'email': userData.email,
            'email_address': userData.email,
            'phone': userData.phone,
            'mobile': userData.phone,
            'mobile_number': userData.phone,
            'phone_number': userData.phone,
            'contact': userData.phone,
            'dateofbirth': userData.dateOfBirth,
            'date_of_birth': userData.dateOfBirth,
            'dob': userData.dateOfBirth,
            'birth_date': userData.dateOfBirth,
            'birthdate': userData.dateOfBirth,
            'gender': userData.gender,
            'sex': userData.gender,
            'fathername': userData.fatherName,
            'father_name': userData.fatherName,
            'father': userData.fatherName,
            'mothername': userData.motherName,
            'mother_name': userData.motherName,
            'mother': userData.motherName,
            'address': userData.address,
            'full_address': userData.address,
            'residential_address': userData.address,
            'state': userData.state,
            'state_name': userData.state,
            'pincode': userData.pincode,
            'pin_code': userData.pincode,
            'postal_code': userData.pincode,
            'zip': userData.pincode,
            'district': userData.district,
            'district_name': userData.district,
            'category': userData.category,
            'caste_category': userData.category,
            'social_category': userData.category,
            
            // Education
            'class': userData.class,
            'current_class': userData.class,
            'standard': userData.class,
            'grade': userData.class,
            'school': userData.school,
            'school_name': userData.school,
            'institution': userData.school,
            'percentage': userData.percentage,
            'marks': userData.percentage,
            'score': userData.percentage,
            'institute': userData.institute,
            'college': userData.institute,
            'university': userData.institute,
            'degree': userData.degree,
            'course': userData.degree,
            'qualification': userData.degree,
            'cgpa': userData.cgpa,
            'gpa': userData.cgpa,
            'grade_point': userData.cgpa,
            
            // Financial
            'bankaccount': userData.bankAccount,
            'bank_account': userData.bankAccount,
            'account_number': userData.bankAccount,
            'account': userData.bankAccount,
            'ifsc': userData.ifscCode,
            'ifsc_code': userData.ifscCode,
            'bank_code': userData.ifscCode,
            'income': userData.income,
            'family_income': userData.income,
            'annual_income': userData.income,
            
            // PMRF specific
            'proposaltitle': userData.proposalTitle,
            'proposal_title': userData.proposalTitle,
            'research_title': userData.proposalTitle,
            'title': userData.proposalTitle,
            'summary': userData.summary,
            'proposal_summary': userData.summary,
            'research_summary': userData.summary,
            'abstract': userData.summary
        };

        // Find exact match first
        for (const [pattern, value] of Object.entries(fieldMappings)) {
            if (searchText.includes(pattern) && value) {
                console.log('Content Script: Exact match found:', pattern, 'with value:', value);
                return this.formatValueForField(value, field.type);
            }
        }

        // Fallback for partial matches
        if (searchText.includes('name') && !searchText.includes('father') && !searchText.includes('mother') && !searchText.includes('school')) {
            return userData.fullName;
        }

        return null;
    }

    formatValueForField(value, fieldType) {
        if (!value || value === 'undefined') return null;
        
        switch (fieldType) {
            case 'email':
                return value.includes('@') ? value : null;
            case 'tel':
            case 'phone':
                return value.replace(/[^\d+]/g, '');
            case 'date':
                if (value.includes('-')) {
                    return value;
                }
                break;
            case 'number':
                return value.toString().replace(/[^\d.]/g, '');
            default:
                return value.toString();
        }
    }

    async fillField(element, value) {
        try {
            // Scroll element into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await this.delay(200);
            
            // Focus the element
            element.focus();
            
            // Clear existing value
            element.value = '';
            
            if (element.tagName === 'SELECT') {
                this.selectOption(element, value);
            } else {
                // Type the value character by character for better visual effect
                for (let i = 0; i < value.length; i++) {
                    element.value += value[i];
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                    await this.delay(50); // Small delay between characters
                }
            }
            
            // Trigger events
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            
            console.log('Content Script: Successfully filled field with value:', value);
        } catch (error) {
            console.error('Content Script: Error filling field:', error);
        }
    }

    selectOption(selectElement, value) {
        const options = Array.from(selectElement.options);
        
        // Try exact match first
        let option = options.find(opt => 
            opt.value.toLowerCase() === value.toLowerCase() ||
            opt.text.toLowerCase() === value.toLowerCase()
        );
        
        // Try partial match
        if (!option) {
            option = options.find(opt => 
                opt.text.toLowerCase().includes(value.toLowerCase()) ||
                value.toLowerCase().includes(opt.text.toLowerCase())
            );
        }
        
        if (option) {
            selectElement.value = option.value;
            option.selected = true;
            console.log('Content Script: Selected option:', option.text);
        }
    }

    getFieldLabel(input) {
        // Try to find label for the input field
        if (input.labels && input.labels.length > 0) {
            return input.labels[0].textContent;
        }
        
        // Look for label with for attribute
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
            return label.textContent;
        }
        
        // Look for nearby text
        const parent = input.parentElement;
        if (parent) {
            const text = parent.textContent.replace(input.value || '', '').trim();
            if (text.length > 0 && text.length < 100) {
                return text;
            }
        }
        
        return '';
    }

    highlightField(element) {
        // Add temporary highlight effect
        const originalStyle = element.style.cssText;
        element.style.cssText += `
            border: 3px solid #10b981 !important;
            background-color: #f0fdf4 !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.6) !important;
        `;
        
        setTimeout(() => {
            element.style.cssText = originalStyle;
        }, 3000);
    }

    stopFormFilling() {
        this.fillingStopped = true;
        this.isActive = false;
        this.showInfoMessage('Form filling stopped by user');
    }

    addSchemeGenieIndicator() {
        // Add a small indicator to show SchemeGenie is active
        const indicator = document.createElement('div');
        indicator.id = 'schemegenie-indicator';
        indicator.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
                display: none;
                align-items: center;
                gap: 6px;
            ">
                <span style="font-size: 14px;">🧞‍♂️</span>
                <span>SchemeGenie Ready</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Show indicator briefly when extension is loaded
        const indicatorElement = indicator.firstElementChild;
        indicatorElement.style.display = 'flex';
        
        setTimeout(() => {
            indicatorElement.style.display = 'none';
        }, 3000);
    }

    showSuccessMessage() {
        this.showMessage('✅ Form filled successfully! ' + this.filledFields + ' fields completed.', '#10b981');
    }

    showErrorMessage(message) {
        this.showMessage(`❌ Error: ${message}`, '#ef4444');
    }

    showInfoMessage(message) {
        this.showMessage(`ℹ️ ${message}`, '#3b82f6');
    }

    showMessage(text, color) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            background: ${color};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            max-width: 300px;
            word-wrap: break-word;
        `;
        message.textContent = text;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }

    notifyPopup(action, data = null) {
        chrome.runtime.sendMessage({
            action,
            data
        }).catch(() => {
            // Ignore errors if popup is not open
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the form filler when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SchemeGenieFormFiller();
    });
} else {
    new SchemeGenieFormFiller();
}