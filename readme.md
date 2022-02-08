## API Index

### State
- [x] API for listing all States
- [x] Create new State
- [x] View State details
- [x] List all State Districts
- [x] Update State
- [x] Delete a State

### District
States have multiple districts
- [x] Create new Districts
- [x] View District details
- [x] Update District
- [x] Delete a District
- [ ] API for listing all vaccination centers in a restaurant
- [ ] API for searching vaccination centers by pincode

### Vaccination Center
Every 
- [x] Create new Vaccination Center
- [x] View Vaccination Center details
- [x] Update Vaccination Center
- [x] Delete a Vaccination Center
- [x] List Appointments by Center 
- [x] API for all available Vaccination Slot in a given date range

### Vaccination Slot

#### Every Vaccination Center can upload VaccinationSlots for a given date.  

__VaccinationSlot__ model has the following attributes:  
*vaccinationCenter(ref) date, totalSlot, availableSlot*  

- [x] API for creating a VaccinationSlot
- [x] View VaccinationSlot details
- [x] Update VaccinationSlot
- [x] Delete a VaccinationSlot

### User
Users can signup to this application using email and password. 
__User__ model should have the following attributes:  *mobile, password (type: string)*.
*Tip:* Can use Passport and JWT for user authentication module -> Not Integrated

- [x] API for user signup/signin
- [x] API to get user details

### Member - (Not implemented)
Users can add upto 4 members or benificiary. 
__Member__ model should have the following attributes: *name, aadhaarNumber, age, dose1Taken (boolean), dose2Taken(boolean)*.

- [ ] API for adding a member
- [ ] API to removing an member

### Appointment
Users can book appointment for a member. __Appointment__ model should have the following attributes: *vaccinationCenter (ref), date, status (scheduled, vaccinated), vaccinatedBy (name of the doctor who vaccinated the member)*.
- [x] Create new Appointment for a member
- [x] View Appointment details
- [x] Cancel an Appointment
- [x] Update an Appointment
- [x] Get Appointments by ID

## How to Contribute  

- Make sure you understand the requirement well.
- Fork this repository to your github account.
- Do the changes and create a Pull Request.
- Remember the PR should have clean code, proper comments, proper commits with messages.
- Many others can also make PR, but the most complete one will be merged.
- You can also create PR for this Readme, if you have any relevant module in mind for this repo, to make it even more awesome!!