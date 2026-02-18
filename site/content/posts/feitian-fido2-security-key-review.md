---
title: 'Feitian FIDO2 Security Key Review'
description: 'Review of Feitian ePass K40 FIDO2 Security key with USB-C and NFC support, setup instructions, and insights on FIDO2 passwordless authentication.'
pubDate: 2023-04-15
tags: [security, fido2, review, passwordless]
featured: false
---

## Disclaimer

_I purchased this product with my own funds. All opinions expressed in this review are my own and are not influenced by the manufacturer. I strive to provide an honest and unbiased assessment of the product._

## How I Got the Key

My journey with the Feitian ePass K40 started when I was exploring options for FIDO2 security keys that support both USB-C and NFC. As someone deeply invested in identity security and passwordless authentication, I wanted a key that would work seamlessly across my devices — from my laptop with USB-C to my phone via NFC.

After researching various options, the Feitian ePass K40 caught my attention. Feitian is a member of the **Microsoft Intelligent Security Association (MISA)** and their keys are listed as compatible with Azure AD (now Entra ID) FIDO2 passwordless authentication. This gave me confidence that the key would work well in the Microsoft ecosystem.

![Feitian ePass K40 security key](/images/posts/feitian-fido2-security-key-review/k40-key.jpg)

## What is FIDO2?

Before diving into the review, let me briefly explain what FIDO2 is for those who may be unfamiliar.

**FIDO2** (Fast Identity Online 2) is an open authentication standard developed by the **FIDO Alliance** in collaboration with the **World Wide Web Consortium (W3C)**. It consists of two main components:

- **WebAuthn (Web Authentication)** — A web API that allows web applications to use public key cryptography for authentication
- **CTAP2 (Client to Authenticator Protocol 2)** — A protocol that enables external authenticators (like security keys) to communicate with browsers and platforms

Together, these standards enable **passwordless authentication** — meaning you can sign in to websites and services without ever typing a password. Instead, authentication is based on:

1. Something you **have** (the security key)
2. Something you **know** (a PIN) or something you **are** (biometrics)

This is fundamentally more secure than passwords because:

- The cryptographic keys are unique to each site, preventing phishing
- The private key never leaves the security key
- There is no shared secret that can be stolen from a server

## Setting Up the PIN

Before you can use the Feitian ePass K40, you need to set up a PIN on the device. There are several ways to do this:

### Using Feitian SK Manager

Feitian provides their own management tool called **SK Manager** for configuring their security keys:

1. Download and install the Feitian SK Manager application
2. Insert the K40 into your USB-C port
3. Open SK Manager and select the connected key
4. Navigate to the PIN management section
5. Set your desired PIN (must be at least 4 characters, recommended 6+)
6. Confirm the PIN

![Setting up PIN via SK Manager](/images/posts/feitian-fido2-security-key-review/sk-manager-pin.jpg)

### Using Windows Settings

You can also set up the PIN directly through Windows:

1. Open **Settings** > **Accounts** > **Sign-in options**
2. Under **Security key**, click **Manage**
3. Insert your security key and touch the key when prompted
4. Click **Set PIN** or **Change PIN**
5. Enter your desired PIN and confirm

![Setting up PIN via Windows Settings](/images/posts/feitian-fido2-security-key-review/windows-pin-setup.jpg)

### Using Chrome Browser

Chrome also provides a way to manage your security key:

1. Open Chrome and navigate to `chrome://settings/securityKeys`
2. Click **Set up PIN**
3. Insert your security key
4. Touch the key when prompted
5. Enter and confirm your PIN

![Setting up PIN via Chrome](/images/posts/feitian-fido2-security-key-review/chrome-pin-setup.jpg)

## Adding the Key to Azure AD / Entra ID as MFA

Now for the most important part — setting up the Feitian ePass K40 as a FIDO2 security key for Azure AD (now Microsoft Entra ID) passwordless authentication. Here are the step-by-step instructions:

### Prerequisites

Before you begin, ensure that:

- Your organization has enabled FIDO2 security keys as an authentication method in the Entra admin center
- Your account is eligible for FIDO2 registration (check with your IT admin)
- You have a supported browser (Edge, Chrome, or Firefox)

### Step-by-Step Setup

1. **Navigate to My Security Info**
   - Go to [https://mysignins.microsoft.com/security-info](https://mysignins.microsoft.com/security-info)
   - Sign in with your existing credentials

2. **Add a new sign-in method**
   - Click **+ Add sign-in method**
   - Select **Security key** from the dropdown
   - Choose **USB device**

3. **Insert and activate the key**
   - Insert the Feitian ePass K40 into your USB-C port
   - When prompted by the browser, touch the security key
   - Enter your PIN when asked

4. **Touch the key to create credentials**
   - The browser will ask you to touch the security key again to create the FIDO2 credential
   - Touch the key and wait for confirmation

5. **Name your security key**
   - Give your security key a recognizable name (e.g., "Feitian K40 - Primary")
   - Click **Done**

6. **Verify the registration**
   - You should now see the security key listed in your security info
   - Test it by signing out and signing back in using the **Sign in with a security key** option

### Using NFC for Mobile Authentication

The K40 also supports NFC, which means you can use it with your smartphone:

1. Open your browser on your phone and navigate to a sign-in page
2. Select **Sign in with a security key**
3. Choose **NFC device** when prompted
4. Hold the K40 against the NFC reader on your phone
5. Enter your PIN when prompted
6. Touch or hold the key again to confirm

## Overall Impressions

The Feitian ePass K40 is a solid FIDO2 security key that delivers on its core promises:

- **USB-C and NFC** support makes it versatile across devices
- **Build quality** is good — it feels durable and well-made
- **Compatibility** with Azure AD/Entra ID is seamless
- **Setup** is straightforward with multiple options for PIN configuration
- **Performance** is responsive — authentication is quick via both USB and NFC

If you are looking for an affordable FIDO2 security key that works well with the Microsoft ecosystem, the Feitian ePass K40 is a great choice.

## Useful Links

- [Feitian Technologies](https://www.ftsafe.com/)
- [Microsoft Intelligent Security Association (MISA)](https://www.microsoft.com/en-us/security/business/intelligent-security-association)
- [FIDO Alliance](https://fidoalliance.org/)
- [Microsoft Entra ID - FIDO2 Security Keys](https://learn.microsoft.com/en-us/entra/identity/authentication/concept-authentication-passwordless#fido2-security-keys)
- [Set up a Security Key as your verification method](https://support.microsoft.com/en-us/account-billing/set-up-a-security-key-as-your-verification-method-2911cacd-efa5-4593-ae22-e09ae14c6698)
