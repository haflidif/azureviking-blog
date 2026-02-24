---
title: 'Privileged Access Groups (Preview)'
slug: 'privileged-access-groups-preview'
description: 'Learn how to create and manage Privileged Access Groups in Entra ID, assign roles, and test permissions for enhanced security and streamlined access control.'
pubDate: 2022-10-15
tags: [security, entra-id, pim, identity]
category: blog
featured: false
coverImage: '/images/posts/privileged-access-groups/image.png'
---

## TL;DR

Privileged Access Groups in Microsoft Entra ID (formerly Azure AD) allow you to assign Azure AD roles and Azure resource roles to groups, and then use Privileged Identity Management (PIM) to manage just-in-time, eligible access to those groups. This simplifies role management and enhances security by reducing standing access.

## Overview

Managing privileged access at scale is one of the most critical challenges in identity security. Traditionally, you would assign roles directly to individual users and manage their PIM eligibility one by one. As your organization grows, this approach becomes increasingly difficult to manage and audit.

**Privileged Access Groups** solve this problem by allowing you to:

- Create a group that is eligible for one or more privileged roles
- Assign users as eligible **members** or **owners** of the group
- When a user activates their group membership through PIM, they automatically receive all the roles assigned to the group
- All activations are audited and can require approval, justification, and MFA

This approach significantly reduces the number of individual role assignments you need to manage and provides a cleaner, more auditable access model.

## Step-by-Step Guide

### Step 1: Create an Entra ID Group with Role Assignment Capability

First, we need to create a security group that is enabled for role assignment. This is a special type of group that can be assigned Azure AD roles.

