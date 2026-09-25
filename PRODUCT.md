# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Agile product and engineering teams, developers, designers, and project leads seeking a fast, clean Linear/Trello-style task management experience without Jira bloat. Two primary roles exist:
- **Admins:** Manage team members, invite users, update accounts/roles, create and assign tasks, and manage project-wide settings and trash bin.
- **Members:** Organize daily workflow, interact with Kanban boards, update task stages, check off subtasks, view assigned tasks, and log activity updates.

## Product Purpose
Tasker delivers a responsive, zero-friction project and task management environment. It exists to eliminate overhead and context-switching in agile execution, empowering teams to move work from conception to completion with speed, clarity, and visual delight. Success means a user can understand their priorities within 3 seconds of opening the dashboard and transition task stages effortlessly.

## Positioning
Unlike bloated enterprise trackers loaded with configuration labyrinths (e.g. Jira) or overly minimalist text-only lists, Tasker combines the visual tactility of a 3-column Kanban board with rich contextual details (embedded checklists, asset preview lightboxes, activity timeline feeds, and role-based permissions), wrapped in a fluid, high-craft dark/light UI.

## Operating Context
- **Everyday standups and sprint tracking:** Rapid board sweeps and dragging cards across stages (To Do -> In Progress -> Completed).
- **Execution & focus mode:** Deep dive into specific task cards to check off subtasks, review uploaded design mockups/assets via lightbox, and consult external reference links (Figma, GitHub, PRs).
- **Team coordination:** Logging timestamped activity updates (comments, started, in progress, bugs, assignments) directly in the task timeline.
- **Environment:** Desktop web browsers, responsive tablet/mobile viewports, supporting both dark and light ambient workspaces.

## Capabilities and Constraints
- **Kanban Board:** Fluid drag-and-drop workflow powered by `@hello-pangea/dnd` across 3 discrete stages (`todo`, `in progress`, `completed`), with optimistic local updates synced to backend API.
- **Task Management:** Full CRUD for tasks with priority categorization (High, Medium, Normal, Low), due dates, rich descriptions, multi-member assignment, subtask checklists, and cloud-stored image attachments (Cloudinary).
- **Team & Permissions:** Role-based access control (Admin vs Member); Admins can toggle account active/disabled status and manage workspace membership.
- **Trash & Recovery:** Soft deletion to a dedicated Trash Bin with individual or bulk restoration and permanent purge capabilities.
- **Theme Engine:** Instant, persistent Dark/Light mode toggle stored in `localStorage` and applied across all views.
- **Authentication:** Dual Bearer Token / Cookie-based JWT authentication, password updates, and 1-click Demo credentials for rapid testing.

## Brand Commitments
- **Name:** Tasker (Task Manager)
- **Voice:** Direct, crisp, energetic, and professional.
- **Visual Feel:** High-craft modern SaaS aesthetic, Plus Jakarta Sans typography, sleek glassmorphic surfaces, subtle glowing badges, and smooth micro-interactions.

## Evidence on Hand
- Full MERN + Redux Toolkit codebase in active development:
  - Client: `client/` (React 19, Tailwind CSS, Vite)
  - Server: `server/` (Node.js, Express, MongoDB/Mongoose)
- Pre-seeded accounts and test dataset (Admin & Member demo credentials on login).

## Product Principles
1. **Speed Over Ceremony:** Every common action (updating a stage, checking off a subtask, searching a member) must be achievable in 1 click or drag without full-page reloads.
2. **Visual Hierarchy and Scanability:** Important states (overdue dates, high priority, stage badges, progress bars) must be discernible at a glance through color, shape, and contrast.
3. **No Dead Ends:** Empty states, error boundaries, and delete actions must always provide clear, immediate paths forward (e.g., celebratory trash empty state, non-destructive restore).
4. **Delight in Details:** Micro-animations, subtle glass borders, hover states, and smooth drag physics elevate the software from a utility to an experience users enjoy using all day.

## Accessibility & Inclusion
- Semantic HTML tags, clear ARIA attributes (`aria-invalid`, `aria-hidden`) on form controls and dialogs.
- High-contrast text tokens maintained across both Light (`text-slate-900`) and Dark (`text-slate-100`) modes to ensure readability.
- Clear visual focus rings (`focus:ring-4 focus:ring-blue-500/10`) on all interactive inputs and buttons.
