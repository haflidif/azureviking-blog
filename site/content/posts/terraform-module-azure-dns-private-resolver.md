---
title: 'Terraform Module: Azure DNS Private Resolver'
description: 'Azure DNS Private Resolver simplifies DNS Proxy services in Azure, reducing costs and management overhead with a PaaS solution.'
pubDate: 2022-12-20
tags: [terraform, azure, dns, infrastructure-as-code]
featured: false
coverImage: '/images/posts/terraform-module-azure-dns-private-resolver/dns-resolver-architecture.jpg'
---

## Introduction

Great news for Azure networking practitioners — **Azure DNS Private Resolver** has reached **General Availability (GA)**! This is a significant milestone for organizations that have been relying on virtual machine-based DNS proxy solutions in their Azure environments.

In this post, I will cover what Azure DNS Private Resolver is, why it matters, and introduce a Terraform module I have created to simplify its deployment.

## What is Azure DNS Private Resolver?

Azure DNS Private Resolver is a **PaaS (Platform as a Service)** offering that provides DNS resolution within your Azure virtual network. It acts as a DNS proxy that can forward DNS queries between on-premises networks and Azure, as well as between different Azure virtual networks.

![Azure DNS Private Resolver architecture](/azureviking-blog/images/posts/terraform-module-azure-dns-private-resolver/dns-resolver-architecture.jpg)

Before this service, organizations typically had to deploy and manage **virtual machines running DNS server software** (such as Windows DNS Server or BIND) to provide DNS forwarding and conditional forwarding capabilities in Azure. This approach had several drawbacks that the DNS Private Resolver addresses.

## Benefits Over VM-Based DNS Servers

The shift from VM-based DNS servers to Azure DNS Private Resolver brings several significant benefits:

### Cost Reduction

- **No VM costs** — You no longer need to run dedicated VMs for DNS proxy services, saving on compute costs
- **No OS licensing** — Eliminates the need for Windows Server or Linux OS licenses for DNS VMs
- **Reduced storage costs** — No managed disks required for DNS VMs

### Reduced Management Overhead

- **No OS patching** — As a PaaS service, Microsoft handles all infrastructure maintenance and patching
- **No DNS software management** — No need to install, configure, and update DNS server software
- **No high availability configuration** — The service is built with high availability by default, eliminating the need for complex failover configurations

### Improved Reliability

- **Built-in redundancy** — The service is zone-redundant by default, providing resilience against datacenter failures
- **SLA-backed** — Comes with a Microsoft-backed SLA, unlike self-managed DNS VMs
- **Automatic scaling** — The service handles scaling automatically based on query volume

### Simplified Architecture

- **Native Azure integration** — Seamlessly integrates with Azure Private DNS Zones, Virtual Networks, and other Azure networking services
- **Inbound and outbound endpoints** — Clear separation between inbound (on-premises to Azure) and outbound (Azure to on-premises) DNS resolution
- **DNS forwarding rules** — Simple rule-based configuration for conditional forwarding

## The Terraform Module

To make deploying Azure DNS Private Resolver easier and more repeatable, I have created a Terraform module that encapsulates the deployment of all necessary resources.

### What the Module Deploys

The module creates the following resources:

- **Azure DNS Private Resolver** — The core resolver resource
- **Inbound Endpoint** — For receiving DNS queries from on-premises or other networks
- **Outbound Endpoint** — For forwarding DNS queries to on-premises or external DNS servers
- **DNS Forwarding Ruleset** — A set of rules defining where to forward specific DNS queries
- **DNS Forwarding Rules** — Individual forwarding rules for specific domains
- **Virtual Network Link** — Links the forwarding ruleset to target virtual networks

### Usage Example

```hcl
module "dns_private_resolver" {
  source  = "haflidif/azure-dns-private-resolver/azurerm"
  version = "1.0.0"

  resource_group_name = "rg-dns"
  location            = "westeurope"
  virtual_network_id  = azurerm_virtual_network.hub.id

  inbound_endpoint_subnet_id  = azurerm_subnet.dns_inbound.id
  outbound_endpoint_subnet_id = azurerm_subnet.dns_outbound.id

  forwarding_rules = {
    "onprem-contoso" = {
      domain_name        = "contoso.local."
      target_dns_servers = [
        {
          ip_address = "10.0.0.4"
          port       = 53
        }
      ]
    }
  }
}
```

![Terraform module deployment diagram](/azureviking-blog/images/posts/terraform-module-azure-dns-private-resolver/terraform-module-diagram.jpg)

## Links

- **Terraform Registry**: [haflidif/azure-dns-private-resolver/azurerm](https://registry.terraform.io/modules/haflidif/azure-dns-private-resolver/azurerm/latest)
- **GitHub Repository**: [haflidif/terraform-azurerm-azure-dns-private-resolver](https://github.com/haflidif/terraform-azurerm-azure-dns-private-resolver)
- **Azure DNS Private Resolver Documentation**: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/dns/dns-private-resolver-overview)
- **Azure DNS Private Resolver Pricing**: [Azure Pricing](https://azure.microsoft.com/en-us/pricing/details/dns/)

## Conclusion

Azure DNS Private Resolver is a welcome addition to the Azure networking toolkit. It eliminates the need for VM-based DNS proxy solutions, reducing costs, management overhead, and complexity. If you are currently running DNS proxy VMs in Azure, I highly recommend evaluating the DNS Private Resolver as a replacement.

The Terraform module I have created should help you get started quickly and deploy the resolver in a consistent, repeatable manner. Feel free to check it out on the Terraform Registry or GitHub, and do not hesitate to open issues or contribute!
