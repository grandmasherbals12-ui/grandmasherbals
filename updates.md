mainly want to integrate the spabase and backend after the below mentioned changes and updates are done.
1. Membership Page Text Overlapping
Screenshot
The first screenshot shows:
30 minute Wellness Intake Assessment
AI Assisted Lifestyle Survey
Medication & Herbal Interaction Review
overlapping each other.
Fix
Find the membership card component.

2. Contact Form Submission

Client explicitly said:
"when i fill the form completely it does not let me submit"
Verify
After clicking submit:
form validates
API called
success message shown
email stored

3. Purchase Flow
Client:
customers click consult or products or memberships they need to be able to purchase
Verify Every CTA
Membership
Get Started
↓
Checkout
↓
Payment
Consult
Book Consultation
↓
Checkout
Product
Add To Cart
↓
Checkout
No dead buttons.

4. Membership Price Mismatch

Client:
prices don't match when clicked
Audit
Compare:
Card Price
Checkout Price
Stripe Price
All must match.

5. Replace Mission Statement

Current section should become:
Grandma’s Herbals delivers Integrative Regenerative Wellness through a personalized, bespoke concierge experience tailored to support your mind, body, spirit, and overall quality of life.
Use a dedicated block
Layout
OUR MISSION
Grandma’s Herbals delivers...
[Quote]
Adjusting to changing paradigms strategically & methodically.
Like the reference image- mission.png added in public folder

6. Membership Tiers Update

Client requested:

Tier 1
No consultation
Online Evaluation
Assessment Report

Tier 2
1 × 10 minute consultation
Online Evaluation
Assessment Report

Tier 3
3 × 10 minute consultations
Online Evaluation
Assessment Report
Update:
pricing cards
membership page
checkout descriptions

7. Add Therapist Section

Client requested:

Internal Medicine
Psychologist
Physiotherapist
Psychiatrist
Create New Section
Integrated Professional Support

Grid cards.

8. don't forget to resize black rock image to no border & made larger
Black Rock Image in home starting page
Client repeatedly mentioned this
Current
Small image inside card make it without border and full home page fitted.

9. Mortar & Pestle Section Overlay

Client supplied text.

Add
Bespoke Formulated Compounds

Rejuvenating
mind. body. spirit. soul

Overlay on image.
Bespoke Formulated Compounds ( non static text overlay soft auto display )
Rejuvenating 
mind. body. spirit. soul (capsule Video)

Organic Wellness ( text over auto populate soft) 
Grown in nature. Guided by Wisdom 

10. Herbal Jars Section Overlay

Add:

Organic Wellness

Grown in nature.
Guided by Wisdom.

Same style.
12. Client requested:

slow auto scroll

Update

Current:

3000ms

Change:

7000ms

13. Capsule Video

Client:

speed up capsule video

Use:

video.playbackRate = 1.25;

14. 14. Intake Form After Purchase

Flow:

Payment
↓
Intake Form
↓
Submit
↓
Welcome Page

Fields:

Name
Age
Goals
Health Concerns
Medications
Blood Pressure
Blood Sugar
Notes
15. Welcome Letter Template

Use the image client sent.

Create:

Welcome To Concierge Wellness Care

with dynamic fields:

Client Name
Age
Formula
Date
16. Progress Report Template

Create page matching screenshots.

Metrics:

Focus
Energy
Mood
Mental Clarity

with progress bars.

17. Negative Feedback Section

Client explicitly requested.

Add at end of reports:

Any concerns, side effects, or negative experiences?

Your feedback helps us improve your protocol and wellness recommendations.
PHASE 5 — QUICK FEATURES
18. Consultation Booking

After payment:

Book Consultation

Use:

Calendly
or
Google Appointment
19. Guided Breathwork Library

Create page:

Breathwork Library

with embedded videos.

20. Chair Stretch Library

Create page:

Chair Stretch Series

with embedded videos.

21. Basic Chatbot i will use openriuter api free ai afterwards.
