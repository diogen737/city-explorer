import axios from 'axios';

describe('CityController E2E Tests', () => {
  // Helper function to reset data before tests
  // const resetData = async () => {
  //   await axios.post('/api/cities/data-reset');
  //   await axios.post('/api/cities/data-populate');
  // };

  // beforeAll(async () => {
  //   // Ensure we have a clean state before all tests
  //   await resetData();
  // });

  describe('GET /cities/list', () => {
    it('should return paginated cities with default parameters', async () => {
      const res = await axios.get('/api/cities/list');
      expect(res.status).toBe(200);

      const dataObj = res.data;
      expect(Array.isArray(dataObj.data)).toBe(true);
      expect(dataObj.data.length).toBeLessThanOrEqual(10); // Default limit is 10

      // Check structure of returned city
      if (dataObj.data.length > 0) {
        const city = dataObj.data[0];
        expect(city).toHaveProperty('id');
        expect(city).toHaveProperty('name');
        expect(city).toHaveProperty('population');
        expect(city).toHaveProperty('landmarks');
        expect(city).toHaveProperty('country');
        expect(city.country).toHaveProperty('continent');
        expect(city).not.toHaveProperty('countryId'); // Should be omitted
      }
    });

    it('should respect pagination parameters', async () => {
      const page2Res = await axios.get('/api/cities/list?page=2&limit=3');
      expect(page2Res.status).toBe(200);

      const page2DataObj = page2Res.data;
      expect(Array.isArray(page2DataObj.data)).toBe(true);
      expect(page2DataObj.data.length).toBeLessThanOrEqual(3);

      // Get page 1 to compare
      const page1Res = await axios.get('/api/cities/list?page=1&limit=3');
      const page1DataObj = page1Res.data;

      // Pages should contain different cities
      if (page1DataObj.data.length > 0 && page2DataObj.data.length > 0) {
        const page1Ids = page1DataObj.data.map((city) => city.id);
        const page2Ids = page2DataObj.data.map((city) => city.id);

        // No city should appear in both pages
        const intersection = page1Ids.filter((id) => page2Ids.includes(id));
        expect(intersection.length).toBe(0);
      }
    });

    it('should sort cities by name in ascending order by default', async () => {
      const res = await axios.get('/api/cities/list');
      expect(res.status).toBe(200);

      const dataObj = res.data;

      if (dataObj.data.length > 1) {
        // Check if cities are sorted by name
        const names = dataObj.data.map((city) => city.name);
        const sortedNames = [...names].sort();
        expect(names).toEqual(sortedNames);
      }
    });

    it('should sort cities by specified parameters', async () => {
      // Sort by population in descending order
      const res = await axios.get('/api/cities/list?sort=population:desc');
      expect(res.status).toBe(200);

      const dataObj = res.data;
      if (dataObj.data.length > 1) {
        // Check if cities are sorted by population in descending order
        const populations = dataObj.data.map((city) => city.population);
        const sortedPopulations = [...populations].sort((a, b) => b - a);
        expect(populations).toEqual(sortedPopulations);
      }
    });

    it('should filter cities by search query', async () => {
      // First get a city name to search for
      const allCities = await axios.get('/api/cities/list?limit=100');

      if (allCities.data.length > 0) {
        const cityToSearch = allCities.data[0];
        const searchTerm = cityToSearch.name.substring(0, 3); // Use first 3 chars of name

        const res = await axios.get(`/api/cities/list?query=${searchTerm}`);
        expect(res.status).toBe(200);

        const dataObj = res.data;
        expect(dataObj.data.length).toBeGreaterThan(0);

        // All returned cities should match the search term
        dataObj.data.forEach((city) => {
          const matchesName = city.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesNativeName =
            city.name_native && city.name_native.toLowerCase().includes(searchTerm.toLowerCase());
          expect(matchesName || matchesNativeName).toBe(true);
        });
      }
    });
  });

  describe('POST /cities/data-reset', () => {
    it('should reset all data', async () => {
      const res = await axios.post('/api/cities/data-reset');
      expect(res.status).toBe(204);

      // Verify data was reset by checking cities list is empty
      const citiesRes = await axios.get('/api/cities/list');
      expect(citiesRes.data.data.length).toBe(0);
    });
  });

  describe('POST /cities/data-populate', () => {
    it('should populate data after reset', async () => {
      // First reset data
      await axios.post('/api/cities/data-reset');

      // Then populate
      const res = await axios.post('/api/cities/data-populate');
      expect(res.status).toBe(204);

      // Verify data was populated
      const citiesRes = await axios.get('/api/cities/list?limit=100');
      expect(citiesRes.data.data.length).toBeGreaterThan(0);
    });
  });

  // Test the automatic data population on application bootstrap
  describe('Application bootstrap', () => {
    it('should have data populated by default', async () => {
      // This test assumes the app has just started with the onApplicationBootstrap hook
      const res = await axios.get('/api/cities/list');

      expect(res.status).toBe(200);
      expect(res.data.data.length).toBeGreaterThan(0);
    });
  });
});
