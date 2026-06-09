Set-Content -Path .\README.md -Value @'
# Contact List API Automated Smoke Tests

This project contains an automated API testing suite built with **Cypress** to validate the `Contact List App` API hosted on https://thinking-tester-contact-list.herokuapp.com/contactList . It tests the complete lifecycle of users and contacts, including registration, authentication, profile updates, and full CRUD (Create, Read, Update, Delete) data operations.

---

## 🎲 What does Faker do here?

At the top of the test file, you'll see blocks of code structured like this:

```javascript
const userPayload = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 10 })
};

# 🔍 Understanding the "Jimmy Leftbehind" Logic

## What does "Jimmy Leftbehind" do?

In the final section of the test suite (`Proof of Execution`), the script performs an intentional administrative "audit trail" check. Instead of cleaning up after itself like the previous tests, this specific block handles data creation differently:

1. **Creates an Evidence User:** It leverages `Faker.js` to register a brand-new, completely randomized user account on the live server.
2. **Generates the Contact:** Inside that new account, it fires a `POST` request to create a static contact named **Jimmy Leftbehind**.
3. **Omits Cleanup:** The script **intentionally skips** running a `DELETE` request at the end of this block. 

### Why do this?
This serves as a **Proof of Test Execution**. Because the contact is never deleted, it remains live in the Heroku database. Anyone with the account credentials can log into the web application via a browser and physically see "Jimmy Leftbehind" sitting in the dashboard, proving beyond doubt that the automated script successfully ran and communicated with the server.

---

## 🔑 How to Find the Login Details.

Because `Faker.js` randomizes the account's email and password on every single test run to prevent system conflicts, you cannot guess the login details. You can retrieve them using one of the two methods below:

### Method 1: Check the Generated Text File (Automated)
The script includes a file-system task designed to write the credentials directly to your local workspace right before creating the user:
```javascript
cy.task('saveCredentials', credentials);

# 🚀 CI/CD Pipeline: Cypress API Smoke Suite

This repository features an automated **Continuous Integration (CI)** pipeline powered by **GitHub Actions**. It ensures code quality and backend stability by automatically executing the test suite in an isolated cloud environment every time changes are proposed or made.

---

## 📋 What Does This Workflow Do?

The configuration file defines a series of automated triggers, environments, and sequential execution steps to run your Cypress API smoke tests. Here is a breakdown of how it works under the hood:

### 1. Automated Event Triggers (`on:`)
The pipeline monitors your repository and wakes up automatically under two core scenarios:
* **`push` to `main`:** Any time code is directly merged or pushed into your primary production branch.
* **`pull_request` to `main`:** Any time a developer opens a pull request trying to merge new code into `main`. This allows the pipeline to act as a **gatekeeper**, ensuring no broken code gets merged.

### 2. Isolated Cloud Execution Environment (`runs-on:`)
When triggered, GitHub spins up a clean, disposable virtual machine in their cloud infrastructure:
* **OS Platform:** `ubuntu-latest` (The fastest, most secure, and industry-standard Linux runner).
* This eliminates the *"it works on my machine"* dilemma by executing the tests in an completely standardized environment.

---

## 🛠️ Step-by-Step Execution Sequence

Inside the virtual cloud machine, the workflow carries out these specific, sequential steps to validate your application:

```text
  [1. Checkout Repository] ➔ [2. Install Node.js] ➔ [3. Clean Install (npm ci)] ➔ [4. Run Cypress Tests]