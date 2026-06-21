---
name: mekorot-ux-designer
description: Specialized UI/UX design skill for Mekorot Water Company interfaces. Use when designing or analyzing interfaces for Mekorot, including (1) internal dashboards for water quality monitoring and infrastructure management, (2) mobile applications for field technicians, (3) public-facing websites and customer portals, (4) customer service representative tools. Supports design system implementation, user research, persona creation, wireframing, prototyping, and design feedback. Includes Mekorot brand assets and design system guidelines.
---
 
# Mekorot UX Designer
 
## Overview
 
This skill provides comprehensive UI/UX design capabilities specifically for Mekorot Water Company. It includes brand assets, design system guidelines, and specialized knowledge for designing water utility interfaces including internal dashboards, field worker mobile apps, customer portals, and operational tools.
 
## Core Capabilities
 
### 1. Interface Design and Prototyping
 
Create user interfaces for Mekorot's various platforms:
 
**Internal Dashboards**
- Water quality monitoring interfaces with real-time metrics
- Infrastructure management dashboards (pipes, pumps, treatment facilities)
- Operations center control panels
- Maintenance scheduling and tracking systems
**Mobile Applications for Field Workers**
- Issue reporting interfaces with photo upload, GPS location, and severity classification
- Work order management and task completion tracking
- Equipment and inventory management
- Offline-capable designs for field conditions
**Customer-Facing Interfaces**
- Water consumption dashboards with usage trends and bill predictions
- Account management and billing portals
- Service request submission and tracking
- Public information and educational resources
**Customer Service Representative Tools**
- Unified customer profile views with service history
- Request management and resolution workflows
- Communication logging and tracking
- Quick reference guides for common issues
### 2. Design System Implementation
 
**Always reference the official Mekorot Design System**: https://www.figma.com/design/YatUp473tmwoeaDIpVmBDP/Design-System---Mekorot?node-id=0-1&t=X40mw0Tt8wr47xks-1
 
**Visual Design References for look and feel inspiration**:
- PlantApp: https://www.figma.com/design/1YqzpFlYZO95xUIUUpbfEQ/PlantApp-fixed?node-id=116-8887&t=hmjcB3gnDWSeLN5W-1
- Hagar System: https://www.figma.com/design/LfotRpCfWCBiEAffB6jyce/Hagar-System-Designs-v04?node-id=330-3273&t=Iloe9r613NhK9Bth-1
**Use Lucide Icons**: https://lucide.dev/ - All interface icons should come from Lucide for consistency
 
When creating designs:
- Use components from the Figma Design System
- Apply visual design patterns from the PlantApp and Hagar System references (layout, cards, spacing, typography, system patterns)
- Use icons from Lucide (lucide.dev) for all interface elements
- Apply Mekorot brand colors, typography, and spacing guidelines
- Include the Mekorot logo from `assets/Logo.svg`
- Maintain consistency across all interfaces
- Support both Hebrew (RTL) and English layouts
For detailed guidelines, reference `references/design_system.md`
 
### 3. User Research and Personas
 
Create user personas for Mekorot's target audiences:
- **Field Technicians**: Age 25-50, mobile-first users, need quick issue reporting and work order management
- **Customer Service Representatives**: Age 22-55, desk-based, need comprehensive customer information and resolution tools
- **Operations Managers**: Age 35-60, data-focused, need analytics and real-time monitoring
- **Residential Customers**: All ages, varying technical literacy, need simple consumption tracking and billing
- **Municipal Managers**: Age 40-65, strategic decision-makers, need reports and trend analysis
Conduct user research through:
- Journey mapping for common workflows
- Pain point analysis
- User testing scenarios
- Accessibility evaluations
### 4. Wireframing and Information Architecture
 
Create wireframes at appropriate fidelity levels:
- **Low-fidelity**: Concept exploration, rapid iteration, basic layout
- **Mid-fidelity**: Detailed layouts, interaction patterns, content hierarchy
- **High-fidelity**: Pixel-perfect designs, final styling, production-ready
Structure information considering:
- User task flows and goals
- Content prioritization
- Navigation patterns
- Responsive behavior across devices
### 5. Design Analysis and Feedback
 
Provide comprehensive design critiques covering:
- **Usability**: Task completion efficiency, error prevention, learnability
- **Accessibility**: WCAG 2.1 AA compliance, color contrast, keyboard navigation
- **Visual Design**: Hierarchy, spacing, typography, color usage
- **Brand Consistency**: Alignment with Mekorot design system
- **Technical Feasibility**: Implementation considerations
- **Domain-Specific**: Water utility best practices, regulatory requirements
## Design Principles for Water Utilities
 
When designing for Mekorot, prioritize:
 
1. **Clarity Over Aesthetics**: Water management requires immediate understanding
2. **Safety First**: Critical alerts and emergency information must be unmissable
3. **Data Transparency**: Show consumption, quality, and operational metrics clearly
4. **Mobile Resilience**: Field interfaces must work in challenging conditions
5. **Multilingual Support**: Hebrew primary with English support, proper RTL handling
6. **Accessibility**: Serve users of all abilities and technical backgrounds
## Common Design Patterns
 
### Dashboard Layout
```
+------------------+------------------+------------------+
|   Key Metric 1   |   Key Metric 2   |   Key Metric 3   |
|   (Large Number) |   (Large Number) |   (Large Number) |
+------------------+------------------+------------------+
|                                                         |
|              Main Chart/Visualization                   |
|                                                         |
+---------------------------------------------------------+
|  Recent Activity  |            Alerts/Notifications     |
+---------------------------------------------------------+
```
 
### Mobile Issue Report Flow
1. Issue Type Selection (visual categories)
2. Photo Capture (camera integration)
3. Location Confirmation (GPS auto-fill)
4. Severity Selection (clear visual indicators)
5. Additional Notes (optional text field)
6. Submit with offline queue support
### Alert Priority System
- **Critical** (Red): Immediate action required, potential safety hazard
- **High** (Orange): Urgent, affects service quality
- **Medium** (Yellow): Important, scheduled maintenance needed
- **Low** (Blue): Informational, routine monitoring
## Deliverable Formats
 
Create designs as:
- **HTML/CSS Artifacts**: Interactive prototypes for web interfaces
- **React Components**: Reusable UI components using Mekorot design system
- **Figma-Compatible Code**: For integration with the design system
- **Markdown Documentation**: Design specifications, user flows, personas
- **Diagrams**: User journey maps, information architecture, flowcharts
## Resources
 
### Brand Assets
- **Logo**: `assets/Logo.svg` - Official Mekorot logo for use in all designs
### Design References  
- **Design System Guidelines**: `references/design_system.md` - Comprehensive guide including Figma link, color usage, typography, accessibility standards, and water utility best practices
### Integration with Figma
When designing, you can:
- Reference the Figma Design System for specific component specifications
- Use the Figma tool to fetch actual components and styles
- Generate code that matches the design system conventions
- Ensure consistency with existing Mekorot interfaces
 