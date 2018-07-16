# Career-Day-Campaign
Developer Sample Code Project

#### OVERVIEW & PURPOSE
A more complex version of this project was just implemented for the nationwide Panda Career Day event that will be coming out in July. The full project had 200+ supervisors and 1900+ participating locations with events covering multiple days.
For this sample, each supervisor has the opportunity to register a single store as a “Host” location to host the event.
Any stores located within 15 miles of the host location will need to be identified as a “Surrounding” store location to participate in the event.
All other stores (non “Host” or non “Surrounding” store locations) are to be considered “General” stores.
Depending on the type of the store, we will print and ship Banners, Posters, Flyers and Coupons for the event with variable data.

### OBJECTIVES
1. Create a form page with a unique URL for each supervisor to pick a single host
2. Create a report page that displays all supervisors (30 records)
3. Create a report page that displays all stores (296 records)

### ACCESS ROLES
1. Admins - Access to report and form pages
2. Supervisors - Access to form pages only

### PROVIDED RESOURCES
1. Supervisor List (in MySQL and CSV format)
2. Store List (in MySQL and CSV format)

### TECHNICAL REQUIREMENTS
1. Must be fully functional and hosted on a personal server, a hosting service or a personal laptop available during the review
2. All code must be created as a public project on either Github or Bitbucket
3. Code can be written in any web programming language (ex: php, javascript, etc)
4. Any Database (MySQL, SQLite, MSSQL, etc), but database dump is required

### SUPERVISOR FORM REQUIREMENTS
1. Create a unique URL for each supervisor (assume these URLs are emailed out to each user but the sending out the emails is not part of the sample code project)
2. The form should be designed for a single user and will display the user name
3. Users should not be able to edit any other users data (without access to URL)
4. Form Validation that checks the following (client side and/or server side):
* a. A supervisor can only pick one store
* b. Store must exist
* c. Empty/Null value is allowed
* d. Optional: validate store region matches the supervisor region
5. Multiple users can sign up for the same host store
6. Form must be functional and demonstrate reading and writing of data to the
database with changes to this form immediately reflected in the reports

### STORE REPORT REQUIREMENTS
1. All stores must be evaluated and determined to be either: 
* a. Host
* b. Surrounding (within 15 miles of a host store)
* c. General (no host stores within 15 miles)
2. Surrounding Stores should only link to the closest Host Store
3. The store report must display:
* a. ID
* b. Store Name
* c. Type of store: Host, Surrounding or General
* d. Store Region
* e. If store is a Surrounding store, then display Host ID and distance in miles to
the Host store
4. Provide Totals for the following:
* a. Total Hosts
* b. Total Surrounding Stores
* c. Total General Stores
5. Optional:
* a. Match surrounding store to host only when within the same region
* b. For the Host store locations, display an ID list and total count of its
surrounding stores

### EXPECTATIONS
1. Demonstrate ability to work with HTML Forms including validation
2. Demonstrate knowledge of the components of a URL and usage with routing
and/or parameters
3. Demonstrate familiarity and implementation of OOP and MVC
4. Demonstrate ability to calculate distances between locations
5. Demonstrate ability to manipulate the data into multiple reports (views)
6. Demonstrate basic SQL concepts (CRUD)
7. Demonstrate links between relational objects (one-to-many or many-to-many)
8. Demonstrate ability to write clean and commented code