1. Navigate to the [Microsoft Entra admin center](https://entra.microsoft.com)
2. Go to **Identity** > **Groups** > **All groups**
3. Click **New group**
4. Set the **Group type** to **Security**
5. Enter a **Group name** (e.g., "PAG-KeyVault-Admins")
6. Enter a **Group description**
7. Set **Azure AD roles can be assigned to the group** to **Yes**
8. Set **Membership type** to **Assigned**
9. Click **Create**

![Creating a new security group with role assignment](/azureviking-blog/images/posts/privileged-access-groups/image.png)

> **Important:** The "Azure AD roles can be assigned to the group" setting can only be set during group creation and cannot be changed afterward. Make sure to enable this when creating the group.

![Group creation confirmation](/azureviking-blog/images/posts/privileged-access-groups/image-1.png)

### Step 2: Enable PIM for the Group

Now we need to enable Privileged Identity Management for the newly created group.

1. Navigate to **Identity Governance** > **Privileged Identity Management**
2. Click **Groups** in the left menu
3. Click **Discover groups**
4. Find and select the group you just created ("PAG-KeyVault-Admins")
5. Click **Manage**

![Discovering the group in PIM](/azureviking-blog/images/posts/privileged-access-groups/image-2.png)

The group should now appear in the PIM Groups list, and you can manage its membership and ownership assignments through PIM.

![Group enabled in PIM](/azureviking-blog/images/posts/privileged-access-groups/image-3.png)

### Step 3: Assign Owner Role to the Group

Assign an owner to the group who will be responsible for managing the group and approving activation requests.

1. In PIM, select the group
2. Click **Assignments** > **Add assignments**
3. Select **Owner** as the role
4. Click **Select members** and choose the user who should be the group owner
5. Click **Next**
6. Choose the assignment type (**Active** for permanent ownership, **Eligible** for just-in-time ownership)
7. Click **Assign**

![Adding an owner assignment](/azureviking-blog/images/posts/privileged-access-groups/image-4.png)

![Selecting the owner](/azureviking-blog/images/posts/privileged-access-groups/image-5.png)

### Step 4: Assign Key Vault Administrator Role to the Group

Now assign the Azure role (Key Vault Administrator) to the group. This is the role that members will receive when they activate their group membership.

1. Navigate to the Azure portal
2. Go to the **Key Vault** resource (or the scope where you want to assign the role)
3. Click **Access control (IAM)**
4. Click **Add** > **Add role assignment**
5. Search for and select **Key Vault Administrator**
6. Click **Next**
7. Select **Group** and find "PAG-KeyVault-Admins"
8. Click **Review + assign**

![Assigning Key Vault Administrator role to the group](/azureviking-blog/images/posts/privileged-access-groups/image-6.png)

![Selecting the group for role assignment](/azureviking-blog/images/posts/privileged-access-groups/image-7.png)

### Step 5: Create Eligible Assignments for Group Members

Now we set up eligible membership assignments so that users can activate their group membership through PIM when they need access.

1. Go back to **PIM** > **Groups** > select your group
2. Click **Assignments** > **Add assignments**
3. Select **Member** as the role
4. Click **Select members** and choose the users who should have eligible access
5. Click **Next**
6. Set the assignment type to **Eligible**
7. Configure the duration (e.g., 1 year)
8. Click **Assign**

![Adding eligible member assignments](/azureviking-blog/images/posts/privileged-access-groups/image-8.png)

![Selecting eligible members](/azureviking-blog/images/posts/privileged-access-groups/image-9.png)

![Configuring eligible assignment settings](/azureviking-blog/images/posts/privileged-access-groups/image-10.png)

### Step 6: Configure PIM Settings (Optional but Recommended)

You can customize the PIM settings for the group to require approval, MFA, justification, and more.

1. In PIM, select the group
2. Click **Settings**
3. Select **Member** role
4. Configure the desired settings:
   - **Activation maximum duration** — How long the activation lasts (e.g., 8 hours)
   - **Require justification on activation** — Require users to provide a reason
   - **Require MFA on activation** — Enforce MFA when activating
   - **Require approval to activate** — Require an approver to approve the activation
5. Click **Update**

![PIM settings configuration](/azureviking-blog/images/posts/privileged-access-groups/image-11.png)

![PIM approval settings](/azureviking-blog/images/posts/privileged-access-groups/image-12.png)

## Testing the Setup

Now let's test the setup by having a user activate their eligible group membership.

### Activating Group Membership

1. Sign in as the test user who has an eligible membership
2. Navigate to [PIM](https://entra.microsoft.com/#view/Microsoft_Azure_PIMCommon/ActivationMenuBlade/~/aadgroup)
3. Under **Groups**, you should see the eligible assignment
4. Click **Activate**

![User view of eligible group assignment](/azureviking-blog/images/posts/privileged-access-groups/image-13.png)

5. Provide a **justification** for the activation
6. Set the **duration** (within the configured maximum)
7. Complete **MFA** if required
8. Click **Activate**

![Activation dialog with justification](/azureviking-blog/images/posts/privileged-access-groups/image-14.png)

### Verifying Access

After activation, verify that the user has the expected permissions:

1. Navigate to the Key Vault in the Azure portal
2. Try to access secrets, keys, or certificates
3. The user should now have Key Vault Administrator permissions

![Activation successful](/azureviking-blog/images/posts/privileged-access-groups/image-15.png)

![Verifying Key Vault access](/azureviking-blog/images/posts/privileged-access-groups/image-16.png)

### Checking the Audit Log

All PIM activations are logged and can be reviewed:

1. In PIM, select the group
2. Click **Audit** to see the activation history
3. You can see who activated, when, the justification provided, and the duration

![PIM audit log](/azureviking-blog/images/posts/privileged-access-groups/image-17.png)

![Audit log details](/azureviking-blog/images/posts/privileged-access-groups/image-18.png)

## Benefits of Privileged Access Groups

- **Simplified management** — Manage role assignments at the group level instead of individual users
- **Reduced standing access** — Users only have elevated permissions when they need them
- **Improved auditability** — All activations are logged with justification and approval workflows
- **Scalability** — Easily onboard new team members by adding them as eligible group members
- **Consistency** — Ensure all members of a team have the same set of roles when activated
- **Approval workflows** — Require management approval for sensitive role activations

## Conclusion

Privileged Access Groups are a powerful feature in Microsoft Entra ID that can significantly simplify your privileged access management strategy. By combining group-based role assignments with PIM's just-in-time activation capabilities, you get a solution that is both more secure and easier to manage than traditional individual role assignments.

If you are already using PIM, I highly recommend exploring Privileged Access Groups as a way to streamline your access management and reduce the administrative burden of managing individual role assignments.
