/**
 * CONTACT LIST API SMOKE TESTS
 * 
 * This test suite performs comprehensive API testing for a Contact List application using Cypress.
 * It validates all CRUD operations for contacts and users, as well as authentication flows.
 * 
 * Test Coverage:
 * - User Management: Registration, login/logout, profile updates, and account deletion
 * - Contact Management: Create, read, update (PUT/PATCH), and delete contact records
 * - Authentication: Token-based authorization and session management
 * 
 * Test Data:
 * - Uses Faker.js library to generate dynamic, realistic test data for each test run
 * - Stores authentication tokens and IDs for use across dependent tests
 * 
 * Prerequisites:
 * - Cypress must be installed and configured
 * - API base URL points to: https://thinking-tester-contact-list.herokuapp.com
 */

import { faker } from '@faker-js/faker';

describe('Contact List API Smoke Tests', () => {
  const baseUrl = 'https://thinking-tester-contact-list.herokuapp.com';
  
  // Variables to hold dynamic test data (replaces Postman Environment Variables)
  let authToken;
  let userId;
  let contactId;
  
  // Dynamic user data generated once per test suite
  const userPayload = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 })
  };

  const updatedUserPayload = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 })
  };

  // --- CONTACTS FOLDER TESTS ---
  context('Contacts Management', () => {

    it('Setup: Add User', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users`,
        body: userPayload
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('token');
        
        // Save token and userId for subsequent requests
        authToken = response.body.token;
        userId = response.body.user._id;
      });
    });

    it('Add Contact', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/contacts`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          firstName: "Pamela", // Changed from Prunella
          lastName: "Prunewhip",
          birthdate: "1977-07-04",
          email: "foo@bar.com",
          phone: "8005551000",
          street1: "1 Main St.",
          street2: "Apartment Q",
          city: "Anytown",
          stateProvince: "KS",
          postalCode: "12345",
          country: "USA"
        }
      }).then((response) => {
        expect(response.status).to.eq(201);
        contactId = response.body._id; 
      });
    });

    it('Get Contact List', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/contacts`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(JSON.stringify(response.body)).to.include('firstName');
      });
    });

    it('Get Contact', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/contacts/${contactId}`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
        const data = response.body;
        expect(data.firstName).to.eq("Pamela"); // Changed from Prunella
        expect(data.lastName).to.eq("Prunewhip");
        expect(data.birthdate).to.eq("1977-07-04");
        expect(data.email).to.eq("foo@bar.com");
        expect(data.phone).to.eq("8005551000");
        expect(data.street1).to.eq("1 Main St.");
        expect(data.street2).to.eq("Apartment Q");
        expect(data.city).to.eq("Anytown");
        expect(data.stateProvince).to.eq("KS");
        expect(data.postalCode).to.eq("12345");
        expect(data.country).to.eq("USA");
      });
    });

    it('Update Contact (PUT)', () => {
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/contacts/${contactId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          firstName: "Pamela", // Changed from Joe
          lastName: "Schmoe",
          birthdate: "1980-06-30",
          email: "fake@foo.com",
          phone: "8005551001",
          street1: "2 Elm St.",
          street2: "Unit 2",
          city: "Springfield",
          stateProvince: "ON",
          postalCode: "L8R1P8",
          country: "Canada"
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        const data = response.body;
        expect(data.firstName).to.eq("Pamela"); // Changed from Joe
        expect(data.lastName).to.eq("Schmoe");
        expect(data.birthdate).to.eq("1980-06-30");
        expect(data.email).to.eq("fake@foo.com");
        expect(data.phone).to.eq("8005551001");
        expect(data.street1).to.eq("2 Elm St.");
        expect(data.street2).to.eq("Unit 2");
        expect(data.city).to.eq("Springfield");
        expect(data.stateProvince).to.eq("ON");
        expect(data.postalCode).to.eq("L8R1P8");
        expect(data.country).to.eq("Canada");
      });
    });

    it('Update Contact (PATCH)', () => {
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/contacts/${contactId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { firstName: "Kristin" }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.firstName).to.eq("Kristin");
      });
    });

    it('Delete Contact', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/contacts/${contactId}`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq("Contact deleted");
      });
    });

    it('Verify Contact Deleted', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/contacts/${contactId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false  // Do not fail on non-2xx status codes to allow verification
      }).then((response) => {
        // Verify the contact returns a 404 Not Found status
        expect(response.status).to.eq(404);
      });
    });

    it('Cleanup: Delete User', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/users/me`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  // --- USERS FOLDER TESTS ---
  context('Users Management', () => {
    
    // Create a new user account with dynamically generated credentials
    it('Add User', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users`,
        body: userPayload
      }).then((response) => {
        // Verify user registration was successful (HTTP 201 Created)
        expect(response.status).to.eq(201);
        // Extract and store the auth token for subsequent authenticated requests
        authToken = response.body.token;
        // Extract and store the user ID for profile management operations
        userId = response.body.user._id;
      });
    });

    // Retrieve the authenticated user's profile information
    it('Get User Profile', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/me`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        // Verify the profile retrieval was successful (HTTP 200 OK)
        expect(response.status).to.eq(200);
        // Verify the profile contains the correct user ID
        expect(response.body._id).to.eq(userId);
        // Verify first name matches the registered data
        expect(response.body.firstName).to.eq(userPayload.firstName);
        // Verify last name matches the registered data
        expect(response.body.lastName).to.eq(userPayload.lastName);
        // Verify email matches the registered data
        expect(response.body.email).to.eq(userPayload.email);
      });
    });

    // Update the user's profile with new credentials
    it('Update User', () => {
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/users/me`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: updatedUserPayload
      }).then((response) => {
        // Verify the profile update was successful (HTTP 200 OK)
        expect(response.status).to.eq(200);
        // Verify the user ID remains unchanged
        expect(response.body._id).to.eq(userId);
        // Verify first name was updated to the new value
        expect(response.body.firstName).to.eq(updatedUserPayload.firstName);
        // Verify last name was updated to the new value
        expect(response.body.lastName).to.eq(updatedUserPayload.lastName);
        // Verify email was updated to the new value
        expect(response.body.email).to.eq(updatedUserPayload.email);
      });
    });

    // Log out the current user and invalidate the auth token
    it('Log Out User', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users/logout`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        // Verify logout was successful (HTTP 200 OK)
        expect(response.status).to.eq(200);
      });
    });

    // Authenticate with the updated user credentials to obtain a new session token
    it('Log In User', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users/login`,
        body: {
          email: updatedUserPayload.email,
          password: updatedUserPayload.password
        }
      }).then((response) => {
        // Verify login was successful (HTTP 200 OK)
        expect(response.status).to.eq(200);
        // Extract and store the new auth token from the login response
        authToken = response.body.token;
        // Verify the logged-in user ID matches the expected user
        expect(response.body.user._id).to.eq(userId);
        // Verify the user's first name in the response matches the updated profile
        expect(response.body.user.firstName).to.eq(updatedUserPayload.firstName);
      });
    });

    // Delete the user account from the system
    it('Delete User', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/users/me`,
        headers: { Authorization: `Bearer ${authToken}` }
      }).then((response) => {
        // Verify user deletion was successful (HTTP 200 OK)
        expect(response.status).to.eq(200);
      });
    });

    // Verify that the deleted user account no longer exists and cannot be accessed
    it('Verify User Deleted', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/me`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false  // Do not fail on non-2xx status codes to allow verification
      }).then((response) => {
        // Verify the account returns 401 Unauthorized (token is no longer valid)
        expect(response.status).to.eq(401);
      });
    });
  });

  // ============================================
  // PROOF OF EXECUTION TEST
  // Creates a final contact as evidence that tests ran
  // ============================================
  context('Proof of Execution', () => {
    
    // Create a new user for the final contact
    it('Create Evidence User', () => {
      const evidenceUserPayload = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 10 })
      };

      // Save credentials to a file for easy access
      const credentials = `TEST CREDENTIALS - USE TO VIEW JIMMY LEFTBEHIND\n\nEmail: ${evidenceUserPayload.email}\nPassword: ${evidenceUserPayload.password}`;
      cy.task('saveCredentials', credentials);

      cy.request({
        method: 'POST',
        url: `${baseUrl}/users`,
        body: evidenceUserPayload
      }).then((response) => {
        // Verify user creation was successful
        expect(response.status).to.eq(201);
        // Save token and userId for the evidence contact
        authToken = response.body.token;
        userId = response.body.user._id;
      });
    });

    // Create the "Jimmy Leftbehind" contact as proof tests ran
    it('Create Jimmy Leftbehind - Proof of Test Execution', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/contacts`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          firstName: "Jimmy",
          lastName: "Leftbehind",
          birthdate: "1985-01-01",
          email: "jimmy@testevidence.com",
          phone: "5551234567",
          street1: "123 Test Ave",
          street2: "",
          city: "Automation City",
          stateProvince: "TC",
          postalCode: "12345",
          country: "USA"
        }
      }).then((response) => {
        // Verify contact creation was successful
        expect(response.status).to.eq(201);
        // This contact is intentionally NOT deleted - it's left as proof
      });
    });
  });
});