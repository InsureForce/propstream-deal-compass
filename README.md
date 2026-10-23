# Propstream Deal Compass

Act as an elite full-stack engineer and premium UI designer. Build a high-fidelity B2B SaaS prototype for a Commercial Real Estate (CRE) Broker Portal called "PropStream" using React, Tailwind CSS, Lucide Icons, and clean components. 

The software must dynamically adapt to 3 distinct user roles. Create a premium sticky left sidebar navigation that includes a visible, highly interactive "User Role Switcher" dropdown at the top. The roles are:

1. "CompanyAdmin" (SaaS Provider / Backend Control Panel): This view contains point-and-click configuration tools. It must include:

   - A "White-Labeling Engine": Input fields to change the platform logo text, select global accent colors via a point-and-click mockup color box, and change the system layout theme.

   - A "Global Settings Console": Active toggle buttons to turn the "AI Copilot" or "1031 Tax Clock" features ON or OFF globally, and text fields to configure corporate ACH/Wire routing and account details.

   - A "Contract Management Desk": A text area to input and edit the default Statement of Work (SOW) text template.

2. "BrokerAdmin" (The CRE Firm Owner / Principal): A premium analytics dashboard showing company-wide volume ($82M total volume), active transactions across multiple regional offices, recent firm activity feeds, and broker tracking lists.

3. "Broker" (The Producer / Agent): A personal agent dashboard displaying their individual active pipelines, personal commission targets, active 1031 exchange clients, and the AI tools.

Implement a layout shell where clicking sidebar items updates the main view window smoothly. The sidebar navigation links are: Overview Dashboard, STNL Pipeline, IOS Pipeline, 1031 Tax Clock, AI Copilot, and Enterprise Billing. Use a clean, ultra-modern B2B SaaS aesthetic with sharp card outlines, elegant typography, and plenty of whitespace. Ensure all data fields are pre-populated with highly realistic US commercial real estate data.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://propstream-deal-compass.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6db48f48-7678-4715-92fa-03b608af0d85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
