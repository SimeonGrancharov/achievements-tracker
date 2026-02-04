import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Achievement } from '@achievements-tracker/shared';

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

const mockCollection = {
  get: vi.fn(),
  doc: vi.fn(() => mockDocRef),
  add: vi.fn(),
};

vi.mock('../firebase', () => ({
  db: {
    collection: vi.fn(() => mockCollection),
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
    it('should return all achievements', async () => {
      mockCollection.get.mockResolvedValue({
        docs: [{ id: 'test-id', data: () => mockAchievementData }],
      });

      const result = await getAllAchievements();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'test-id',
        name: 'Q1 2024',
      });
    });

    it('should return empty array when no achievements', async () => {
      mockCollection.get.mockResolvedValue({ docs: [] });

      const result = await getAllAchievements();

      expect(result).toEqual([]);
    });
  });

  describe('getAchievementById', () => {
    it('should return achievement when found', async () => {
      const result = await getAchievementById('test-id');

      expect(result).toMatchObject({
        id: 'test-id',
        name: 'Q1 2024',
      });
    });

    it('should return null when not found', async () => {
      mockDoc.exists = false;

      const result = await getAchievementById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createAchievement', () => {
    it('should create and return new achievement', async () => {
      mockCollection.add.mockResolvedValue({ id: 'new-id' });

      const result = await createAchievement({
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
    it('should update and return achievement', async () => {
      const updatedData = { ...mockAchievementData, name: 'Updated' };
      mockDoc.data.mockReturnValue(updatedData);

      const result = await updateAchievement('test-id', { name: 'Updated' });

      expect(mockDocRef.update).toHaveBeenCalledWith({ name: 'Updated' });
      expect(result?.name).toBe('Updated');
    });

    it('should return null when not found', async () => {
      mockDoc.exists = false;

      const result = await updateAchievement('nonexistent', { name: 'Updated' });

      expect(result).toBeNull();
    });
  });

  describe('deleteAchievement', () => {
    it('should delete and return true', async () => {
      const result = await deleteAchievement('test-id');

      expect(mockDocRef.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when not found', async () => {
      mockDoc.exists = false;

      const result = await deleteAchievement('nonexistent');

      expect(result).toBe(false);
    });
  });
});
