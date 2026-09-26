import { test, expect } from '@playwright/test';

test.describe('Public pages smoke tests', () => {
  test('/ renders the hero and FAQ', async ({ page }) => {
    await page.goto('/');

    // Hero section checks
    const hero = page.locator('section').first();
    const heroHeading = hero.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText("Tickets that can't be");

    await expect(
      hero.getByRole('link', { name: 'Start issuing tickets' }),
    ).toBeVisible();
    await expect(
      hero.getByRole('link', { name: 'Browse the marketplace' }),
    ).toBeVisible();

    // FAQ section checks
    const faqHeading = page.getByRole('heading', { name: 'Frequently asked' });
    await expect(faqHeading).toBeVisible();

    const faqQuestion = page.getByText(
      'Do I need to know anything about crypto to use this?',
    );
    await expect(faqQuestion).toBeVisible();

    // Opening an FAQ item reveals the answer
    await faqQuestion.click();
    await expect(
      page.getByText('To browse events and read ticket data, no.'),
    ).toBeVisible();
  });

  test('the navbar collapses into the mobile menu at 390px width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Desktop nav container is hidden on small screens
    const desktopNavLinks = page.locator('header nav .md\\:flex');
    for (const locator of await desktopNavLinks.all()) {
      await expect(locator).toBeHidden();
    }

    // Mobile menu toggle button is visible
    const menuToggle = page.getByRole('button', { name: 'Open menu' });
    await expect(menuToggle).toBeVisible();

    // Click to open mobile menu
    await menuToggle.click();

    // Menu toggle changes label to Close menu
    const closeToggle = page.getByRole('button', { name: 'Close menu' });
    await expect(closeToggle).toBeVisible();

    // Navigation links in the mobile menu are visible
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Security' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Marketplace' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Get started' })).toBeVisible();
  });

  test('/login submits a mocked API failure and shows the error', async ({
    page,
  }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid email or password' }),
      });
    });

    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(
      page.getByText('Invalid email or password'),
    ).toBeVisible();
  });

  test('/register submits a mocked API failure and shows the error', async ({
    page,
  }) => {
    await page.route('**/auth/register', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email already registered' }),
      });
    });

    await page.goto('/register');

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('existing@example.com');
    await page.getByLabel('Password').fill('validPassword123');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(
      page.getByText('Email already registered'),
    ).toBeVisible();
  });

  test('unauthenticated visit to /dashboard lands on /login', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole('heading', { name: 'Welcome back' }),
    ).toBeVisible();
  });
});
