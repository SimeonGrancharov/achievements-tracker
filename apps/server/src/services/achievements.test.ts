import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AchievementGroup } from '@achievements-tracker/shared';

const TEST_UID = 'user-123';

const mockDoc = {
  id: 'test-id',
  exists: true,
  data: vi.fn(),
};

const mockDocRef = {
  get: vi.fn(() => Promise.resolve(mockDoc)),
  update: vi.fn(() => Promise.resolve()),
  delete: vi.fn(() => Promise.resolve()),
};

const mockSubcollection = {
  get: vi.fn(),
  doc: vi.fn(() => mockDocRef),
  add: vi.fn(),
};

const mockUserDoc = {
  collection: vi.fn(() => mockSubcollection),
};

const mockUsersCollection = {
  doc: vi.fn(() => mockUserDoc),
};

vi.mock('../firebase', () => ({
  db: {
    collection: vi.fn(() => mockUsersCollection),
  },
}));

const { getAllAchievements, getAchievementById, createAchievement, updateAchievement, deleteAchievement } = await import('./achievements');

describe('achievements service', () => {
  const mockAchievementData = {
    name: 'Q1 2024',
    description: 'First quarter',
    createdAt: 1234567890,
    achievements: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.data.mockReturnValue(mockAchievementData);
    mockDoc.exists = true;
  });

  describe('getAllAchievements', () => {
    it('should return all achievement groups', async () => {
      mockSubcollection.get.mockResolvedValue({
        docs: [{ id: 'test-id', data: () => mockAchievementData }],
      });

      const result = await getAllAchievements(TEST_UID);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'test-id',
        name: 'Q1 2024',
      });
    });

    it('should return empty array when no achievement groups', async () => {
      mockSubcollection.get.mockResolvedValue({ docs: [] });

      const result = await getAllAchievements(TEST_UID);

      expect(result).toEqual([]);
    });
  });

  describe('getAchievementById', () => {
    it('should return achievement group when found', async () => {
      const result = await getAchievementById(TEST_UID, 'test-id');

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Q1 2024',
      });
    });

    it('should return null when not found', async () => {
      mockDoc.exists = false;

      const result = await getAchievementById(TEST_UID, 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createAchievement', () => {
    it('should create and return new achievement group', async () => {
      mockSubcollection.add.mockResolvedValue({ id: 'new-id' });

      const result = await createAchievement(TEST_UID, {
        name: 'Q2 2024',
        description: 'Second quarter',
        achievements: [],
      });

      expect(result.id).toBe('new-id');
      expect(result.name).toBe('Q2 2024');
      expect(result.createdAt).toBeDefined();
    });
  });

  describe('updateAchievement', () => {
    it('should update and return achievement group', async () => {
      const updatedData = { ...mockAchievementData, name: 'Updated' };
      mockDoc.data.mockReturnValue(updatedData);

      const result = await updateAchievement(TEST_UID, 'test-id', { name: 'Updated' });

      expect(mockDocRef.update).toHaveBeenCalledWith({ name: 'Updated' });
      expect(result?.name).toBe('Updated');
    });

    it('should return null when not found', async () => {
      mockDoc.exists = false;

      const result = await updateAchievement(TEST_UID, 'nonexistent', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('deleteAchievement', () => {
    it('should delete and return true', async () => {
      const result = await deleteAchievement(TEST_UID, 'test-id');

      expect(mockDocRef.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when not found', async () => {
      mockDoc.exists = false;

      const result = await deleteAchievement(TEST_UID, 'nonexistent');

      expect(result).toBe(false);
    });
  });
});
