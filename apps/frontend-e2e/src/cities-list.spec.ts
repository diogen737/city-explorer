import { test, expect } from '@playwright/test';

const DEFAULT_PAGE_SIZE = 3;

test('reality check + list sorting', async ({ page }) => {
  await page.goto('/');

  // wait for the spinner to disappear
  await expect(page.getByTestId('spinner')).toHaveCount(0);

  const cityNames = await Promise.all(
    (await page.locator('app-city-card').all()).map(async (card) => await card.locator('h3').innerText()),
  );

  expect(cityNames.length).toBe(DEFAULT_PAGE_SIZE);

  const firstCityName = cityNames[0];
  const lastCityName = cityNames[cityNames.length - 1];
  // sorted in ascending order
  expect(firstCityName.localeCompare(lastCityName)).toBeLessThan(0);

  // sort by population
  await page.getByTestId('sort-select').click();
  await page.getByRole('option', { name: 'Name (Desc)' }).click();

  // wait for the spinner to disappear
  await expect(page.getByTestId('spinner')).toHaveCount(0);

  const cityNamesDesc = await Promise.all(
    (await page.locator('app-city-card').all()).map(async (card) => await card.locator('h3').innerText()),
  );

  expect(cityNamesDesc.length).toBe(DEFAULT_PAGE_SIZE);
  const firstCityNameDesc = cityNamesDesc[0];
  const lastCityNameDesc = cityNamesDesc[cityNamesDesc.length - 1];
  // sorted in descending order
  expect(firstCityNameDesc.localeCompare(lastCityNameDesc)).toBeGreaterThan(0);
});

test('list search filter', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('searchbox').fill('munich');

  // wait for entry quote spinner to disappear
  await expect(page.getByTestId('spinner')).toHaveCount(0);

  await expect(page.locator('app-city-card')).toHaveCount(1);
  expect(await page.locator('app-city-card').first().locator('h3').innerText()).toContain('Munich');

  // clear the search
  await page.getByRole('searchbox').fill('');
  await expect(page.locator('app-city-card')).toHaveCount(DEFAULT_PAGE_SIZE);

  // search for gibberish
  await page.getByRole('searchbox').fill('asdfasdfasdf');
  await expect(page.locator('app-city-card')).toHaveCount(0);
});
