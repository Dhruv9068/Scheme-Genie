# SchemeGenie Chrome Extension

A powerful Chrome extension that automatically fills government scholarship and benefit application forms with your saved profile data.

## Features

- **Smart Form Detection**: Automatically detects government forms on any website
- **Intelligent Field Mapping**: Maps your profile data to form fields using advanced pattern matching
- **Visual Feedback**: Shows real-time progress with animations and highlights
- **Multiple Form Support**: Works with NMMS, PMRF, and other scholarship forms
- **Universal Compatibility**: Works on any URL, not limited to specific government domains

## Installation

1. Download or clone this extension folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. Add your logo.png file to the extension folder
6. The extension is now ready to use!

## Usage

1. **Visit any form page** (like NMMS.html or PMRF.html)
2. **Click the SchemeGenie extension icon** in your browser toolbar
3. **Select a form** from the available options
4. **Click "Fill"** to automatically fill all form fields
5. **Watch the magic happen** as fields are filled with your data

## Demo Forms

The extension comes with two demo forms for testing:

- **NMMS.html** - National Means-cum-Merit Scholarship form
- **PMRF.html** - Prime Minister Research Fellowship form

## Technical Details

### Files Structure
```
extension/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for background tasks
├── content.js         # Content script for form filling
├── content.css        # Styles for form filling animations
├── popup.html         # Extension popup interface
├── popup.css          # Popup styling
├── popup.js           # Popup functionality
├── NMMS.html          # Demo NMMS form
├── PMRF.html          # Demo PMRF form
└── logo.png           # Extension logo (add your own)
```

### Key Features

1. **Universal Form Detection**: Works on any website with forms
2. **Smart Field Mapping**: Uses multiple strategies to match fields:
   - Field name matching
   - ID matching
   - Placeholder text matching
   - Label text matching
   - Partial text matching

3. **Demo Data**: Pre-loaded with sample data for immediate testing:
   - Personal information (name, email, phone, etc.)
   - Educational details (school, percentage, etc.)
   - Financial information (bank account, income, etc.)
   - Research-specific fields (for PMRF forms)

4. **Visual Feedback**: 
   - Real-time progress indicators
   - Field highlighting during filling
   - Success/error notifications
   - Animated progress circles

## Customization

### Adding New Forms
To support new forms, update the field mappings in `content.js`:

```javascript
const fieldMappings = {
    'newfield': userData.newFieldValue,
    // Add more mappings as needed
};
```

### Updating Demo Data
Modify the demo data in `background.js`:

```javascript
schemeGenieUser: {
    fullName: 'Your Name',
    email: 'your.email@example.com',
    // Update other fields as needed
}
```

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Permissions

The extension requires these permissions:
- `activeTab`: To interact with the current tab
- `storage`: To save user preferences and demo data
- `scripting`: To inject content scripts
- `host_permissions`: To work on all websites

## Security

- No data is sent to external servers
- All data is stored locally in the browser
- No tracking or analytics
- Open source and transparent

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure the extension has proper permissions
3. Verify that forms have standard HTML input elements
4. Test with the included demo forms first

## License

This extension is provided as-is for demonstration purposes.