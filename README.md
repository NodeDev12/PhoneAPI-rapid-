# Phone and Email Validation API

This API provides services for parsing, validating, and cleaning phone numbers and email addresses. It utilizes external services to perform syntax checks, DNS checks, typo fixing, freemail checks for email addresses, and provides information about phone numbers, such as type and location.

## Setting Up the Project


1. Navigate to the 'src' directory:

    ```bash
    cd src
    ```

2. Install the required dependencies:

    ```bash
    npm install express express-session axios path
    ```

3. Run the Node.js server:

    ```bash
    node index.js
    ```

This will start the server, and you can now access the API endpoints as described below.

## Email Validation

### Endpoint

- **URL**: `https://community-neutrino-email-validate.p.rapidapi.com/email-validate`
- **Method**: POST

### Features
1. **Syntax Checks**: Validates if the email address is RFC822 / RFC2822 compliant.
2. **DNS Checks**: Verifies if the email address domain resolves correctly and has valid MX (mail exchanger) records.
3. **Typo Fixing**: Fixes common domain, TLD (top-level domain), and freemail email address typos.
4. **Freemail Check**: Determines if the email address is a freemail registered email address (i.e., not a commercial address).

### Phone Validation

### Endpoint

- **URL**: `https://neutrinoapi-phone-validate.p.rapidapi.com/phone-validate`
- **Method**: POST

### Features
1. **Syntax Checks**: Validates if the phone number is in the correct format.
2. **DNS Checks**: Verifies if the phone number is valid and has proper country codes.
3. **Type and Location Information**: Provides information about the type of phone number (e.g., mobile or landline) and its location.
4. **Formatting**: Reformat the phone number into local and international dialing formats.

## Integration with Mobile Applications

The validation services provided by this API are highly relevant to mobile applications, offering benefits such as:

- **User Registration and Login Verification**: Ensure accurate and usable contact information during user registration and login processes.

- **Enhancing User Experience in Forms**: Provide real-time feedback in mobile app forms, improving the user experience by assisting in the correction of input mistakes.

- **Contact Information Verification**: Validate and verify contact information entered by users within the mobile application.

## 'yersultan' User Information

In the login section, you can use the following credentials:
- **Username**: yersultan
- **Password**: 12345678

To access the admin page, use the following default credentials:
- **Username**: yersultan
- **Password**: 12345678

Feel free to create a new user with the username 'yersultan' as well.

### Rapid API Key

```bash
rapid_api_key='26beb044cbmshe1f334dd6a4877dp18eda9jsn9c9e1e0bdeb6'
