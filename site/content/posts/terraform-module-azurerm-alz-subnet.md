---
title: 'Terraform Module: azurerm-alz-subnet'
slug: 'terraform-module-azurerm-alz-subnet'
description: 'A Terraform module to deploy subnets with NSG and route table associations as a workaround for Azure Landing Zone policy conflicts.'
pubDate: 2024-03-15
tags: [terraform, azure, infrastructure-as-code, modules]
category: blog
featured: false
coverImage: '/images/posts/terraform-module-azurerm-alz-subnet/cover.jpg'
---

## Introduction

I am excited to announce the release of **v2.0** of my Terraform module: **azurerm-alz-subnet**. This module was created to address a specific pain point that many Azure practitioners encounter when working with Terraform and Azure Landing Zone (ALZ) policies.

In this post, I will explain why this module exists, the underlying issue it solves, and what is new in v2.0.

## Why Was This Module Created?

If you have worked with Azure Landing Zones and Terraform, you may have encountered a frustrating issue: **the `azurerm_subnet` resource in the AzureRM Terraform provider conflicts with Azure Landing Zone policies** that enforce Network Security Groups (NSGs) and Route Tables on subnets.

### The Problem

Azure Landing Zone policies include built-in policies that enforce NSG and Route Table associations on subnets. These policies are designed to ensure that all subnets have proper network security controls in place. However, the way the `azurerm_subnet` resource in Terraform handles NSG and Route Table associations creates a conflict.

Here is what happens:

1. You deploy a subnet using `azurerm_subnet` with an NSG and Route Table association
2. The Azure Landing Zone policy detects the subnet and verifies the NSG/Route Table association
3. On the next `terraform plan`, Terraform detects a "drift" because the policy has modified the subnet's state
4. Terraform wants to "fix" the drift by removing the association and re-adding it
5. This creates a cycle where every `terraform apply` triggers changes, and the policy fights with Terraform

This issue has been well-documented in the community and has been a source of frustration for many teams adopting Infrastructure as Code with Azure Landing Zones.

### Related GitHub Issues

This problem has been discussed extensively in the Terraform AzureRM provider GitHub repository:

- [hashicorp/terraform-provider-azurerm - Issue regarding subnet NSG association conflicts](https://github.com/hashicorp/terraform-provider-azurerm/issues/)
- [Azure/terraform-azurerm-caf-enterprise-scale - ALZ policy conflict discussions](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale/issues/)

### The Solution

The **azurerm-alz-subnet** module works around this issue by using a combination of the `azurerm_subnet`, `azurerm_subnet_network_security_group_association`, and `azurerm_subnet_route_table_association` resources instead of relying on the inline NSG and Route Table properties of the `azurerm_subnet` resource.

By separating the subnet creation from the NSG and Route Table associations, the module avoids the drift cycle caused by the ALZ policies. This approach ensures that:

- Subnets are created cleanly without inline associations
- NSG associations are managed as separate resources
- Route Table associations are managed as separate resources
- ALZ policies can enforce their rules without conflicting with Terraform state

## What's New in v2.0

Version 2.0 of the module brings several improvements:

- **Simplified interface** — The module input variables have been streamlined for easier use
- **Support for multiple subnets** — You can now deploy multiple subnets with their respective NSG and Route Table associations in a single module call
- **Service endpoint support** — Added support for configuring service endpoints on subnets
- **Subnet delegation support** — Added support for subnet delegations (e.g., for Azure Container Instances, App Service, etc.)
- **Improved documentation** — Updated README with comprehensive examples and usage instructions

## Usage Example

```hcl
module "subnet" {
  source  = "haflidif/alz-subnet/azurerm"
  version = "2.0.0"

  resource_group_name  = "rg-network"
  virtual_network_name = "vnet-hub"

  subnets = {
    "snet-workload" = {
      address_prefixes                  = ["10.0.1.0/24"]
      network_security_group_id         = azurerm_network_security_group.nsg.id
      route_table_id                    = azurerm_route_table.rt.id
      service_endpoints                 = ["Microsoft.Storage", "Microsoft.KeyVault"]
    }
  }
}
```

## Conclusion

The **azurerm-alz-subnet** module provides a clean workaround for the well-known conflict between Terraform's `azurerm_subnet` resource and Azure Landing Zone policies. If you are deploying subnets in an Azure Landing Zone environment using Terraform, this module can save you significant time and frustration.

Check out the module on:

- [Terraform Registry](https://registry.terraform.io/modules/haflidif/alz-subnet/azurerm/latest)
- [GitHub Repository](https://github.com/haflidif/terraform-azurerm-alz-subnet)

Feel free to open issues or contribute to the module. Your feedback is always welcome!
