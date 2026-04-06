Zealthy Mini-EMR & Patient Portal
A full-stack application featuring a Provider Dashboard (Admin) for managing clinical data and a Patient Portal for personalized health summaries.

🚀 Features
Provider Dashboard (Admin)
Path: /admin

Patient Management: View, create, and update patient profiles.

Prescriptions: Full CRUD operations for managing patient medications.

Appointments: Full CRUD operations to schedule and manage patient visits.

Access: Open access for providers (no authentication required).

Patient Portal
Path: /

Authentication: Secure login for patients to access personal health data.

Health Summary: Dashboard showing upcoming appointments and medication refills scheduled within the next 7 days.

Extended Schedule: Detailed view to explore full medical schedules up to 3 months out.

🛠️ Tech Stack
Frontend: React / Next.js

Backend: [Insert Backend Tech, e.g., Node.js / Python / Express]

Database: [Insert Database, e.g., MongoDB / PostgreSQL]

Styling: [Insert Styling, e.g., Tailwind CSS / Material UI]


📥 Installation & Setup
Clone the repository:
git clone https://github.com/shubhanshu99/zelthy.git
cd zelthy

Install dependencies:
npm install

Run the application:
npm run dev


🌐 Deployment
The live version of this project is hosted at:
https://zelthy-rose.vercel.app/

📝 Approach & Assumptions
Data Modeling: Designed a relational structure to link Patients, Appointments, and Prescriptions efficiently.

Date Logic: Implemented custom filtering logic to handle the 7-day summary and 3-month look-ahead requirements in the Patient Portal.

UI/UX: Focused on a clean, clinical interface that differentiates between the administrative and patient-facing sides of the app.

Contact
Shubhanshu Dev Puri www.shubhanshu.me
